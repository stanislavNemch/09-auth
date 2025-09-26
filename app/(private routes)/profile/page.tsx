"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image"; // Используем Image из Next.js
import { getCurrentUser } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./ProfilePage.module.css";
import { useEffect } from "react";

export default function ProfilePage() {
    const { setUser } = useAuthStore();

    const {
        data: user,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["user-profile"],
        queryFn: getCurrentUser,
        retry: false, // Не повторять запрос при ошибке
    });

    // Синхронизируем данные из запроса с состоянием Zustand
    useEffect(() => {
        if (user) {
            setUser(user);
        }
    }, [user, setUser]);

    if (isLoading) {
        return <p>Loading profile...</p>;
    }

    if (isError) {
        return <p>Error loading profile: {error.message}</p>;
    }

    return (
        <main className={css.mainContent}>
            <div className={css.profileCard}>
                <div className={css.header}>
                    <h1 className={css.formTitle}>Profile Page</h1>
                    <Link
                        href="/profile/edit"
                        className={css.editProfileButton}
                    >
                        Edit Profile
                    </Link>
                </div>
                <div className={css.avatarWrapper}>
                    <Image
                        src={user?.avatar || "/default-avatar.png"}
                        alt="User Avatar"
                        width={120}
                        height={120}
                        className={css.avatar}
                        priority
                    />
                </div>
                <div className={css.profileInfo}>
                    <p>
                        <strong>Username:</strong> {user?.username}
                    </p>
                    <p>
                        <strong>Email:</strong> {user?.email}
                    </p>
                </div>
            </div>
        </main>
    );
}
