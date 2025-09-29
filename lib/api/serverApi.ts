import { cookies } from "next/headers";
import { parse } from "cookie";
import { api as serverApiClient } from "@/app/api/api";
import type { Note } from "@/types/note";
import { User } from "@/types/user";

// 2. Функція для перевірки/оновлення сесії
export const checkSessionServer = async () => {
    const cookieStore = await cookies();
    const response = await serverApiClient.get("auth/session", {
        headers: {
            Cookie: cookieStore.toString(),
        },
    });

    const setCookie = response.headers["set-cookie"];
    if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookieArray) {
            const parsed = parse(cookieStr);
            const [name, value] = Object.entries(parsed)[0];
            if (name && value) {
                cookieStore.set(name, value, {
                    expires: parsed.Expires
                        ? new Date(parsed.Expires)
                        : undefined,
                    path: parsed.Path,
                    maxAge: Number(parsed["Max-Age"]),
                    httpOnly: true,
                });
            }
        }
    }

    return response.data;
};

// 3. Функція для отримання поточного користувача на сервері
export const getCurrentUserServer = async (): Promise<User> => {
    const cookieStore = await cookies();
    const { data } = await serverApiClient.get<User>("/users/me", {
        headers: {
            Cookie: cookieStore.toString(),
        },
    });
    return data;
};

// Функція для отримання нотатки за її ID на сервері
export const fetchNoteByIdServer = async (noteId: string): Promise<Note> => {
    const cookieStore = await cookies();
    const { data } = await serverApiClient.get<Note>(`/notes/${noteId}`, {
        headers: {
            Cookie: cookieStore.toString(),
        },
    });
    return data;
};
