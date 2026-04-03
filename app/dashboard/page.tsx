import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import "@/models/User";
import DeletePostButton from "@/components/DeletePostButton";
import DeleteCommentButton from "@/components/DeleteCommentButton";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type DashboardPost = {
  _id: string;
  title: string;
  category: string;
  createdAt: string;
  author?: { name?: string };
};

type DashboardComment = {
  _id: string;
  text: string;
  createdAt: string;
  userId?: { name?: string };
  postId?: { title?: string };
};

export default async function DashboardPage() {
  await connectToDatabase();

  const [posts, comments] = await Promise.all([
    Post.find({}).sort({ createdAt: -1 }).populate("author", "name"),
    Comment.find({}).sort({ createdAt: -1 }).populate("userId", "name").populate("postId", "title"),
  ]);
  const safePosts = JSON.parse(JSON.stringify(posts)) as DashboardPost[];
  const safeComments = JSON.parse(JSON.stringify(comments)) as DashboardComment[];

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Admin Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your platform content and community activity.</p>
        </div>
        <Link 
          href="/dashboard/posts/new" 
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <span className="text-lg leading-none">+</span>
          Create New Post
        </Link>
      </header>

      {/* 2. Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Posts</p>
              <p className="text-3xl font-black text-zinc-900 dark:text-zinc-50">{safePosts.length}</p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v14l-4-4H9z"/></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Community Interaction</p>
              <p className="text-3xl font-black text-zinc-900 dark:text-zinc-50">{safeComments.length}</p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-md transition-all sm:col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Last Activity</p>
              <p className="text-sm font-black text-zinc-900 dark:text-zinc-50 mt-1 uppercase tracking-wider">
                {safePosts[0]?.createdAt ? formatDate(safePosts[0].createdAt) : "No activity"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* 3. Manage Posts */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Recent Posts</h2>
            <Link href="/blog" className="text-xs font-bold text-indigo-600 hover:underline">View Public Site →</Link>
          </div>
          <div className="space-y-4">
            {safePosts.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-500">No posts found.</div>
            ) : (
              safePosts.map((post) => (
                <div
                  key={post._id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 p-5 hover:border-indigo-500/30 transition-all hover:shadow-sm"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{post.title}</p>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">{post.category}</span>
                      <span>By {post.author?.name || "Unknown"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/posts/${post._id}/edit`}
                      className="inline-flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all active:scale-95"
                    >
                      Edit
                    </Link>
                    <DeletePostButton postId={post._id} />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 4. Manage Comments */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Community Feedback</h2>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800/40">Live Feed</span>
          </div>
          <div className="space-y-4">
            {safeComments.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-500">No comments yet.</div>
            ) : (
              safeComments.map((comment) => (
                <div key={comment._id} className="relative group rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 p-5 hover:border-indigo-500/30 transition-all hover:shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-black text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/40">
                        {comment.userId?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-black text-zinc-900 dark:text-zinc-50">{comment.userId?.name || "Guest"}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">&ldquo;{comment.text}&rdquo;</p>
                      </div>
                    </div>
                    <DeleteCommentButton commentId={comment._id} />
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-50 dark:border-zinc-800/50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <span className="truncate max-w-[150px]">Post: {comment.postId?.title || "Deleted"}</span>
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
