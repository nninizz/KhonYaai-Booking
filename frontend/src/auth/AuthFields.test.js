import assert from "node:assert/strict";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const vite = await createServer({
  configFile: fileURLToPath(new URL("../../vite.config.js", import.meta.url)),
  root: fileURLToPath(new URL("../..", import.meta.url)),
  server: { middlewareMode: true },
});
const { AuthLoginFields, AuthOtpFields } = await vite.ssrLoadModule("/src/auth/AuthFields.jsx");
const { api, authLogin, storeAuthToken, verifyOtp } = await vite.ssrLoadModule("/src/api.js");

after(async () => {
  await vite.close();
});

test("T-07 renders requirement-backed login fields without unconfirmed actions", () => {
  const markup = renderToStaticMarkup(React.createElement(AuthLoginFields, {
    onEmailChange: () => {},
    onPasswordChange: () => {},
  }));

  assert.match(markup, /type="email"/);
  assert.match(markup, /type="password"/);
  assert.doesNotMatch(markup, /<button\b|<form\b/);
});

test("test_AC_02_01_and_AC_02_06_otp_field_starts_empty_without_revealing_mock_code", () => {
  const markup = renderToStaticMarkup(React.createElement(AuthOtpFields, {
    onOtpChange: () => {},
  }));

  assert.match(markup, /aria-label="otp"/);
  assert.match(markup, /inputMode="numeric"/);
  assert.match(markup, /maxLength="6"/);
  assert.match(markup, /pattern="\[0-9\]\{6\}"/);
  assert.match(markup, /value=""/);
  assert.doesNotMatch(markup, /123456|placeholder|<p\b|<button\b|<form\b/);
});

test("test_AC_02_01_and_AC_02_06_auth_requests_do_not_send_a_token", async () => {
  const originalFetch = globalThis.fetch;
  const originalLocalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  let storedToken = "existing-token";
  const requests = [];
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: () => storedToken,
      setItem: (_key, value) => { storedToken = value; },
    },
  });
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    return {
      ok: true,
      json: async () => requests.length === 1
        ? { otp_challenge_id: "challenge-1", mock_otp: "123456" }
        : { token: "verified-token" },
    };
  };

  try {
    const login = await authLogin({ email: "test@mail.com", password: "1234" });
    await verifyOtp({ otp_challenge_id: login.otp_challenge_id, otp: "123456" });

    assert.equal(requests[0].url, "/api/auth/login");
    assert.equal(requests[1].url, "/api/auth/verify-otp");
    assert.equal(requests[0].options.headers.Authorization, undefined);
    assert.equal(requests[1].options.headers.Authorization, undefined);
    assert.deepEqual(JSON.parse(requests[0].options.body), {
      email: "test@mail.com",
      password: "1234",
    });
    assert.deepEqual(JSON.parse(requests[1].options.body), {
      otp_challenge_id: "challenge-1",
      otp: "123456",
    });

    storeAuthToken("verified-token");
    await api("/payments/1");
    assert.equal(requests[2].options.headers.Authorization, "Bearer verified-token");
  } finally {
    globalThis.fetch = originalFetch;
    if (originalLocalStorage) {
      Object.defineProperty(globalThis, "localStorage", originalLocalStorage);
    } else {
      delete globalThis.localStorage;
    }
  }
});

test("test_AC_02_01_api_errors_expose_the_server_detail_message", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: false,
    status: 401,
    json: async () => ({ detail: "Invalid email or password" }),
  });

  try {
    await assert.rejects(
      authLogin({ email: "wrong@mail.com", password: "wrong" }),
      { message: "Invalid email or password", status: 401 },
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
