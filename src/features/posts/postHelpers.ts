import type { Post } from "@/types";

export const isPostOwnedBy = (
  post: Pick<Post, "user_id" | "author">,
  userId: string | number | null | undefined
) => {
  const authorId = post.user_id ?? post.author?.id;
  return userId != null && authorId != null && String(authorId) === String(userId);
};
