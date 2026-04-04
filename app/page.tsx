import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import "@/models/User";
import BlogCard from "@/components/BlogCard";
import { getAuthUserFromCookies } from "@/lib/auth";
import { getCategoryMeta, POPULAR_CATEGORIES } from "@/utils/categories";

export const dynamic = "force-dynamic";

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

export default async function Home() {
  await connectToDatabase();

  // 1. Featured Blogs
  const posts = await Post.find({}).populate("author", "name").sort({ createdAt: -1 }).limit(6);
  const safePosts = JSON.parse(JSON.stringify(posts)) as PostPreview[];

  const user = await getAuthUserFromCookies();

  // 2. Categories
  const usedCategories = await Post.distinct("category");
  const allCategoryNames = Array.from(new Set([
    ...POPULAR_CATEGORIES.map(c => c.name),
    ...usedCategories
  ]));
  const displayCategories = allCategoryNames.map(name => getCategoryMeta(name)).slice(0, 8);

  // 3. (REMOVED: Trending Writers)

  return (
    <div className="relative min-h-[100vh] space-y-16 py-6 md:space-y-24 md:py-10">
      <div className="landing-gradient-bg" aria-hidden="true" />
      <div className="relative z-10">
        {/* 1. Hero Section */}
        <section className="space-y-6 py-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 md:space-y-8 md:py-12">
          <div className="space-y-3 md:space-y-4">
            <h1 className="text-3xl font-black leading-[1.15] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-300 landing-text-gradient-animate sm:text-4xl md:text-6xl lg:text-7xl">
              Share your ideas <br />
              <span>with the world.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base md:text-lg lg:text-xl">
              A community blogging platform where writers publish stories, tutorials, and knowledge.
              Join thousands of others in sharing what you know.
            </p>
          </div>
          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link href="/blog" className="w-full rounded-full bg-zinc-900 px-6 py-3 text-center text-base font-bold text-white shadow-xl shadow-indigo-500/10 transition-all hover:scale-105 active:scale-95 dark:bg-indigo-600 sm:w-auto sm:px-8 sm:py-4 sm:text-lg">
              Start Reading
            </Link>
            <Link href="/blog/new" className="w-full rounded-full border border-zinc-200 px-6 py-3 text-center text-base font-bold text-zinc-900 transition-all hover:bg-zinc-50 active:scale-95 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900 sm:w-auto sm:px-8 sm:py-4 sm:text-lg">
              Start Writing
            </Link>
          </div>
        </section>

        {/* 2. Featured Blogs */}
        <section className="space-y-6 md:space-y-8">
          <div className="flex flex-col gap-4 border-b border-zinc-100 pb-4 dark:border-zinc-800 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-300 landing-text-gradient-animate md:text-3xl">
                Featured Blogs
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 md:text-base">Handpicked stories from our community</p>
            </div>
            <Link href="/blog" className="shrink-0 text-sm font-bold text-indigo-600 hover:underline dark:text-indigo-400 sm:text-base">
              View all blogs →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {safePosts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        </section>

        {/* 3. Categories Section */}
        <section id="categories" className="scroll-mt-24 space-y-8 py-12 md:space-y-12 md:py-20">
          <div className="space-y-2 text-center md:space-y-3">
            <h2 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-300 landing-text-gradient-animate sm:text-3xl md:text-4xl lg:text-5xl">
              Explore Categories
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 sm:text-base md:text-lg lg:text-xl">Discover topics that matter to you</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
            {displayCategories.map((cat) => (
              <Link
                key={cat.name}
                href={`/blog?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center justify-center rounded-3xl border border-zinc-100 bg-white p-6 text-center backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-xl active:scale-95 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:hover:border-indigo-400/50 sm:rounded-[2rem] sm:p-8 md:rounded-[2.5rem] md:p-10 md:hover:-translate-y-2 md:hover:shadow-2xl"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-50 text-3xl shadow-inner transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 dark:bg-zinc-800/40 sm:mb-6 sm:h-20 sm:w-20 sm:rounded-3xl sm:text-4xl">
                  {cat.emoji}
                </div>
                <span className={`text-lg font-black tracking-tight sm:text-xl ${cat.color}`}>{cat.name}</span>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Browse {cat.name.toLowerCase()}
                </p>
              </Link>
            ))}
          </div>
          
          <div className="flex justify-center pt-8">
            <Link href="/categories" className="flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all font-bold text-sm group">
              View all categories
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </section>

        {/* 4. (REMOVED: Trending Writers) */}

        {/* 5. CTA Section */}
        {!user && (
          <section className="relative space-y-6 overflow-hidden rounded-3xl bg-zinc-900 p-8 text-center shadow-2xl dark:bg-indigo-600 sm:rounded-[2.5rem] sm:p-10 md:space-y-8 md:p-12 lg:rounded-[3rem] lg:p-20">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 dark:bg-black/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3 md:space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-300 landing-text-gradient-animate sm:text-3xl md:text-4xl lg:text-5xl">
                Start sharing your <br className="hidden sm:block" /> knowledge today.
              </h2>
              <p className="mx-auto max-w-xl text-sm text-indigo-100/70 dark:text-white/70 sm:text-base md:text-lg">
                Create an account, set up your profile, and publish your first blog in minutes.
                Join our community of passionate writers.
              </p>
            </div>
            <div className="relative z-10 flex flex-col items-stretch justify-center gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4 sm:pt-4">
              <Link href="/register" className="w-full rounded-full bg-white px-6 py-3 text-center text-base font-bold text-zinc-900 transition-all hover:scale-105 active:scale-95 sm:w-auto sm:px-8 sm:py-4 sm:text-lg">
                Create Account
              </Link>
              <Link href="/blog/new" className="w-full rounded-full border-2 border-white/20 bg-transparent px-6 py-3 text-center text-base font-bold text-white transition-all hover:bg-white/10 active:scale-95 sm:w-auto sm:px-8 sm:py-4 sm:text-lg">
                Write Your First Blog
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
