"use client";

import Modal from "@/components/Modal/Modal";
import { useRouter } from "next/navigation";
import css from "./NotePreview.module.css";
import NoteDetails from "@/app/(private routes)/notes/[id]/NoteDetails.client";

export default function NotePreviewClient() {
  const router = useRouter();
  const close = () => router.back();

  return (
    <>
      <Modal onClose={close}>
        <button className={css.backBtn} onClick={close}>
          Close
        </button>
        <NoteDetails />
      </Modal>
    </>
  );
}