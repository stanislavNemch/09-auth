import { cookies } from "next/headers";
import axios from "axios";
import type { Note } from "@/types/note";

// Создаем отдельный экземпляр axios для серверных компонентов,
// так как baseURL будет указывать напрямую на внешний API.
const serverApiClient = axios.create({
    baseURL: "https://notehub-api.goit.study",
});

// Получение заметки по ID (для generateMetadata)
export const fetchNoteByIdServer = async (noteId: string): Promise<Note> => {
    const cookieStore = cookies();
    const { data } = await serverApiClient.get<Note>(`/notes/${noteId}`, {
        headers: {
            Cookie: cookieStore.toString(), // Передаем cookie вручную
        },
    });
    return data;
};
