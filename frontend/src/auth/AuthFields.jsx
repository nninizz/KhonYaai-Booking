import "./auth.css";
import { useEffect, useState } from "react";
import {
  authLogin,
  clearOtpChallengeHandoff,
  readOtpChallengeHandoff,
  resendOtp,
  storeAuthToken,
  verifyOtp,
} from "../api.js";

// รองรับ REQ-FN-201, REQ-FN-106, REQ-CON-201
export function AuthLoginFields({
  email = "",
  password = "",
  onEmailChange,
  onPasswordChange,
  onRegister,
}) {
  return (
    <section className="auth-panel">
      <div className="auth-fields">
        <input
          aria-label="email"
          autoComplete="email"
          name="email"
          onChange={onEmailChange}
          required
          type="email"
          value={email}
        />
        <input
          aria-label="password"
          autoComplete="current-password"
          name="password"
          onChange={onPasswordChange}
          required
          type="password"
          value={password}
        />
      </div>
      <button
        className="link auth-register"
        onClick={onRegister}
        type="button"
      >
        สมัครสมาชิก
      </button>
    </section>
  );
}

// รองรับ REQ-FN-201, REQ-FN-205, REQ-CON-201
export function AuthOtpFields({ otp = "", onOtpChange }) {
  return (
    <section className="auth-panel">
      <div className="auth-fields">
        <input
          aria-label="otp"
          autoComplete="one-time-code"
          maxLength={6}
          inputMode="numeric"
          name="otp"
          onChange={onOtpChange}
          pattern="[0-9]{6}"
          required
          type="text"
          value={otp}
        />
      </div>
    </section>
  );
}

// รองรับ REQ-FN-201, REQ-FN-203, REQ-FN-205 และ REQ-CON-201: เชื่อม handoff สมัคร, OTP และ login
export function AuthFlow({ onAuthenticated }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [otpChallengeId, setOtpChallengeId] = useState(
    readOtpChallengeHandoff,
  );
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    clearOtpChallengeHandoff();
  }, []);

  async function completeLogin(token) {
    storeAuthToken(token);
    await onAuthenticated?.(token);
    setStatus("เข้าสู่ระบบสำเร็จ");
  }

  async function submitLogin(event) {
    event.preventDefault();
    setError("");
    setStatus("");
    setSubmitting(true);
    try {
      const result = await authLogin(credentials);
      if (result.token) {
        await completeLogin(result.token);
        return;
      }
      throw new Error("รูปแบบผลตอบกลับจากระบบไม่ถูกต้อง");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function requestOtp(event) {
    event.preventDefault();
    setError("");
    setStatus("");
    setSubmitting(true);
    try {
      const result = await resendOtp(otpChallengeId);
      if (!result.otp_challenge_id) {
        throw new Error("รูปแบบผลตอบกลับจากระบบไม่ถูกต้อง");
      }
      setOtpChallengeId(result.otp_challenge_id);
      setOtp("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function submitOtp(event) {
    event.preventDefault();
    setError("");
    setStatus("");
    setSubmitting(true);
    try {
      const result = await verifyOtp({
        otp_challenge_id: otpChallengeId,
        otp,
      });
      if (result.is_verified !== true) {
        throw new Error("รูปแบบผลตอบกลับจากระบบไม่ถูกต้อง");
      }
      setOtpChallengeId("");
      setOtp("");
      setCredentials({ email: "", password: "" });
      setStatus("ยืนยันบัญชีสำเร็จ กรุณาเข้าสู่ระบบ");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="card auth-card">
      {!otpChallengeId ? (
        <form onSubmit={submitLogin}>
          <h2>เข้าสู่ระบบ</h2>
          <AuthLoginFields
            email={credentials.email}
            onEmailChange={(event) =>
              setCredentials({ ...credentials, email: event.target.value })
            }
            onPasswordChange={(event) =>
              setCredentials({ ...credentials, password: event.target.value })
            }
            onRegister={() => window.location.assign("/register")}
            password={credentials.password}
          />
          <button className="primary" disabled={submitting} type="submit">
            เข้าสู่ระบบ
          </button>
        </form>
      ) : (
        <form onSubmit={submitOtp}>
          <h2>ยืนยัน OTP</h2>
          <AuthOtpFields
            onOtpChange={(event) => setOtp(event.target.value)}
            otp={otp}
          />
          <button className="primary" disabled={submitting} type="submit">
            ยืนยัน OTP
          </button>
          <button
            className="link auth-resend"
            disabled={submitting}
            onClick={requestOtp}
            type="button"
          >
            ขอ OTP ใหม่
          </button>
        </form>
      )}
      {error && <p className="msg error" role="alert">{error}</p>}
      {status && <p className="msg auth-success" role="status">{status}</p>}
    </section>
  );
}
