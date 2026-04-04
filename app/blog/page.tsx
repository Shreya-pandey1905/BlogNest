import { Suspense } from "react";
import BlogListClient from "@/components/BlogListClient";

export const dynamic = "force-dynamic";

function BlogListFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-300 border-t-transparent dark:border-zinc-600 dark:border-t-transparent"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

export default function BlogListPage() {
  return (
    <Suspense fallback={<BlogListFallback />}>
      <BlogListClient />
    </Suspense>
  );
}
