"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { getCurrentUser } from "@/lib/api/clientApi";

// Список приватных маршрутов
const privateRoutes = ["/notes", "/profile"];

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, setUser, clearAuthState } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // Проверяем, является ли текущий маршрут приватным
            const isPrivateRoute = privateRoutes.some((route) =>
                pathname.startsWith(route)
            );

            if (isPrivateRoute) {
                try {
                    // Пытаемся получить данные о пользователе
                    const user = await getCurrentUser();
                    setUser(user); // Если успешно, обновляем состояние
                } catch (error) {
                    // Если токен невалидный или сессия истекла
                    clearAuthState();
                    router.replace("/sign-in"); // Перенаправляем на страницу входа
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, [pathname, router, setUser, clearAuthState]);

    // Пока идет проверка, показываем лоадер
    if (isLoading) {
        return <p>Loading, please wait...</p>;
    }

    return <>{children}</>;
};

export default AuthProvider;
