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

  const onLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/20">B</div>
          BlogNest
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/blog" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
            Explore Blogs
          </Link>
          <Link href="/#categories" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
            Categories
          </Link>

          {user && (
            <Link href="/my-blogs" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
              My Blogs
            </Link>
          )}

          {user && (
            <Link
              href="/blog/new"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/30 hover:bg-indigo-700 active:scale-95 transition-all"
            >
              <span className="text-sm leading-none">+</span>
              <span>Create Blog</span>
            </Link>
          )}

          <ThemeToggle />

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

          {!user ? (
            <>
              <Link href="/login" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700 transition-all font-semibold shadow-lg shadow-indigo-500/20 active:scale-95 text-xs sm:text-sm"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-zinc-500 dark:text-zinc-400 hidden sm:inline">Hi, <span className="font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</span></span>
              {user.role === "admin" && (
                <Link href="/dashboard" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                  Dashboard
                </Link>
              )}
              <button
                type="button"
                onClick={onLogout}
                className="rounded-full border border-zinc-200 dark:border-zinc-800 px-4 py-1.5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors bg-white dark:bg-zinc-900 shadow-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
