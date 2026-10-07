import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/userApi";

export const asyncGetUsers = createAsyncThunk("users/getAll", () => api.getAllUsers());
export const asyncGetProfile = createAsyncThunk("users/profile", () => api.getProfile());
export const asyncUpdateProfile = createAsyncThunk(
  "users/updateProfile",
  (payload: Parameters<typeof api.updateProfile>[0]) => api.updateProfile(payload)
);
export const asyncUpdateProfilePhoto = createAsyncThunk(
  "users/updatePhoto",
  (payload: FormData) => api.updateProfilePhoto(payload)
);
export const asyncUpdatePassword = createAsyncThunk(
  "users/updatePassword",
  (payload: Parameters<typeof api.updatePassword>[0]) => api.updatePassword(payload)
);
