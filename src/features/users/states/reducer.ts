import { createSlice } from "@reduxjs/toolkit";
import { asyncGetUsers, asyncGetProfile, asyncUpdateProfile, asyncUpdateProfilePhoto } from "./action";
import type { UserProfile } from "@/types";

const initialState: { list: UserProfile[]; profile: UserProfile | null } = {
  list: [],
  profile: null,
};

const slice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncGetUsers.fulfilled, (state, action) => { state.list = action.payload.data?.users || []; })
      .addCase(asyncGetProfile.fulfilled, (state, action) => { state.profile = action.payload.data?.user || null; })
      .addCase(asyncUpdateProfile.fulfilled, (state, action) => { state.profile = action.payload?.data?.user || null; })
      .addCase(asyncUpdateProfilePhoto.fulfilled, (state, action) => { state.profile = action.payload?.data?.user || null; });
  },
});
export default slice.reducer;
