import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import "@/models/User";
import { getAuthUserFromCookies } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import DeletePostButton from "@/components/DeletePostButton";

export const dynamic = "force-dynamic";

type MyPost = {
  _id: string;
  title: string;
  createdAt: string;
  views?: number;
  likes?: number;
};

export default async function MyBlogsPage() {
  const user = await getAuthUserFromCookies();

  if (!user) {
    return (
      <section className="mx-auto max-w-5xl space-y-6 py-10 text-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">My Blogs</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Please{" "}
          <Link href="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            log in
          </Link>{" "}
          to view and manage your blogs.
        </p>
      </section>
    );
  }

  await connectToDatabase();
  const posts = await Post.find({ author: user.userId }).sort({ createdAt: -1 });
  const safePosts = JSON.parse(JSON.stringify(posts)) as MyPost[];

  return (
    <section className="mx-auto max-w-5xl space-y-6 py-10">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">My Blogs</h1>
      </div>

      {safePosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-900/60 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-400">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100">You haven&apos;t written any blogs yet.</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Your stories will appear here once you publish them.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {safePosts.map((post) => (
            <div
              key={post._id}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/80 p-4 sm:p-5 shadow-sm flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {post.title}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium text-zinc-700 dark:text-zinc-200">{post.views ?? 0}</span> views ·{" "}
                  <span className="font-medium text-zinc-700 dark:text-zinc-200">{post.likes ?? 0}</span> likes ·{" "}
                  {formatDate(post.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Link
                  href={`/my-blogs/${post._id}/edit`}
                  className="inline-flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white/90 dark:bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  Edit
                </Link>
                <DeletePostButton postId={post._id} />
                <Link
                  href={`/blog/${post._id}`}
                  className="inline-flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/90 dark:bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

