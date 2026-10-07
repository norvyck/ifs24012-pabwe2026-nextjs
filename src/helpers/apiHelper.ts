import { DELCOM_BASEURL } from "@/lib/config";

export const getAccessToken = () => typeof window !== "undefined" ? localStorage.getItem("token") : null;
export const putAccessToken = (token: string) => typeof window !== "undefined" && localStorage.setItem("token", token);
export const removeAccessToken = () => typeof window !== "undefined" && localStorage.removeItem("token");

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "string" && error.trim()) return error;
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    const message = error.message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
};

export const fetchApi = async <T = Record<string, unknown>>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | null> => {
  const token = getAccessToken();
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", "Bearer " + token);
  }
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  
  const url = endpoint.startsWith("/api/") ? endpoint : DELCOM_BASEURL + endpoint;
  const response = await fetch(url, {
    ...options,
    headers,
  });
  if (response.status === 204) {
    return null;
  }
  const responseText = await response.text();
  let data: unknown = null;
  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
  }
  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data && typeof data.message === "string"
        ? data.message
        : typeof data === "string" && data.trim()
          ? data
          : `Permintaan gagal (${response.status} ${response.statusText}).`;
    throw new Error(`${response.status}: ${message}`);
  }
  if (data === null) return null;
  if (typeof data !== "object" || Array.isArray(data)) {
    throw new Error("API returned an unexpected response format.");
  }
  if (
    "status" in data &&
    (data.status === "fail" || data.status === "error")
  ) {
    const message =
      "message" in data && typeof data.message === "string"
        ? data.message
        : "API menolak permintaan.";
    throw new Error(`API ${data.status}: ${message}`);
  }
  return data as T;
};
