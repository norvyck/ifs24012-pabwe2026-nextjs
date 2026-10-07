import { afterEach, describe, expect, it, vi } from "vitest";
import { removeAccessToken, putAccessToken } from "@/helpers/apiHelper";
import { addComment, addPost, toggleLike, updatePostCover } from "./postApi";

afterEach(() => {
  removeAccessToken();
  vi.unstubAllGlobals();
});

describe("postApi interactions", () => {
  it("reads the documented post_id from the create-post response", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        status: "success",
        message: "Berhasil menambahkan data",
        data: { post_id: 42 },
      }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      })
    );
    vi.stubGlobal("fetch", fetchMock);
    putAccessToken("test-token");

    const response = await addPost({ description: "Post dengan gambar" });

    expect(response?.data?.post_id).toBe(42);
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/posts");
    expect(options.method).toBe("POST");
    expect(JSON.parse(String(options.body))).toEqual({ description: "Post dengan gambar" });
  });

  it("uploads the cover as multipart form data for the created post", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: "success", message: "Berhasil mengubah cover" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    vi.stubGlobal("fetch", fetchMock);
    putAccessToken("test-token");
    const formData = new FormData();
    formData.append("cover", new File(["image"], "cover.png", { type: "image/png" }));

    await updatePostCover("42", formData);

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/api/posts/42/cover");
    expect(options.method).toBe("POST");
    expect(new Headers(options.headers).get("Authorization")).toBe("Bearer test-token");
    expect(new Headers(options.headers).has("Content-Type")).toBe(false);
    expect(options.body).toBe(formData);
  });

  it("sends an authenticated POST with the give-like payload", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: "success", message: "Berhasil" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    vi.stubGlobal("fetch", fetchMock);
    putAccessToken("test-token");

    await toggleLike("post 1", 1);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/posts/post%201/likes");
    expect(options.method).toBe("POST");
    expect(new Headers(options.headers).get("Authorization")).toBe("Bearer test-token");
    expect(JSON.parse(String(options.body))).toEqual({ like: 1 });
  });

  it("sends the unlike payload when removing a like", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: "success", message: "Berhasil" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    vi.stubGlobal("fetch", fetchMock);
    putAccessToken("test-token");

    await toggleLike("post 1", 0);

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(options.body))).toEqual({ like: 0 });
  });

  it("sends the comment description in an authenticated POST", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: "success", message: "Berhasil" }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      })
    );
    vi.stubGlobal("fetch", fetchMock);
    putAccessToken("test-token");

    await addComment("post/1", { comment: "Komentar tes" });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/posts/post%2F1/comments");
    expect(options.method).toBe("POST");
    expect(new Headers(options.headers).get("Authorization")).toBe("Bearer test-token");
    expect(JSON.parse(String(options.body))).toEqual({ comment: "Komentar tes" });
  });
});
