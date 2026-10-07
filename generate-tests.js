const fs = require('fs');
const path = require('path');

const files = {
  'src/store.test.ts': `import { describe, it, expect } from "vitest";
import { store } from "./store";

describe("Redux Store", () => {
  it("should initialize correctly", () => {
    const state = store.getState();
    expect(state).toHaveProperty("auth");
    expect(state).toHaveProperty("users");
    expect(state).toHaveProperty("posts");
  });
});
`,
  'src/helpers/apiHelper.test.ts': `import { describe, it, expect } from "vitest";
import { getAccessToken, putAccessToken, removeAccessToken } from "./apiHelper";

describe("apiHelper", () => {
  it("can set and get and remove token", () => {
    putAccessToken("TEST_TOKEN");
    expect(getAccessToken()).toBe("TEST_TOKEN");
    removeAccessToken();
    expect(getAccessToken()).toBe(null);
  });
});
`,
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullPath = path.resolve(process.cwd(), filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created ' + filepath);
});
