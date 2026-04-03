export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
          Privacy <span className="text-indigo-600 dark:text-indigo-400">Policy</span>
        </h1>
        <p className="text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Last Updated: {lastUpdated}
        </p>
      </div>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-zinc-600 dark:text-zinc-400 leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">1. Introduction</h2>
          <p>
            Welcome to BlogNest. Your privacy is important to us. This Privacy Policy explains 
            how we collect, use, and protect your information when you use our platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">2. Information Collection</h2>
          <p>
            We collect information you provide directly to us (name, email, profile content) 
            and automatically collected information (log data, cookies) to improve your experience.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account Info:</strong> Name, email address, password.</li>
            <li><strong>User Content:</strong> Blog posts, comments, profile data.</li>
            <li><strong>Technical Info:</strong> IP address, browser type, device information.</li>
          </ul>
        </section>

        <section className="space-y-4 font-medium text-zinc-900 dark:text-zinc-100 italic bg-zinc-50 dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800">
          <p>
            "We will never sell your personal data to third parties. Your content belongs to you, 
            and we are here to help you share it safely."
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">3. How We Use Data</h2>
          <p>
            We use your data to provide our services, communicate with you, and ensure a safe 
            environment for all users. This includes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personalizing your feed and recommendations.</li>
            <li>Managing your account and subscriptions.</li>
            <li>Improving platform performance and security.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">4. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal information 
            from unauthorized access or disclosure.
          </p>
        </section>

        <section className="space-y-4 border-t border-zinc-100 dark:border-zinc-900 pt-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Questions?</h2>
          <p>
            If you have any questions about our privacy practices, please contact us at 
            <span className="text-indigo-600 dark:text-indigo-400 font-bold ml-1">privacy@blogcms.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
