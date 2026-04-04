import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/format";
import { htmlToPlainText } from "@/lib/sanitize";

type BlogCardProps = {
  post: {
    _id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    coverImage?: string;
    createdAt: string;
    views?: number;
    likes?: number;
    author?: { name?: string };
  };
};

export default function BlogCard({ post }: BlogCardProps) {
  const excerpt = htmlToPlainText(post.content);
  const shortExcerpt = excerpt.length > 180 ? `${excerpt.slice(0, 177)}...` : excerpt;

  return (
    <article className="group overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow">
      {post.coverImage ? (
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : null}
        <div className="space-y-3 p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <span className="rounded bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 text-indigo-600 dark:text-indigo-400 transition-colors font-semibold tracking-wide text-[10px] uppercase border border-indigo-100 dark:border-indigo-800">{post.category}</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
        <h3 className="text-lg font-bold text-zinc-900 transition-colors group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-indigo-400 sm:text-xl">{post.title}</h3>
        <p className="line-clamp-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-sm">{shortExcerpt}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag: string) => (
            <span key={tag} className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2 sm:pt-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-500">By {post.author?.name ?? "Unknown"}</span>
          <div className="flex flex-1 flex-wrap items-center gap-3 sm:justify-center">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {post.views ?? 0} views
            </span>
            <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{post.likes ?? 0}</span>
            </div>
          </div>
          <Link href={`/blog/${post._id}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 sm:shrink-0">
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
}
