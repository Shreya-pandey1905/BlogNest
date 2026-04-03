"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CkEditorField from "@/components/CkEditorField";
import { POPULAR_CATEGORIES } from "@/utils/categories";

type PostPayload = {
  title: string;
  content: string;
  category: string;
  tags: string;
  coverImage: string;
};

type PostFormProps = {
  mode: "create" | "edit";
  postId?: string;
  initialData?: PostPayload;
};

const emptyPost: PostPayload = {
  title: "",
  content: "",
  category: "",
  tags: "",
  coverImage: "",
};

export default function PostForm({ mode, postId, initialData }: PostFormProps) {
  const [form, setForm] = useState<PostPayload>(initialData ?? emptyPost);
  const [showCustomCategory, setShowCustomCategory] = useState(
    !!initialData && !POPULAR_CATEGORIES.some((c) => c.name === initialData.category)
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!coverFile) {
      setCoverPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(coverFile);
    setCoverPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const uploadCover = async () => {
    if (!coverFile) return form.coverImage;
    const data = new FormData();
    data.append("file", coverFile);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to upload image");
    }
    const result = await res.json();
    return result.url as string;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const coverImage = await uploadCover();
      const payload = {
        ...form,
        coverImage,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      const endpoint = mode === "create" ? "/api/posts" : `/api/posts/${postId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save post");
      }

      // Send users back to the most relevant page after saving.
      // Admins -> dashboard, regular users -> my-blogs.
      let destination = "/dashboard";
      try {
        const meRes = await fetch("/api/auth/me", { cache: "no-store" });
        if (meRes.ok) {
          const meData = await meRes.json();
          destination = meData.user?.role === "admin" ? "/dashboard" : "/my-blogs";
        } else {
          destination = "/my-blogs";
        }
      } catch {
        destination = "/my-blogs";
      }

      router.push(destination);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-5xl space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">
            {mode === "create" ? "Create Blog Post" : "Edit Blog Post"}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">Write styled content with CKEditor.</p>
        </div>
        {error ? <p className="text-sm font-semibold text-red-600 sm:mt-1">{error}</p> : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-900">Title</label>
            <input
              required
              placeholder="e.g. How I built my first blog"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-900">Category</label>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="flex flex-wrap gap-2.5">
                {POPULAR_CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, category: cat.name }));
                      setShowCustomCategory(false);
                    }}
                    className={`rounded-full border px-4 py-2 text-sm font-bold transition-all active:scale-95 ${
                      form.category === cat.name && !showCustomCategory
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-indigo-400/70 hover:bg-indigo-50/30"
                    }`}
                  >
                    <span className="mr-2 inline-block opacity-90">{cat.emoji}</span>
                    {cat.name}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setShowCustomCategory(true);
                    setForm((prev) => ({ ...prev, category: "" }));
                  }}
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition-all active:scale-95 ${
                    showCustomCategory ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                  }`}
                >
                  ➕ Custom Category
                </button>
              </div>

              {showCustomCategory ? (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <input
                    required
                    placeholder="Enter custom category name (e.g. AI, Cooking, News)"
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15"
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-900">Tags</label>
              <input
                placeholder="Comma separated (e.g. react,nextjs,css)"
                value={form.tags}
                onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-900">Cover Image URL</label>
              <input
                type="url"
                placeholder="https://example.com/cover.jpg"
                value={form.coverImage}
                onChange={(e) => setForm((prev) => ({ ...prev, coverImage: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-900">Post Content</label>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
              <CkEditorField
                value={form.content}
                onChange={(value) => {
                  setForm((prev) => ({ ...prev, content: value }));
                }}
              />
            </div>
            <p className="text-xs text-zinc-500">Tip: headings, lists, links, and code blocks are supported.</p>
          </div>
        </div>

        <aside className="space-y-5 lg:col-span-1">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900">Cover</h3>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">Optional</span>
            </div>

            <div className="mt-3">
              {coverPreviewUrl || form.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverPreviewUrl ?? form.coverImage}
                  alt="Cover preview"
                  className="h-40 w-full rounded-xl border border-zinc-200 object-cover"
                />
              ) : (
                <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500">
                  No image selected
                </div>
              )}
            </div>

            <div className="mt-4 space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-zinc-800"
              />
              <p className="text-xs text-zinc-500">If you upload a file, it will be used as the cover image.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:opacity-60"
          >
            {loading ? "Saving..." : mode === "create" ? "Create Post" : "Update Post"}
          </button>
        </aside>
      </div>
    </form>
  );
}
