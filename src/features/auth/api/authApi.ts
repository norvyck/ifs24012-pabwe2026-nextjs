import { fetchApi, putAccessToken } from "@/helpers/apiHelper";
import type { ApiResult } from "@/types";

export const login = async ({ email, password }: { email: string; password: string }) => {
  const data = await fetchApi<ApiResult<{ token: string }>>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!data?.data?.token) {
    throw new Error("Login API tidak mengembalikan access token.");
  }
  putAccessToken(data.data.token);
  return data;
};

export const register = async ({ name, email, password }: { name: string; email: string; password: string }) => {
  return await fetchApi<ApiResult<Record<string, unknown>>>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
};
