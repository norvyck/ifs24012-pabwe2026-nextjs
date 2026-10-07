import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/authApi";
import { removeAccessToken } from "@/helpers/apiHelper";

export const asyncLogin = createAsyncThunk("auth/login", async (payload: Parameters<typeof api.login>[0]) => {
  return api.login(payload);
});
export const asyncRegister = createAsyncThunk("auth/register", async (payload: Parameters<typeof api.register>[0]) => {
  return api.register(payload);
});
export const asyncLogout = createAsyncThunk("auth/logout", async () => {
  removeAccessToken();
});
