import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSessionServer } from "./lib/api/serverApi";
import { cookies } from "next/headers";
import { parse } from "cookie";

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
            const data = await checkSessionServer();
            const setCookie = data.headers["set-cookie"];
            if (setCookie) {
                const lines = Array.isArray(setCookie)
                    ? setCookie
                    : [setCookie]; // Масив рядків Set-Cookie
                // Розбираємо кожен рядок і оновлюємо куки
                const tokenNames = ["accessToken", "refreshToken"] as const;
                // Проходимо по кожному рядку Set-Cookie
                for (const line of lines) {
                    const parsed = parse(line);
                    const options = {
                        expires: parsed.Expires
                            ? new Date(parsed.Expires)
                            : undefined,
                        path: parsed.Path,
                        maxAge: parsed["Max-Age"]
                            ? Number(parsed["Max-Age"])
                            : undefined,
                    };
                    for (const name of tokenNames) {
                        const val = parsed[name];
                        if (val) cookieStore.set(name, val, options);
                    }
                }
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
