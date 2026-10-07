import { createSlice } from "@reduxjs/toolkit";
import { asyncLogin, asyncLogout } from "./action";

const initialState: { authUser: Record<string, unknown> | null } = { authUser: null };

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncLogin.fulfilled, (state, action) => {
        state.authUser = action.payload.data ?? null;
      })
      .addCase(asyncLogout.fulfilled, (state) => {
        state.authUser = null;
      });
  },
});
export default slice.reducer;
