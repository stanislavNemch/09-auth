import { NextResponse, type NextRequest } from "next/server";
import { parse } from "cookie";

// Маршрути, які потребують автентифікації
const privateRoutes = ["/notes", "/profile"];
const authRoutes = ["/sign-in", "/sign-up"];

// Оновлення токенів
async function refreshTokens(
    request: NextRequest
): Promise<NextResponse | null> {
    try {
        // Виконуємо запит на оновлення сесії
        const response = await fetch(
            new URL("/api/auth/session", request.url),
            {
                method: "GET",
                headers: {
                    cookie: request.headers.get("cookie") || "",
                },
            }
        );

        if (!response.ok) {
            return null;
        }

        const newHeaders = new Headers(response.headers);
        const nextResponse = NextResponse.next({
            request: {
                headers: newHeaders,
            },
        });

        // Оновлюємо куки
        const setCookie = response.headers.get("set-cookie");
        if (setCookie) {
            const cookieArray = Array.isArray(setCookie)
                ? setCookie
                : [setCookie];
            cookieArray.forEach((cookieStr) => {
                const parsed = parse(cookieStr);
                const [name, value] = Object.entries(parsed)[0];

                if (name && value) {
                    nextResponse.cookies.set(name, value, {
                        expires: parsed.Expires
                            ? new Date(parsed.Expires)
                            : undefined,
                        path: parsed.Path,
                        maxAge: Number(parsed["Max-Age"]),
                        httpOnly: true,
                    });
                }
            });
        }

        return nextResponse;
    } catch (error) {
        console.error("Refresh token error:", error);
        return null;
    }
}

// Обробка запитів
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    const isPrivateRoute = privateRoutes.some((route) =>
        pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    if (isAuthRoute && accessToken) {
        return NextResponse.redirect(new URL("/profile", request.url));
    }

    if (isPrivateRoute) {
        if (accessToken) {
            return NextResponse.next();
        }

        if (refreshToken) {
            const refreshResponse = await refreshTokens(request);
            if (refreshResponse && refreshResponse.cookies.has("accessToken")) {
                return refreshResponse;
            }
        }

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
