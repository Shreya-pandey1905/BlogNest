"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function DeleteCommentButton({ commentId }: { commentId: string }) {
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isErrorOpen, setErrorOpen] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
    if (!res.ok) {
      setErrorOpen(true);
      return;
    }
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-colors"
      >
        Delete
      </button>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onConfirm={onDelete}
        onClose={() => setConfirmOpen(false)}
        title="Delete Comment?"
        message="This will permanently remove this comment. Are you sure?"
        confirmLabel="Yes, Delete it"
      />

      <ConfirmationModal
        isOpen={isErrorOpen}
        onConfirm={() => setErrorOpen(false)}
        onClose={() => setErrorOpen(false)}
        title="Action Failed"
        message="Failed to delete comment. Please try again."
        confirmLabel="I understand"
        type="info"
        cancelLabel="Discard"
      />
    </>
  );
}
