import apiClient from "./api";
import { User, UserCredentials, UserProfileUpdate } from "@/types/user";
import type { Note, NoteTag } from "@/types/note";

// Регистрация пользователя
export const signUp = async (credentials: UserCredentials): Promise<User> => {
    const { data } = await apiClient.post<User>("/auth/register", credentials);
    return data;
};

// Вход пользователя
export const signIn = async (credentials: UserCredentials): Promise<User> => {
    const { data } = await apiClient.post<User>("/auth/login", credentials);
    return data;
};

// Выход пользователя
export const signOut = async (): Promise<void> => {
    await apiClient.post("/auth/logout");
};

// Получение данных текущего пользователя
export const getCurrentUser = async (): Promise<User> => {
    const { data } = await apiClient.get<User>("/users/me");
    return data;
};

// Обновление профиля пользователя
export const updateUserProfile = async (
    profileData: UserProfileUpdate
): Promise<User> => {
    const { data } = await apiClient.patch<User>("/users/me", profileData);
    return data;
};

// Типи для роботи з нотатками
export interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

// Параметри для отримання нотаток
interface FetchNotesParams {
    page?: number;
    query?: string;
    tag?: string;
}

// Дані для створення нової нотатки
export interface NewNotePayload {
    title: string;
    content: string;
    tag: NoteTag;
}

// Отримання списку нотаток з підтримкою пагінації, пошуку та фільтрації за тегом
export const fetchNotes = async ({
    page = 1,
    query = "",
    tag = "",
}: FetchNotesParams): Promise<FetchNotesResponse> => {
    const response = await apiClient.get<FetchNotesResponse>("/notes", {
        params: {
            page,
            perPage: 12,
            ...(query ? { search: query } : {}),
            ...(tag ? { tag } : {}),
        },
    });
    return response.data;
};

// Створення нової нотатки
export const createNote = async (noteData: NewNotePayload): Promise<Note> => {
    const response = await apiClient.post<Note>("/notes", noteData);
    return response.data;
};

// Оновлення нотатки
export const deleteNote = async (noteId: string): Promise<Note> => {
    if (!noteId) {
        throw new Error("Note ID is required for deletion");
    }
    const response = await apiClient.delete<Note>(`/notes/${noteId}`);
    return response.data;
};

// Отримання нотатки за ID
export const fetchNoteById = async (noteId: string): Promise<Note> => {
    const { data } = await apiClient.get<Note>(`/notes/${noteId}`);
    return data;
};

// Перевірка активної сесії
export const checkSession = async (): Promise<{ success: boolean }> => {
    const { data } = await apiClient.get<{ success: boolean }>("/auth/session");
    return data;
};
