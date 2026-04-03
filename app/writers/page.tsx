import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";

export default async function WritersPage() {
  await connectToDatabase();

  // Aggregate writers by post count
  const writersData = await Post.aggregate([
    { $group: { _id: "$author", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "authorInfo" } },
    { $unwind: "$authorInfo" },
    { $project: { name: "$authorInfo.name", count: 1, role: "$authorInfo.role" } }
  ]);

  interface WriterStat {
    _id: string;
    name: string;
    count: number;
    role: string;
  }

  const writers = JSON.parse(JSON.stringify(writersData)) as WriterStat[];

  return (
    <div className="max-w-6xl mx-auto py-16 px-4 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
          Meet our <span className="text-indigo-600 dark:text-indigo-400">Writers</span>
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          Passionate creators, experts, and storytellers who share their
          knowledge and insights with our community.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {writers.map((writer) => (
          <div
            key={writer._id}
            className="group flex items-center gap-6 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95 shadow-sm"
          >
            <div className="flex-shrink-0 w-24 h-24 rounded-full bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center text-3xl font-black text-zinc-400 border border-zinc-200 dark:border-zinc-700 shadow-inner group-hover:scale-110 group-hover:text-indigo-600 transition-all duration-300 overflow-hidden">
              {writer.name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 truncate group-hover:text-indigo-600 transition-colors">
                  {writer.name}
                </h3>
                {writer.role === "admin" && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {writer.count} {writer.count === 1 ? 'blog' : 'blogs'} published
              </p>
              <div className="pt-2">
                <Link href={`/blog?author=${writer._id}`} className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline uppercase tracking-wide">
                  View profile &rarr;
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {writers.length === 0 && (
        <div className="text-center py-20 text-zinc-500 italic">
          No writers found. Our community is waiting for your contribution!
        </div>
      )}

      <div className="p-12 rounded-[3.5rem] bg-zinc-900 dark:bg-indigo-600 text-center space-y-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 dark:bg-black/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />

        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl font-black text-white">Inspired to write?</h2>
          <p className="text-blue-100/70 dark:text-white/70 max-w-xl mx-auto text-lg leading-relaxed font-medium">
            Join our team of writers and start sharing your unique perspective
            with a global audience. Setting up is easy!
          </p>
        </div>
        <div className="relative z-10 flex items-center justify-center pt-2">
          <Link href="/register" className="px-10 py-5 bg-white text-zinc-900 rounded-full font-black text-lg hover:scale-110 transition-all active:scale-95 shadow-xl shadow-black/10">
            Apply as Writer
          </Link>
        </div>
      </div>
    </div>
  );
}
