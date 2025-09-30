import { cookies } from "next/headers";
import { api as serverApiClient } from "@/app/api/api";
import type { Note, FetchNotesResponse } from "@/types/note";
import { User } from "@/types/user";

// Тип для результату оновлення сесії
export type RefreshSessionResult = {
    newAccessToken: string | null;
    newRefreshToken: string | null;
};

// 2. Функція для перевірки/оновлення сесії
// Функція тепер повертає нові токени або null
export const checkSessionServer = async (): Promise<RefreshSessionResult> => {
    const cookieStore = await cookies();
    try {
        const response = await serverApiClient.get("auth/session", {
            headers: {
                Cookie: cookieStore.toString(),
            },
        });

        const setCookie = response.headers["set-cookie"];
        if (!setCookie) {
            return { newAccessToken: null, newRefreshToken: null };
        }

        let newAccessToken: string | null = null;
        let newRefreshToken: string | null = null;

        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        cookieArray.forEach((cookieStr) => {
            if (cookieStr.startsWith("accessToken=")) {
                newAccessToken = cookieStr;
            }
            if (cookieStr.startsWith("refreshToken=")) {
                newRefreshToken = cookieStr;
            }
        });

        return { newAccessToken, newRefreshToken };
    } catch (error) {
        // Якщо запит невдалий, повертаємо null
        return { newAccessToken: null, newRefreshToken: null };
    }
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

// Отримання списку нотаток на сервері
export const fetchNotesServer = async ({
    page = 1,
    query = "",
    tag = "",
}: {
    page?: number;
    query?: string;
    tag?: string;
}): Promise<FetchNotesResponse> => {
    const cookieStore = await cookies();
    const { data } = await serverApiClient.get<FetchNotesResponse>("/notes", {
        params: {
            page,
            perPage: 12,
            ...(query ? { search: query } : {}),
            ...(tag ? { tag } : {}),
        },
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
