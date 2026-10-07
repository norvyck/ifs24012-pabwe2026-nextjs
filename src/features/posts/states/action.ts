import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/postApi";

export const asyncGetPosts = createAsyncThunk("posts/getAll", async (isMe?: number) => await api.getPosts(isMe));
export const asyncGetPostDetail = createAsyncThunk("posts/getDetail", async (id: string) => await api.getPostDetail(id));
export const asyncAddPost = createAsyncThunk(
  "posts/add",
  async (payload: { description: string }) => await api.addPost(payload)
);
export const asyncUpdatePost = createAsyncThunk(
  "posts/update",
  async ({ id, body }: { id: string; body: { description: string } }) => await api.updatePost(id, body)
);
export const asyncUpdatePostCover = createAsyncThunk(
  "posts/updateCover",
  async ({ id, formData }: { id: string; formData: FormData }) => await api.updatePostCover(id, formData)
);
export const asyncDeletePost = createAsyncThunk("posts/delete", async (id: string) => await api.deletePost(id));
export const asyncToggleLike = createAsyncThunk(
  "posts/toggleLike",
  async ({ id, like }: { id: string; like: 0 | 1 }) => await api.toggleLike(id, like)
);
export const asyncAddComment = createAsyncThunk(
  "posts/addComment",
  async ({ id, body }: { id: string; body: { comment: string } }) => await api.addComment(id, body)
);
export const asyncDeleteComment = createAsyncThunk(
  "posts/deleteComment",
  async ({ id, commentId }: { id: string; commentId: string }) => await api.deleteComment(id, commentId)
);
