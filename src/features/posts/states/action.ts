import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/postApi";

export const asyncGetPosts = createAsyncThunk("posts/getAll", (isMe?: number) => api.getPosts(isMe));
export const asyncGetPostDetail = createAsyncThunk("posts/getDetail", (id: string) => api.getPostDetail(id));
export const asyncAddPost = createAsyncThunk(
  "posts/add",
  (payload: { description: string }) => api.addPost(payload)
);
export const asyncUpdatePost = createAsyncThunk(
  "posts/update",
  ({ id, body }: { id: string; body: { description: string } }) => api.updatePost(id, body)
);
export const asyncUpdatePostCover = createAsyncThunk(
  "posts/updateCover",
  ({ id, formData }: { id: string; formData: FormData }) => api.updatePostCover(id, formData)
);
export const asyncDeletePost = createAsyncThunk("posts/delete", (id: string) => api.deletePost(id));
export const asyncToggleLike = createAsyncThunk(
  "posts/toggleLike",
  ({ id, like }: { id: string; like: 0 | 1 }) => api.toggleLike(id, like)
);
export const asyncAddComment = createAsyncThunk(
  "posts/addComment",
  ({ id, body }: { id: string; body: { comment: string } }) => api.addComment(id, body)
);
export const asyncDeleteComment = createAsyncThunk(
  "posts/deleteComment",
  ({ id, commentId }: { id: string; commentId: string }) => api.deleteComment(id, commentId)
);
