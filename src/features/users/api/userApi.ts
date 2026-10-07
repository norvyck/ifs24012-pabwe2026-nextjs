import { fetchApi } from "@/helpers/apiHelper";
import type { ApiResult, UserProfile } from "@/types";

type ApiMessage = ApiResult<Record<string, unknown>>;

const requireResponse = <T,>(response: T | null, endpoint: string): T => {
  if (response === null) throw new Error(`API returned an empty response for ${endpoint}.`);
  return response;
};

export const getAllUsers = async () =>
  requireResponse(
    await fetchApi<ApiResult<{ users: UserProfile[] }>>("/users"),
    "/users"
  );
export const getProfile = async () =>
  requireResponse(
    await fetchApi<ApiResult<{ user: UserProfile }>>("/users/me"),
    "/users/me"
  );
export const updateProfile = async (body: { name: string; email: string }) =>
  fetchApi<ApiResult<{ user: UserProfile }>>("/users/me", {
    method: "PUT",
    body: JSON.stringify(body),
  });
export const updateProfilePhoto = async (formData: FormData) =>
  fetchApi<ApiResult<{ user: UserProfile }>>("/api/users/me/photo", {
    method: "POST",
    body: formData,
  });
export const updatePassword = async (body: { old_password: string; new_password: string }) =>
  fetchApi<ApiMessage>("/users/me/password", {
    method: "PUT",
    body: JSON.stringify(body),
  });
