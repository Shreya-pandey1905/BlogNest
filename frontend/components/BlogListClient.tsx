"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import type { CategoryMeta } from "@/utils/categories";

type PostPreview = {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  createdAt: string;
  author?: { name?: string };
  views?: number;
  likes?: number;
};

export default function BlogListClient() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [categories, setCategories] = useState<CategoryMeta[]>([]);

  useEffect(() => {
    let cancelled = false;

    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const q = new URLSearchParams();
        if (search) q.set("search", search);
        if (category) q.set("category", category);
        const qs = q.toString();
        const res = await fetch(`/api/posts${qs ? `?${qs}` : ""}`, { cache: "no-store" });
        const data = (await res.json()) as { posts?: PostPreview[]; categories?: CategoryMeta[]; error?: string };
        if (!cancelled && res.ok && data.posts) {
          setPosts(data.posts);
          setCategories(data.categories ?? []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchBlogs();
    return () => {
      cancelled = true;
    };
  }, [search, category]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-300 border-t-transparent dark:border-zinc-600 dark:border-t-transparent"
          role="status"
          aria-label="Loading posts"
        />
      </div>
    );
  }

  return (
    <section className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-3 border-b border-zinc-100 pb-6 dark:border-zinc-800 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl md:text-4xl">Discovery Hub</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:text-base">Explore articles across technology, design, and more.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-zinc-500 dark:text-zinc-400">Found {posts.length} posts</span>
        </div>
      </div>

      <form
        key={`${search}-${category}`}
        className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6 md:flex-row"
        action="/blog"
        method="get"
      >
        <div className="flex-1">
          <label className="mb-1.5 ml-1 block text-xs font-bold uppercase tracking-widest text-zinc-400">
            Search Keywords
          </label>
          <div className="relative">
            <input
              name="search"
              defaultValue={search}
              placeholder="Case studies, tutorials..."
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
        </div>

        <div className="md:w-64">
          <label className="mb-1.5 ml-1 block text-xs font-bold uppercase tracking-widest text-zinc-400">Category</label>
          <select
            name="category"
            defaultValue={category}
            className="w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-xl bg-zinc-900 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-zinc-800 active:scale-95 dark:bg-indigo-600 dark:hover:bg-indigo-700 md:w-auto"
          >
            Filter Results
          </button>
        </div>
      </form>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-4xl dark:bg-zinc-800">
            🔍
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">No matches found</h3>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">Try adjusting your search or category filters.</p>
          <Link href="/blog" className="mt-6 font-bold text-indigo-600 hover:underline dark:text-indigo-400">
            Clear all filters
          </Link>
        </div>
      )}
    </section>
  );
}
