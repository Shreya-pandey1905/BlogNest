export default function GuidelinesPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
          Community <span className="text-indigo-600 dark:text-indigo-400">Guidelines</span>
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          Help us maintain a safe, respectful, and high-quality environment for everyone.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-black">1</span>
            Be Respectful
          </h2>
          <p>
            Treat others as you would like to be treated. We welcome diverse opinions 
            but do not tolerate hate speech, harassment, or personal attacks.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-black">2</span>
            Original Content
          </h2>
          <p>
            Share your own thoughts and discoveries. Plagiarism is strictly prohibited. 
            If you are referencing others, please provide proper attribution.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-black">3</span>
            No Spam
          </h2>
          <p>
            Help keep the platform clean. Avoid repetitive posts, unauthorized 
            advertising, or misleading links that lead to bulk marketing.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-black">4</span>
            Constructive Feedback
          </h2>
          <p>
            When commenting, aim to be helpful. Constructive criticism is welcome, 
            but aim to elevate the conversation and support fellow creators.
          </p>
        </div>
      </div>

      <div className="p-12 rounded-[3rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center space-y-6">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Reporting Violations</h2>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
          If you see content that violates these guidelines, please report it to our 
          moderation team at <span className="text-indigo-600 dark:text-indigo-400 font-bold">report@blogcms.com</span>.
        </p>
      </div>
    </div>
  );
}
