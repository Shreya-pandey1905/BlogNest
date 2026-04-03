"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [message, setMessage]     = useState("");
  const [state, setState]         = useState<FormState>("idle");
  const [errorMsg, setErrorMsg]   = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setState("error");
        return;
      }

      setState("success");
      setFirstName("");
      setLastName("");
      setEmail("");
      setMessage("");
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setState("error");
    }
  };

  const inputClass =
    "w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-600/30 focus:border-blue-500 outline-none transition-all";

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Hero */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
          How can <br />
          <span className="text-indigo-600 dark:text-indigo-400">we help you?</span>
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          Our support team is here to help you with any questions or issues.
        </p>
      </div>

      {/* Info cards */}
      <div className="grid md:grid-cols-3 gap-8 text-center py-8">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-zinc-900/50 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-zinc-800">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-lg">Email Support</h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Reach out anytime at <br />
            <span className="text-zinc-900 dark:text-zinc-100 font-medium">support@blogcms.com</span>
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-zinc-900/50 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-zinc-800">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
            </svg>
          </div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-lg">Community Chat</h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Join our writers&apos; community <br />
            <span className="text-zinc-900 dark:text-zinc-100 font-medium">discord.gg/blogcms</span>
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-zinc-900/50 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-zinc-800">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
            </svg>
          </div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-lg">Social Media</h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Follow us on X for updates <br />
            <span className="text-zinc-900 dark:text-zinc-100 font-medium">@BlogCMS_Platform</span>
          </p>
        </div>
      </div>

      {/* Form section */}
      <div className="grid md:grid-cols-2 gap-16 py-8 border-t border-zinc-100 dark:border-zinc-900">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Send us a message</h3>
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Have a specific question? Fill out the form and we&apos;ll get back to you within 24 hours.
          </p>
          <div className="space-y-4">
            <p className="font-bold text-zinc-900 dark:text-zinc-50">Office HQ</p>
            <p className="text-zinc-500 dark:text-zinc-400">123 Creator Lane, San Francisco, CA 94103</p>
          </div>
        </div>

        {/* Success state */}
        {state === "success" ? (
          <div className="flex flex-col items-center justify-center gap-4 bg-white dark:bg-zinc-900/50 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center border border-green-100 dark:border-green-900/30">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Message Sent!</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Thanks for reaching out. We&apos;ll get back to you within 24 hours.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setState("idle")}
              className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="space-y-4 bg-white dark:bg-zinc-900/50 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm backdrop-blur-sm"
          >
            {/* Name row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="contact-first-name"
                  type="text"
                  required
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Last Name
                </label>
                <input
                  id="contact-last-name"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                required
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                placeholder="How can we help?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Error */}
            {state === "error" && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 animate-in fade-in duration-300">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">{errorMsg}</p>
              </div>
            )}

            {/* Submit */}
            <button
              id="contact-submit-btn"
              type="submit"
              disabled={state === "loading"}
              className="w-full py-4 bg-zinc-900 dark:bg-indigo-600 text-white rounded-xl font-bold text-sm hover:scale-[1.02] transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/10 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {state === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                "Submit Message"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
