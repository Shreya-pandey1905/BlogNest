import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import { getCategoryMeta, POPULAR_CATEGORIES } from "@/utils/categories";

export default async function CategoriesPage() {
  await connectToDatabase();

  // Fetch all categories actually used in posts
  const usedCategories = await Post.distinct("category");

  // Combine popular categories with any used categories that aren't in the popular list
  const allCategoryNames = Array.from(new Set([
    ...POPULAR_CATEGORIES.map(c => c.name),
    ...usedCategories
  ]));

  const displayCategories = allCategoryNames.map(name => getCategoryMeta(name));

  return (
    <div className="max-w-6xl mx-auto py-16 px-4 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
          Explore by <span className="text-indigo-600 dark:text-indigo-400">Category</span>
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          Discover a wide range of topics and find stories that resonate with you.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayCategories.map((cat) => (
          <Link
            key={cat.name}
            href={`/blog?category=${encodeURIComponent(cat.name)}`}
            className="flex flex-col items-center justify-center p-12 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all hover:shadow-2xl hover:-translate-y-1 group active:scale-95"
          >
            <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
              {cat.emoji}
            </div>
            <span className={`text-xl font-black text-center ${cat.color}`}>{cat.name}</span>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2 text-center">
              Explore {cat.name.toLowerCase()} blogs
            </p>
          </Link>
        ))}
      </div>

      {displayCategories.length === 0 && (
        <div className="text-center py-20 text-zinc-500 italic">
          No categories found. Start creating posts to populate this list!
        </div>
      )}
    </div>
  );
}
