"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, FormEvent, useMemo, useState } from "react";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = useMemo(() => searchParams.get("email") ?? "", [searchParams]);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email) {
        throw new Error("Missing email parameter. Please register again.");
      }

      const res = await fetch("/api/auth/verify-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      router.push(data.user?.role === "admin" ? "/dashboard" : "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">Verify your email</h1>
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 text-zinc-900">
        <div className="space-y-1">
          <p className="text-sm text-zinc-600">Email</p>
          <input
            value={email}
            readOnly
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
          />
        </div>
        <input
          required
          inputMode="numeric"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder:text-zinc-400"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </section>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md p-6 text-zinc-900">Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}

