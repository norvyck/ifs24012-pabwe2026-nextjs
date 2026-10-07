import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/userApi";

export const asyncGetUsers = createAsyncThunk("users/getAll", async () => await api.getAllUsers());
export const asyncGetProfile = createAsyncThunk("users/profile", async () => await api.getProfile());
export const asyncUpdateProfile = createAsyncThunk("users/updateProfile", async (payload: any) => await api.updateProfile(payload));
export const asyncUpdateProfilePhoto = createAsyncThunk("users/updatePhoto", async (payload: FormData) => await api.updateProfilePhoto(payload));
export const asyncUpdatePassword = createAsyncThunk("users/updatePassword", async (payload: any) => await api.updatePassword(payload));
