import { afterEach, describe, it, expect, vi } from "vitest";
import { fetchApi, getAccessToken, putAccessToken, removeAccessToken } from "./apiHelper";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("apiHelper", () => {
  it("can set and get and remove token", () => {
    putAccessToken("TEST_TOKEN");
    expect(getAccessToken()).toBe("TEST_TOKEN");
    removeAccessToken();
    expect(getAccessToken()).toBe(null);
  });

  it("accepts a successful response with no content", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 204 })));

    await expect(fetchApi("/posts/1/likes", { method: "POST" })).resolves.toBeNull();
  });

  it("accepts a successful response with an empty body", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 201 })));

    await expect(fetchApi("/posts/1/comments", { method: "POST" })).resolves.toBeNull();
  });

  it("surfaces an API error message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        })
      )
    );

    await expect(fetchApi("/posts/1/likes", { method: "POST" })).rejects.toThrow("401: Unauthorized");
  });

  it("surfaces API-level failures even when the HTTP response succeeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ status: "fail", message: "Token tidak valid" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
    );

    await expect(fetchApi("/posts/1/likes", { method: "POST" })).rejects.toThrow(
      "API fail: Token tidak valid"
    );
  });
});
