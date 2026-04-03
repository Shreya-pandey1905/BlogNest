import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import PostForm from "@/components/PostForm";

export const dynamic = "force-dynamic";

type EditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: EditPageProps) {
  const { id } = await params;
  await connectToDatabase();
  const post = await Post.findById(id);

  if (!post) {
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
