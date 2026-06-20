"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css";
import { getNoteById } from "@/lib/api/clientApi";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function NotePreviewClient() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const close = () => router.back();

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery<Note, Error>({
    queryKey: ["note", params.id],
    queryFn: () => getNoteById(params.id),
    enabled: !!params.id,
  });

  return (
    <Modal onClose={close}>
      <button className={css.backBtn} onClick={close}>
        Close
      </button>

      {isLoading && <p>Loading...</p>}

      {isError && <p>Error: {error.message}</p>}

      {!isLoading && !isError && !note && <p>Note not found</p>}

      {note && (
        <div>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
          <small>{new Date(note.createdAt).toLocaleString()}</small>
        </div>
      )}
    </Modal>
  );
}