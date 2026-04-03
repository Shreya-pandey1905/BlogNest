"use client";

import { useEffect, useState } from "react";

export default function ViewCounter({
  postId,
  initialViews,
  viewerId,
}: {
  postId: string;
  initialViews: number;
  viewerId?: string | null;
}) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    const key = `viewed-${postId}-${viewerId ?? "anon"}`;
    try {
      if (typeof window === "undefined") return;
      const alreadyViewed = sessionStorage.getItem(key);
      if (alreadyViewed) return;
      // Mark immediately to avoid double-increment if the user refreshes quickly.
      sessionStorage.setItem(key, "1");

      void (async () => {
        try {
          const res = await fetch(`/api/posts/${postId}/views`, { method: "POST", credentials: "include" });
          if (!res.ok) {
            sessionStorage.removeItem(key);
            return;
          }
          const data = (await res.json()) as { views?: number };
          setViews(typeof data.views === "number" ? data.views : initialViews);
        } catch {
          sessionStorage.removeItem(key);
        }
      })();
    } catch {
      // If storage is blocked, just skip view counting.
    }
  }, [postId, initialViews, viewerId]);

  return (
    <span className="font-medium text-zinc-700 dark:text-zinc-200">
      {views} views
    </span>
  );
}

