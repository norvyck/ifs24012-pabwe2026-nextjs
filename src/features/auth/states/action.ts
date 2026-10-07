import { createAsyncThunk } from "@reduxjs/toolkit";
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
