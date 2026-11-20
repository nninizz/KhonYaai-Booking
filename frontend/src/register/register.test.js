import assert from "node:assert/strict";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const vite = await createServer({
  configFile: fileURLToPath(new URL("../../vite.config.js", import.meta.url)),
  root: fileURLToPath(new URL("../..", import.meta.url)),
  server: { middlewareMode: true },
});
const { registerUser } = await vite.ssrLoadModule("/src/register/register.js");

after(async () => {
  await vite.close();
});

test("test_AC_01_01_register_uses_same_origin_proxy_without_authorization", async () => {
  const originalFetch = globalThis.fetch;
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url, options };
    return {
      status: 201,
      json: async () => ({
        id: 3,
        name: "สมชาย ใจดี",
        email: "new-register@gmail.com",
        phone: "0871112233",
        is_verified: false,
      }),
    };
  };

  try {
    const result = await registerUser({
      name: "สมชาย ใจดี",
      email: "new-register@gmail.com",
      phone: "0871112233",
      password: "Abcd1234",
    });

    assert.equal(result.kind, "success");
    assert.equal(request.url, "/api/auth/register");
    assert.equal(request.options.headers.Authorization, undefined);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
