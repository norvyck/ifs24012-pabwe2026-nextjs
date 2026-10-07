const fs = require('fs');
const path = require('path');

const files = {
  // Auth Redux
  'src/features/auth/states/action.ts': `import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/authApi";
import { removeAccessToken } from "@/helpers/apiHelper";

export const asyncLogin = createAsyncThunk("auth/login", async (payload: any) => {
  return await api.login(payload);
});
export const asyncRegister = createAsyncThunk("auth/register", async (payload: any) => {
  return await api.register(payload);
});
export const asyncLogout = createAsyncThunk("auth/logout", async () => {
  removeAccessToken();
});
`,
  'src/features/auth/states/reducer.ts': `import { createSlice } from "@reduxjs/toolkit";
import { asyncLogin, asyncLogout } from "./action";

const initialState = { authUser: null };

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncLogin.fulfilled, (state, action) => {
        state.authUser = action.payload.data;
      })
      .addCase(asyncLogout.fulfilled, (state) => {
        state.authUser = null;
      });
  },
});
export default slice.reducer;
`,

  // Users Redux
  'src/features/users/states/action.ts': `import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/userApi";

export const asyncGetUsers = createAsyncThunk("users/getAll", async () => await api.getAllUsers());
export const asyncGetProfile = createAsyncThunk("users/profile", async () => await api.getProfile());
export const asyncUpdateProfile = createAsyncThunk("users/updateProfile", async (payload: any) => await api.updateProfile(payload));
export const asyncUpdateProfilePhoto = createAsyncThunk("users/updatePhoto", async (payload: FormData) => await api.updateProfilePhoto(payload));
export const asyncUpdatePassword = createAsyncThunk("users/updatePassword", async (payload: any) => await api.updatePassword(payload));
`,
  'src/features/users/states/reducer.ts': `import { createSlice } from "@reduxjs/toolkit";
import { asyncGetUsers, asyncGetProfile, asyncUpdateProfile, asyncUpdateProfilePhoto } from "./action";

const slice = createSlice({
  name: "users",
  initialState: { list: [], profile: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncGetUsers.fulfilled, (state, action) => { state.list = action.payload.data; })
      .addCase(asyncGetProfile.fulfilled, (state, action) => { state.profile = action.payload.data; })
      .addCase(asyncUpdateProfile.fulfilled, (state, action) => { state.profile = action.payload.data; })
      .addCase(asyncUpdateProfilePhoto.fulfilled, (state, action) => { state.profile = action.payload.data; });
  },
});
export default slice.reducer;
`,

  // Posts Redux
  'src/features/posts/states/action.ts': `import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/postApi";

export const asyncGetPosts = createAsyncThunk("posts/getAll", async (isMe?: number) => await api.getPosts(isMe));
export const asyncGetPostDetail = createAsyncThunk("posts/getDetail", async (id: string) => await api.getPostDetail(id));
export const asyncAddPost = createAsyncThunk("posts/add", async (payload: any) => await api.addPost(payload));
export const asyncUpdatePost = createAsyncThunk("posts/update", async ({id, body}: any) => await api.updatePost(id, body));
export const asyncUpdatePostCover = createAsyncThunk("posts/updateCover", async ({id, formData}: any) => await api.updatePostCover(id, formData));
export const asyncDeletePost = createAsyncThunk("posts/delete", async (id: string) => await api.deletePost(id));
export const asyncToggleLike = createAsyncThunk("posts/toggleLike", async (id: string) => await api.toggleLike(id));
export const asyncAddComment = createAsyncThunk("posts/addComment", async ({id, body}: any) => await api.addComment(id, body));
export const asyncDeleteComment = createAsyncThunk("posts/deleteComment", async ({id, commentId}: any) => await api.deleteComment(id, commentId));
`,
  'src/features/posts/states/reducer.ts': `import { createSlice } from "@reduxjs/toolkit";
import { asyncGetPosts, asyncGetPostDetail } from "./action";

const slice = createSlice({
  name: "posts",
  initialState: { list: [], detail: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncGetPosts.fulfilled, (state, action) => { state.list = action.payload.data; })
      .addCase(asyncGetPostDetail.fulfilled, (state, action) => { state.detail = action.payload.data; });
  },
});
export default slice.reducer;
`
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullPath = path.resolve(process.cwd(), filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created ' + filepath);
});
