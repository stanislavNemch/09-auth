import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSessionServer } from "./lib/api/serverApi";

const privateRoutes = ["/notes", "/profile"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    const isPrivateRoute = privateRoutes.some((route) =>
        pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // Виправляємо перенаправлення на головну сторінку
    if (isAuthRoute && accessToken) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (isPrivateRoute) {
        if (accessToken) {
            // Токен є, пропускаємо
            return NextResponse.next();
        }

        if (refreshToken) {
            try {
                // Викликаємо серверну функцію для оновлення сесії
                await checkSessionServer();
                // Якщо функція виконалася успішно, значить кукі оновилися.
                // Ми можемо пропустити запит далі.
                return NextResponse.next();
            } catch (error) {
                // Якщо оновлення не вдалося, поводимося так, ніби токена немає
                console.error("Session refresh failed in middleware:", error);
            }
        }

        // Якщо жоден токен не спрацював, перенаправляємо на логін
        const loginUrl = new URL("/sign-in", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// Налаштування маршрутів
export const config = {
    matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
