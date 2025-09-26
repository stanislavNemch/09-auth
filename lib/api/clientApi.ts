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

export interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

interface FetchNotesParams {
    page?: number;
    query?: string;
    tag?: string;
}

export interface NewNotePayload {
    title: string;
    content: string;
    tag: NoteTag;
}

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

export const createNote = async (noteData: NewNotePayload): Promise<Note> => {
    const response = await apiClient.post<Note>("/notes", noteData);
    return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
    if (!noteId) {
        throw new Error("Note ID is required for deletion");
    }
    const response = await apiClient.delete<Note>(`/notes/${noteId}`);
    return response.data;
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
    const { data } = await apiClient.get<Note>(`/notes/${noteId}`);
    return data;
};
