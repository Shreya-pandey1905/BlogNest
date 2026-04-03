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
    <div className="relative space-y-24 py-10 min-h-[100vh]">
      <div className="landing-gradient-bg" aria-hidden="true" />
      <div className="relative z-10">
        {/* 1. Hero Section */}
        <section className="text-center space-y-8 py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-300 landing-text-gradient-animate">
              Share your ideas <br />
              <span>with the world.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-zinc-600 dark:text-zinc-400 text-lg md:text-xl leading-relaxed">
              A community blogging platform where writers publish stories, tutorials, and knowledge.
              Join thousands of others in sharing what you know.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/blog" className="w-full sm:w-auto px-8 py-4 bg-zinc-900 dark:bg-indigo-600 text-white rounded-full font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-indigo-500/10 active:scale-95">
              Start Reading
            </Link>
            <Link href="/blog/new" className="w-full sm:w-auto px-8 py-4 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-full font-bold text-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all active:scale-95">
              Start Writing
            </Link>
          </div>
        </section>

        {/* 2. Featured Blogs */}
        <section className="space-y-8">
          <div className="flex items-end justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-300 landing-text-gradient-animate">
                Featured Blogs
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">Handpicked stories from our community</p>
            </div>
            <Link href="/blog" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              View all blogs →
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {safePosts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        </section>

        {/* 3. Categories Section */}
        <section id="categories" className="py-20 space-y-12 scroll-mt-24">
          <div className="text-center space-y-3">
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-300 landing-text-gradient-animate tracking-tight">
              Explore Categories
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl">Discover topics that matter to you</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {displayCategories.map((cat) => (
              <Link
                key={cat.name}
                href={`/blog?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center justify-center p-10 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/50 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all hover:shadow-2xl hover:-translate-y-2 group active:scale-95 text-center backdrop-blur-sm"
              >
                <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800/40 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {cat.emoji}
                </div>
                <span className={`text-xl font-black tracking-tight ${cat.color}`}>{cat.name}</span>
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
          <section className="relative overflow-hidden rounded-[3rem] bg-zinc-900 dark:bg-indigo-600 p-12 md:p-20 text-center space-y-8 shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 dark:bg-black/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-300 landing-text-gradient-animate tracking-tight">
                Start sharing your <br className="hidden md:block" /> knowledge today.
              </h2>
              <p className="text-indigo-100/70 dark:text-white/70 text-lg max-w-xl mx-auto">
                Create an account, set up your profile, and publish your first blog in minutes.
                Join our community of passionate writers.
              </p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-zinc-900 rounded-full font-bold text-lg hover:scale-105 transition-all active:scale-95">
                Create Account
              </Link>
              <Link href="/blog/new" className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all active:scale-95">
                Write Your First Blog
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
