"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchNoteById } from "@/lib/api/clientApi";
import css from "./NoteDetails.module.css";

const NoteDetailsClient = () => {
    const params = useParams();
    // Отримуємо id. Він може бути рядком або масивом рядків (у разі catch-all routes).
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const {
        data: note,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["note", id],
        // Додаємо перевірку всередині queryFn
        queryFn: () => {
            if (!id) {
                throw new Error("Note ID is not available");
            }
            return fetchNoteById(id);
        },
        // Це ключ запобігає виконанню запиту, якщо id відсутній.
        enabled: !!id,
        refetchOnMount: false,
    });

    if (isLoading) {
        return <p>Loading, please wait...</p>;
    }

    if (isError || !note) {
        return <p>Something went wrong.</p>;
    }

    return (
        <div className={css.container}>
            <div className={css.item}>
                <div className={css.header}>
                    <h2>{note.title}</h2>
                    <span className={css.tag}>{note.tag}</span>
                </div>
                <p className={css.content}>{note.content}</p>
                <p className={css.date}>
                    Created: {new Date(note.createdAt).toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default NoteDetailsClient;
