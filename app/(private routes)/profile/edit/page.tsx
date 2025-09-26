"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { getCurrentUser, updateUserProfile } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user: authUser, setUser } = useAuthStore();
    const [username, setUsername] = useState("");

    // 1. Получаем текущие данные пользователя для заполнения формы
    const {
        data: user,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["user-profile"],
        queryFn: getCurrentUser,
        staleTime: 5 * 60 * 1000, // Кешируем данные на 5 минут
    });

    // 2. Устанавливаем начальное значение для инпута, когда данные загружены
    useEffect(() => {
        if (user) {
            setUsername(user.username);
            // Также обновляем данные в Zustand на всякий случай
            if (!authUser || authUser.id !== user.id) {
                setUser(user);
            }
        }
    }, [user, authUser, setUser]);

    // 3. Создаем мутацию для обновления профиля
    const mutation = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: (updatedUser) => {
            toast.success("Profile updated successfully!");
            setUser(updatedUser); // Обновляем состояние в Zustand
            // Инвалидируем кеш, чтобы на странице профиля были свежие данные
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
            router.push("/profile"); // Перенаправляем на страницу профиля
        },
        onError: () => {
            toast.error("Failed to update profile. Please try again.");
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (username.trim() === user?.username) {
            toast.error("You haven't changed anything.");
            return;
        }
        mutation.mutate({ username: username.trim() });
    };

    if (isLoading) {
        return <p>Loading editor...</p>;
    }

    if (isError || !user) {
        return <p>Could not load user data to edit.</p>;
    }

    return (
        <main className={css.mainContent}>
            <Toaster position="top-right" />
            <div className={css.profileCard}>
                <h1 className={css.formTitle}>Edit Profile</h1>
                <Image
                    src={user.avatar || "/default-avatar.png"}
                    alt="User Avatar"
                    width={120}
                    height={120}
                    className={css.avatar}
                />
                <form className={css.profileInfo} onSubmit={handleSubmit}>
                    <div className={css.usernameWrapper}>
                        <label htmlFor="username">Username:</label>
                        <input
                            id="username"
                            type="text"
                            className={css.input}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                    <div className={css.actions}>
                        <button
                            type="submit"
                            className={css.saveButton}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Saving..." : "Save"}
                        </button>
                        <button
                            type="button"
                            className={css.cancelButton}
                            onClick={() => router.back()} // Просто возвращаемся назад
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
