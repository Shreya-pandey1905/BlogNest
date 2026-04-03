"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function DeletePostButton({ postId }: { postId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    if (!res.ok) {
        // We could also use an "alert" type modal here for errors, but standard alert is fine for now
        // or we can handle it with the modal just as well.
      return;
    }
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center justify-center rounded-lg border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/20 px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-100/80 dark:hover:bg-red-900/40 transition-all active:scale-95 transition-all"
      >
        Delete
      </button>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={onDelete}
        title="Delete Post?"
        message="This will permanently remove this post and all its comments. This action cannot be undone."
        confirmLabel="Yes, Delete it"
      />
    </>
  );
}
