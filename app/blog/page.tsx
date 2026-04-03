import BlogCard from "@/components/BlogCard";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import "@/models/User";
import Link from "next/link";
import { getCategoryMeta } from "@/utils/categories";

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

type BlogListProps = {
  searchParams: Promise<{ search?: string; category?: string }>;
};

export default async function BlogListPage({ searchParams }: BlogListProps) {
  const params = await searchParams;
  await connectToDatabase();

  const query: Record<string, unknown> = {};
  if (params.category) {
    query.category = params.category;
  }
  if (params.search) {
    query.$or = [
      { title: { $regex: params.search, $options: "i" } },
      { content: { $regex: params.search, $options: "i" } },
      { tags: { $regex: params.search, $options: "i" } },
    ];
  }

  const posts = await Post.find(query).populate("author", "name").sort({ createdAt: -1 });
  const categoryNames = await Post.distinct("category");
  const categories = categoryNames.map(name => getCategoryMeta(name));
  const safePosts = JSON.parse(JSON.stringify(posts)) as PostPreview[];

  return (
    <section className="space-y-8 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Discovery Hub</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Explore articles across technology, design, and more.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-zinc-500">Found {safePosts.length} posts</span>
        </div>
      </div>

      <form className="flex flex-col md:flex-row gap-4 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm backdrop-blur-sm">
        <div className="flex-1">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Search Keywords</label>
          <div className="relative">
            <input
              name="search"
              defaultValue={params.search ?? ""}
              placeholder="Case studies, tutorials..."
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>
        
        <div className="md:w-64">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Category</label>
          <select
            name="category"
            defaultValue={params.category ?? ""}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
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
          <button type="submit" className="w-full md:w-auto rounded-xl bg-zinc-900 dark:bg-indigo-600 px-8 py-3 text-sm font-bold text-white hover:bg-zinc-800 dark:hover:bg-indigo-700 transition-all shadow-lg active:scale-95">
            Filter Results
          </button>
        </div>
      </form>

      {safePosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {safePosts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">No matches found</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Try adjusting your search or category filters.</p>
          <Link href="/blog" className="mt-6 text-indigo-600 font-bold hover:underline">Clear all filters</Link>
        </div>
      )}
    </section>
  );
}
