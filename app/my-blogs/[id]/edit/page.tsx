import { notFound, redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import PostForm from "@/components/PostForm";
import { getAuthUserFromCookies } from "@/lib/auth";

export const dynamic = "force-dynamic";

type EditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MyBlogEditPage({ params }: EditPageProps) {
  const { id } = await params;
  const user = await getAuthUserFromCookies();

  if (!user) {
    redirect("/login");
  }

  await connectToDatabase();
  const post = await Post.findById(id);

  if (!post) {
    notFound();
  }

  const isOwner = post.author?.toString() === user.userId;
  const isAdmin = user.role === "admin";
  if (!isOwner && !isAdmin) {
    notFound();
  }

  return (
    <PostForm
      mode="edit"
      postId={post._id.toString()}
      initialData={{
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags?.join(", ") ?? "",
        coverImage: post.coverImage ?? "",
      }}
    />
  );
}

