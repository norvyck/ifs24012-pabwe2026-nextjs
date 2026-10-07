import { fetchApi } from "@/helpers/apiHelper";
import type { ApiResult, Post } from "@/types";

type ApiMessage = ApiResult<Record<string, unknown>>;

const requireResponse = <T,>(response: T | null, endpoint: string): T => {
  if (response === null) throw new Error(`API returned an empty response for ${endpoint}.`);
  return response;
};

export const getPosts = async (isMe = 0) => {
  const endpoint = "/posts?is_me=" + isMe;
  return requireResponse(
    await fetchApi<ApiResult<{ posts: Post[] }>>(endpoint),
    endpoint
  );
};
export const getPostDetail = async (id: string) => {
  const endpoint = "/posts/" + encodeURIComponent(id);
  return requireResponse(
    await fetchApi<ApiResult<{ post: Post }>>(endpoint),
    endpoint
  );
};
export const addPost = async (body: { description: string }) =>
  fetchApi<ApiResult<{ post_id: string | number }>>("/posts", {
    method: "POST",
    body: JSON.stringify(body),
  });
export const updatePost = async (id: string, body: { description: string }) =>
  fetchApi<ApiMessage>("/posts/" + encodeURIComponent(id), {
    method: "PUT",
    body: JSON.stringify(body),
  });
export const updatePostCover = async (id: string, formData: FormData) =>
  fetchApi<ApiMessage>("/api/posts/" + encodeURIComponent(id) + "/cover", {
    method: "POST",
    body: formData,
  });
export const deletePost = async (id: string) =>
  fetchApi<ApiMessage>("/posts/" + encodeURIComponent(id), { method: "DELETE" });
export const toggleLike = async (id: string, like: 0 | 1) =>
  fetchApi<ApiMessage>("/posts/" + encodeURIComponent(id) + "/likes", {
    method: "POST",
    body: JSON.stringify({ like }),
  });
export const addComment = async (id: string, body: { comment: string }) =>
  fetchApi<ApiMessage>("/posts/" + encodeURIComponent(id) + "/comments", {
    method: "POST",
    body: JSON.stringify(body),
  });
export const deleteComment = async (id: string, commentId: string) =>
  fetchApi<ApiMessage>(
    "/posts/" + encodeURIComponent(id) + "/comments/" + encodeURIComponent(commentId),
    { method: "DELETE" }
  );
