"use client";

import { useEffect, useState } from "react";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

type LikeButtonProps = {
  postId: string;
  initialLikes?: number;
  variant?: "default" | "compact";
};

export default function LikeButton({ postId, initialLikes = 0, variant = "default" }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(`/api/posts/${postId}/like`, { method: "GET", credentials: "include" });
        if (!res.ok) return;
        const data = (await res.json()) as { likes?: number; liked?: boolean };
        if (cancelled) return;
        setLiked(Boolean(data.liked));
        setLikes(typeof data.likes === "number" ? data.likes : initialLikes);
      } catch {
        // Ignore network errors.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [postId, initialLikes]);

  const onToggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: "POST", credentials: "include" });
      if (!res.ok) return;
      const data = (await res.json()) as { liked?: boolean; likes?: number };
      setLiked(Boolean(data.liked));
      setLikes(typeof data.likes === "number" ? data.likes : likes);
    } catch {
      // Ignore.
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={liked}
      aria-label={liked ? "Unlike post" : "Like post"}
      disabled={loading}
      className={[
        "inline-flex items-center gap-2 rounded-lg border text-xs font-semibold transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed",
        variant === "compact" ? "px-2 py-1" : "px-3 py-1.5",
        liked
          ? "border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/15"
          : "border-zinc-200 dark:border-zinc-700 bg-white/60 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-900",
      ].join(" ")}
    >
      <HeartIcon filled={liked} />
      <span>{likes}</span>
    </button>
  );
}

