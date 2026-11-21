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
const { AuthFlow, AuthLoginFields, AuthOtpFields } = await vite.ssrLoadModule("/src/auth/AuthFields.jsx");
const { default: App } = await vite.ssrLoadModule("/src/App.jsx");
const {
  api,
  authLogin,
  clearOtpChallengeHandoff,
  readOtpChallengeHandoff,
  resendOtp,
  startRegistrationOtp,
  storeAuthToken,
  verifyOtp,
} = await vite.ssrLoadModule("/src/api.js");

after(async () => {
  await vite.close();
});

test("test_AC_02_01_login_renders_register_navigation_button", () => {
  const markup = renderToStaticMarkup(React.createElement(AuthLoginFields, {
    onEmailChange: () => {},
    onPasswordChange: () => {},
    onRegister: () => {},
  }));

  assert.match(markup, /type="email"/);
  assert.match(markup, /type="password"/);
  assert.match(markup, /<button[^>]*type="button"[^>]*>สมัครสมาชิก<\/button>/);
  assert.doesNotMatch(markup, /<form\b/);
});

test("test_AC_02_01_routes_show_login_and_register_with_the_confirmed_navigation", () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");

  try {
    for (const pathname of ["/", "/login"]) {
      Object.defineProperty(globalThis, "window", {
        configurable: true,
        value: {
          location: { pathname, assign: () => {} },
          sessionStorage: { getItem: () => null, removeItem: () => {} },
        },
      });
      const markup = renderToStaticMarkup(React.createElement(App));
      assert.match(markup, /เข้าสู่ระบบ/);
      assert.match(markup, /สมัครสมาชิก/);
    }

    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        location: { pathname: "/register", assign: () => {} },
        sessionStorage: { getItem: () => null, removeItem: () => {} },
      },
    });
    const registerMarkup = renderToStaticMarkup(React.createElement(App));
    assert.match(registerMarkup, /<a class="register-login-link" href="\/login">เข้าสู่ระบบ<\/a>/);
  } finally {
    if (originalWindow) {
      Object.defineProperty(globalThis, "window", originalWindow);
    } else {
      delete globalThis.window;
    }
  }
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

test("test_AC_02_01_registration_handoff_opens_an_empty_otp_form", () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const sessionValues = new Map([["authOtpChallengeId", "challenge-1"]]);
  const session = {
    getItem: (key) => sessionValues.get(key) ?? null,
    setItem: (key, value) => sessionValues.set(key, value),
    removeItem: (key) => sessionValues.delete(key),
  };
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { sessionStorage: session },
  });

  try {
    const markup = renderToStaticMarkup(React.createElement(AuthFlow));
    assert.match(markup, /<h2>ยืนยัน OTP<\/h2>/);
    assert.match(markup, /aria-label="otp"/);
    assert.match(markup, /value=""/);
    assert.doesNotMatch(markup, /สมัครสมาชิก|123456|placeholder/);
    assert.equal(readOtpChallengeHandoff(), "challenge-1");
    clearOtpChallengeHandoff();
    assert.equal(sessionValues.has("authOtpChallengeId"), false);
  } finally {
    if (originalWindow) {
      Object.defineProperty(globalThis, "window", originalWindow);
    } else {
      delete globalThis.window;
    }
  }
});

test("test_AC_02_01_and_AC_02_06_auth_requests_do_not_send_a_token", async () => {
  const originalFetch = globalThis.fetch;
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const originalSessionStorage = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
  const originalLocalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  let storedToken = "existing-token";
  const sessionValues = new Map();
  const session = {
    getItem: (key) => sessionValues.get(key) ?? null,
    setItem: (key, value) => sessionValues.set(key, value),
    removeItem: (key) => sessionValues.delete(key),
  };
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { sessionStorage: session },
  });
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: session,
  });
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
      json: async () => {
        switch (requests.length) {
          case 1:
            return { otp_challenge_id: "challenge-1", mock_otp: "123456" };
          case 2:
            return { token: "verified-token" };
          case 3:
            return { is_verified: true };
          default:
            return { otp_challenge_id: "challenge-2", mock_otp: "123456" };
        }
      },
    };
  };

  try {
    const challenge = await startRegistrationOtp("registration-proof");
    const challengeId = readOtpChallengeHandoff();
    clearOtpChallengeHandoff();
    const login = await authLogin({ email: "test@mail.com", password: "1234" });
    const verified = await verifyOtp({
      otp_challenge_id: challengeId,
      otp: "123456",
    });
    const resent = await resendOtp(challengeId);

    assert.equal(challenge.otp_challenge_id, "challenge-1");
    assert.equal(challengeId, "challenge-1");
    assert.equal(login.token, "verified-token");
    assert.deepEqual(verified, { is_verified: true });
    assert.equal(resent.otp_challenge_id, "challenge-2");
    assert.equal(requests[0].url, "/api/auth/otp-challenges");
    assert.equal(requests[1].url, "/api/auth/login");
    assert.equal(requests[2].url, "/api/auth/verify-otp");
    assert.equal(requests[3].url, "/api/auth/otp-challenges/challenge-1/resend");
    assert.deepEqual(requests.map(({ options }) => options.headers.Authorization), [
      undefined,
      undefined,
      undefined,
      undefined,
    ]);
    assert.deepEqual(JSON.parse(requests[0].options.body), {
      registration_proof: "registration-proof",
    });
    assert.deepEqual(JSON.parse(requests[1].options.body), {
      email: "test@mail.com",
      password: "1234",
    });
    assert.deepEqual(JSON.parse(requests[2].options.body), {
      otp_challenge_id: "challenge-1",
      otp: "123456",
    });

    storeAuthToken("verified-token");
    await api("/payments/1");
    assert.ok(requests[4].options.headers.Authorization);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalWindow) {
      Object.defineProperty(globalThis, "window", originalWindow);
    } else {
      delete globalThis.window;
    }
    if (originalSessionStorage) {
      Object.defineProperty(globalThis, "sessionStorage", originalSessionStorage);
    } else {
      delete globalThis.sessionStorage;
    }
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