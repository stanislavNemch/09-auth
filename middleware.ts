import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Список приватных маршрутов, которые требуют авторизации
const privateRoutes = ["/notes", "/profile"];

// Список публичных маршрутов, которые доступны только неавторизованным пользователям
const authRoutes = ["/sign-in", "/sign-up"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;

    // Проверяем, является ли текущий маршрут приватным
    const isPrivateRoute = privateRoutes.some((route) =>
        pathname.startsWith(route)
    );

    // Проверяем, является ли текущий маршрут страницей аутентификации
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    if (isPrivateRoute && !accessToken) {
        // Если пользователь не авторизован и пытается зайти на приватный маршрут,
        // перенаправляем его на страницу входа.
        // Мы также добавляем `next` параметр, чтобы после входа вернуть его обратно.
        const loginUrl = new URL("/sign-in", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && accessToken) {
        // Если пользователь уже авторизован и пытается зайти на страницу входа или регистрации,
        // перенаправляем его на страницу профиля.
        return NextResponse.redirect(new URL("/profile", request.url));
    }

    // Во всех остальных случаях разрешаем переход
    return NextResponse.next();
}

// Конфигурация для middleware: указываем, на каких маршрутах он должен срабатывать
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
