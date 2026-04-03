import Link from "next/link";
import { getAuthUserFromCookies } from "@/lib/auth";

export default async function AboutPage() {
  const user = await getAuthUserFromCookies();

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
          About <span className="text-indigo-600 dark:text-indigo-400">BlogNest</span>
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          We believe everyone has a story worth telling and knowledge worth sharing.
        </p>
      </div>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-lg font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
        <p>
          BlogNest was born out of a simple idea: creating a space where high-quality content 
          meets a premium user experience. Our platform is designed for writers who care about 
          their craft and readers who seek meaningful insights.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 not-prose py-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">Our Mission</h3>
            <p className="text-base text-zinc-500 dark:text-zinc-400">
              To democratize publishing and provide the best tools for creators to express themselves 
              and build their own communities.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">Our Values</h3>
            <p className="text-base text-zinc-500 dark:text-zinc-400">
              Quality over quantity, simplicity over complexity, and community above all else. 
              We prioritize the human element in every feature we build.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 pt-8 border-t border-zinc-100 dark:border-zinc-900">
          The Platform
        </h2>
        <p>
          Built with modern technologies like Next.js, TypeScript, and MongoDB, BlogNest 
          offers a fast, secure, and accessible experience for users worldwide. Whether 
          you're a developer sharing tutorials or a traveler sharing stories, our platform 
          scales with your needs.
        </p>
      </div>

      {!user && (
        <div className="p-12 rounded-[3rem] bg-zinc-900 dark:bg-blue-600 text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">Join the Community</h2>
          <p className="text-blue-100/70 dark:text-white/70 max-w-lg mx-auto">
            Start your journey as a writer today and connect with thousands of readers.
          </p>
          <Link href="/register" className="inline-block px-8 py-4 bg-white text-zinc-900 rounded-full font-bold text-lg hover:scale-105 transition-all active:scale-95">
            Get Started
          </Link>
        </div>
      )}
    </div>
  );
}
