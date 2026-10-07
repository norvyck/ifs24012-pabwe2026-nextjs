import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("cover upload route", () => {
  it("forwards the image and bearer token to the fixed Delcom endpoint", async () => {
    const upstreamResponse = new Response(
      JSON.stringify({ status: "success", message: "Berhasil mengubah cover" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
    const fetchMock = vi.fn().mockResolvedValue(upstreamResponse);
    vi.stubGlobal("fetch", fetchMock);

    const formData = new FormData();
    formData.append("cover", new File(["image bytes"], "cover.png", { type: "image/png" }));
    const request = new Request("http://localhost/api/posts/42/cover", {
      method: "POST",
      headers: { Authorization: "Bearer test-token" },
      body: formData,
    });
    vi.spyOn(request, "formData").mockResolvedValue(formData);
    const response = await POST(request, { params: Promise.resolve({ postId: "42" }) });

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/posts/42/cover");
    expect(options.method).toBe("POST");
    expect(new Headers(options.headers).get("Authorization")).toBe("Bearer test-token");
    expect(options.body).toBeInstanceOf(FormData);
    expect((options.body as FormData).get("cover")).toMatchObject({
      name: "cover.png",
      type: "image/png",
    });
  });

  it("rejects requests without an authenticated session", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("http://localhost/api/posts/42/cover", {
      method: "POST",
      body: new FormData(),
    });
    const response = await POST(request, { params: Promise.resolve({ postId: "42" }) });

    expect(response.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
