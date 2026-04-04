"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

type CurrentUser = {
  role: "admin" | "user";
  name: string;
} | null;

export default function Navbar() {
  const [user, setUser] = useState<CurrentUser>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data.user);
    };
    void fetchUser();
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const onLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const linkClass =
    "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors py-2 md:py-0";

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8 md:py-4 lg:px-12"
        aria-label="Main"
      >
        <Link href="/" className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex shrink-0 items-center gap-2 group md:text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-black text-white shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-110">
            B
          </div>
          BlogNest
        </Link>

        <div className="hidden items-center gap-5 text-sm font-medium md:flex lg:gap-6">
          <Link href="/blog" className={linkClass}>
            Explore Blogs
          </Link>
          <Link href="/#categories" className={linkClass}>
            Categories
          </Link>
          {user && (
            <Link href="/my-blogs" className={linkClass}>
              My Blogs
            </Link>
          )}
          {user && (
            <Link
              href="/blog/new"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/30 transition-all hover:bg-indigo-700 active:scale-95"
            >
              <span className="text-sm leading-none">+</span>
              <span>Create Blog</span>
            </Link>
          )}
          <ThemeToggle />
          <div className="mx-1 h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
          {!user ? (
            <>
              <Link href="/login" className={linkClass}>
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-95"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="hidden text-zinc-500 dark:text-zinc-400 lg:inline">
                Hi, <span className="font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</span>
              </span>
              {user.role === "admin" && (
                <Link href="/dashboard" className={linkClass}>
                  Dashboard
                </Link>
              )}
              <button
                type="button"
                onClick={onLogout}
                className="rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav-menu"
        className={`border-t border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950 md:hidden ${menuOpen ? "block" : "hidden"}`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1 text-sm font-medium lg:px-12">
          <Link href="/blog" className={linkClass}>
            Explore Blogs
          </Link>
          <Link href="/#categories" className={linkClass}>
            Categories
          </Link>
          {user && (
            <Link href="/my-blogs" className={linkClass}>
              My Blogs
            </Link>
          )}
          {user && (
            <Link
              href="/blog/new"
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/30"
            >
              <span>+</span>
              <span>Create Blog</span>
            </Link>
          )}
          <div className="my-3 h-px bg-zinc-200 dark:bg-zinc-800" />
          {!user ? (
            <div className="flex flex-col gap-2">
              <Link href="/login" className={`${linkClass} text-center`}>
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-indigo-600 px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="py-1 text-xs text-zinc-500 dark:text-zinc-400">
                Signed in as <span className="font-semibold text-zinc-800 dark:text-zinc-200">{user.name}</span>
              </p>
              {user.role === "admin" && (
                <Link href="/dashboard" className={linkClass}>
                  Dashboard
                </Link>
              )}
              <button
                type="button"
                onClick={onLogout}
                className="rounded-full border border-zinc-200 py-2.5 text-center text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
