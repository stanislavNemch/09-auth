import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSessionServer } from "./lib/api/serverApi";
import { cookies } from "next/headers";

const privateRoutes = ["/notes", "/profile"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

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
                const { newAccessToken, newRefreshToken } =
                    await checkSessionServer();
                if (newAccessToken) {
                    // Явно встановлюємо нові кукі у відповідь
                    const response = NextResponse.next();
                    if (newAccessToken)
                        response.headers.append("Set-Cookie", newAccessToken);
                    if (newRefreshToken)
                        response.headers.append("Set-Cookie", newRefreshToken);
                    return response;
                }
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
