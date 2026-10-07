import { describe, expect, it } from "vitest";
import { isPostOwnedBy } from "./postHelpers";

describe("isPostOwnedBy", () => {
  it("matches user IDs regardless of number or string representation", () => {
    expect(isPostOwnedBy({ user_id: 7 }, "7")).toBe(true);
  });

  it("uses the author ID when the post user ID is absent", () => {
    expect(isPostOwnedBy({ author: { id: "7" } }, 7)).toBe(true);
  });

  it("does not match missing IDs or a different owner", () => {
    expect(isPostOwnedBy({ user_id: 8 }, 7)).toBe(false);
    expect(isPostOwnedBy({}, 7)).toBe(false);
    expect(isPostOwnedBy({ user_id: 7 }, null)).toBe(false);
  });
});
