import { redirect } from "next/navigation";
import PostForm from "@/components/PostForm";
import { getAuthUserFromCookies } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewBlogPostPage() {
  const user = await getAuthUserFromCookies();
  if (!user) {
    redirect("/login");
  }

  return <PostForm mode="create" />;
}
