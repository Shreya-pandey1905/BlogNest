export default function TermsPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
          Terms of <span className="text-indigo-600 dark:text-indigo-400">Service</span>
        </h1>
        <p className="text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Last Updated: {lastUpdated}
        </p>
      </div>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-zinc-600 dark:text-zinc-400 leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">1. Acceptance of Terms</h2>
          <p>
            By accessing and using BlogNest, you agree to be bound by these Terms of Service 
            and all applicable laws and regulations.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">2. User Content</h2>
          <p>
            You retain all rights to the content you post on BlogNest. By publishing content, 
            you grant us a non-exclusive, worldwide, royalty-free license to host and 
            display your content.
          </p>
          <ul className="list-disc pl-6 space-y-2 font-medium text-zinc-900 dark:text-zinc-100">
            <li>You are responsible for your content.</li>
            <li>Content must not violate intellectual property rights.</li>
            <li>Content must adhere to our Community Guidelines.</li>
          </ul>
        </section>

        <section className="space-y-4 font-medium text-zinc-900 dark:text-zinc-100 italic bg-zinc-50 dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm shadow-zinc-200/50 dark:shadow-none">
          <p>
            "Creativity thrives in a safe space. We reserve the right to remove content 
            that violates these terms to protect our community."
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">3. Prohibited Conduct</h2>
          <p>
            You agree not to engage in any activity that interferes with or disrupts 
            the platform, including but not limited to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Harassment or abusive behavior.</li>
            <li>Spamming or unauthorized advertising.</li>
            <li>Attempting to bypass security measures.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">4. Termination</h2>
          <p>
            We may terminate or suspend your access to the platform at any time, 
            without prior notice, for conduct that violates these Terms.
          </p>
        </section>

        <section className="space-y-4 border-t border-zinc-100 dark:border-zinc-900 pt-8 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Contact Us</h2>
          <p>
            For any legal inquiries, please contact 
            <span className="text-indigo-600 dark:text-indigo-400 font-bold ml-1">legal@blogcms.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
