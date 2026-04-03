import { notFound } from "next/navigation";
import Image from "next/image";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import "@/models/User";
import { formatDate } from "@/lib/format";
import CommentForm from "@/components/CommentForm";
import { getAuthUserFromCookies } from "@/lib/auth";
import DeleteCommentButton from "@/components/DeleteCommentButton";
import { sanitizePostContentForRender } from "@/lib/sanitize";
import LikeButton from "@/components/LikeButton";
import ViewCounter from "@/components/ViewCounter";

export const dynamic = "force-dynamic";

type BlogPost = {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  coverImage?: string;
  createdAt: string;
  author?: { name?: string };
  views?: number;
  likes?: number;
};

type PostComment = {
  _id: string;
  text: string;
  createdAt: string;
  userId?: { _id?: string; name?: string };
};

type BlogPostProps = {
  params: Promise<{ id: string }>;
};

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { id } = await params;
  await connectToDatabase();

  const post = await Post.findById(id)
    .select("title content category tags coverImage createdAt author views likes")
    .populate("author", "name");
  if (!post) {
    notFound();
  }

  const comments = await Comment.find({ postId: id }).populate("userId", "name").sort({ createdAt: -1 });
  const user = await getAuthUserFromCookies();
  const safePost = JSON.parse(JSON.stringify(post)) as BlogPost;
  const safeComments = JSON.parse(JSON.stringify(comments)) as PostComment[];
  const safePostContent = sanitizePostContentForRender(safePost.content);

  return (
    <article className="mx-auto w-full max-w-5xl space-y-8 px-4 sm:px-0">
      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white/90 shadow-sm backdrop-blur dark:bg-zinc-950/40">
        {safePost.coverImage ? (
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-zinc-50">
            <Image
              src={safePost.coverImage}
              alt={safePost.title}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="p-6 md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                {safePost.category}
              </span>
              <span>{formatDate(safePost.createdAt)}</span>
              <ViewCounter postId={safePost._id} initialViews={safePost.views ?? 0} viewerId={user?.userId ?? null} />
              <span>by {safePost.author?.name ?? "Unknown"}</span>
            </div>
            <div className="flex items-center">
              <LikeButton postId={safePost._id} initialLikes={safePost.likes ?? 0} />
            </div>
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-zinc-900 md:text-4xl dark:text-zinc-50">
            {safePost.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-2">
            {safePost.tags?.map((tag) => (
              <span key={tag} className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700">
                #{tag}
              </span>
            ))}
          </div>
          <div className="mt-8 rich-content text-zinc-800 dark:text-zinc-200" dangerouslySetInnerHTML={{ __html: safePostContent }} />
        </div>
      </div>

      <section className="space-y-4 rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:bg-zinc-950/40">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Comments ({safeComments.length})
        </h2>
        {user ? (
          <CommentForm postId={safePost._id} />
        ) : (
          <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
            Login to join the discussion.
          </p>
        )}
        <div className="space-y-3 pt-1">
          {safeComments.map((comment) => (
            <div key={comment._id} className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4">
              <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
                <span className="font-semibold text-zinc-700">{comment.userId?.name ?? "User"}</span>
                <div className="flex items-center gap-2">
                  <span>{formatDate(comment.createdAt)}</span>
                  {user && (user.role === "admin" || user.userId === comment.userId?._id) ? (
                    <DeleteCommentButton commentId={comment._id} />
                  ) : null}
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-800">{comment.text}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
