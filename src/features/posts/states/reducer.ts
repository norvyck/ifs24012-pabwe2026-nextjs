import { createSlice } from "@reduxjs/toolkit";
import { asyncGetPosts, asyncGetPostDetail } from "./action";
import type { Post } from "@/types";

const initialState: { list: Post[]; detail: Post | null } = {
  list: [],
  detail: null,
};

const slice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncGetPosts.fulfilled, (state, action) => { state.list = action.payload.data?.posts || []; })
      .addCase(asyncGetPostDetail.fulfilled, (state, action) => { state.detail = action.payload.data?.post || null; });
  },
});
export default slice.reducer;
