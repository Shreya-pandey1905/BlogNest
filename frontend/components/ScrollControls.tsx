"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ScrollControls() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  useEffect(() => {
    const update = () => {
      setScrollY(window.scrollY);
      setMaxScroll(
        document.documentElement.scrollHeight - window.innerHeight
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollDown = () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });

  const canScrollUp = scrollY > 50;
  const canScrollDown = maxScroll > 50 && scrollY < maxScroll - 50;

  const btnBase =
    "flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-90 select-none backdrop-blur-md";
  const activeBtn =
    `${btnBase} bg-white/80 dark:bg-zinc-900/80 border-zinc-200/50 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 cursor-pointer`;
  const disabledBtn =
    `${btnBase} bg-white/40 dark:bg-zinc-900/40 border-zinc-100/30 dark:border-zinc-800/30 text-zinc-300 dark:text-zinc-700 cursor-not-allowed opacity-40 shadow-none pointer-events-none`;

  return (
    <>
      {/* ← Back button — top-left corner */}
      <button
        type="button"
        id="nav-back-btn"
        onClick={() => router.back()}
        title="Go back"
        aria-label="Go back"
        className={`fixed top-20 left-5 z-50 ${activeBtn} group`}
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.10)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
        >
          <path
            fillRule="evenodd"
            d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* ↑ ↓ Scroll buttons — bottom-right corner */}
      <div
        className="fixed bottom-6 right-5 z-50 flex flex-col items-center gap-2"
        aria-label="Scroll navigation"
      >
        {/* ↑ Scroll up */}
        <button
          type="button"
          id="nav-scroll-up-btn"
          onClick={scrollUp}
          disabled={!canScrollUp}
          title="Scroll to top"
          aria-label="Scroll to top"
          className={`group ${canScrollUp ? activeBtn : disabledBtn}`}
          style={canScrollUp ? { boxShadow: "0 2px 12px rgba(0,0,0,0.10)" } : {}}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 transition-transform group-hover:-translate-y-0.5"
          >
            <path
              fillRule="evenodd"
              d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04L10.75 5.612V16.25A.75.75 0 0 1 10 17Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* ↓ Scroll down */}
        <button
          type="button"
          id="nav-scroll-down-btn"
          onClick={scrollDown}
          disabled={!canScrollDown}
          title="Scroll to bottom"
          aria-label="Scroll to bottom"
          className={`group ${canScrollDown ? activeBtn : disabledBtn}`}
          style={canScrollDown ? { boxShadow: "0 2px 12px rgba(0,0,0,0.10)" } : {}}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 transition-transform group-hover:translate-y-0.5"
          >
            <path
              fillRule="evenodd"
              d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
