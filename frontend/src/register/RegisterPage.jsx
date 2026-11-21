import { useState } from "react";
import { startRegistrationOtp } from "../api.js";
import { registerUser } from "./register.js";
import { validateRegisterForm } from "./validators.js";

const REGISTER_FIELDS = new Set(["name", "email", "phone", "password"]);

// REQ-FN-101, REQ-FN-105, REQ-FN-106, REQ-FN-107: แสดงและส่งต่อจากฟอร์มสมัคร
export default function RegisterPage() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [requestError, setRequestError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [otpStartError, setOtpStartError] = useState("");

  async function submit(event) {
    event.preventDefault();
    const validationErrors = validateRegisterForm(values);
    setFieldErrors(validationErrors);
    setRequestError("");
    setOtpStartError("");
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const result = await registerUser(values);
      if (result.kind === "success") {
        setRegistrationComplete(true);
        try {
          const registrationProof = result.data?.registration_proof;
          if (typeof registrationProof !== "string" || !registrationProof) {
            throw new Error("ไม่พบ registration_proof ในผลสมัครสมาชิก");
          }
          await startRegistrationOtp(registrationProof);
          window.location.assign("/login");
        } catch (error) {
          setOtpStartError(
            error instanceof Error ? error.message : String(error),
          );
        }
        return;
      }

      if (result.kind === "conflict") {
        const field = result.data.field;
        if (field === "email" || field === "phone") {
          setFieldErrors({ [field]: result.data.detail });
        }
        return;
      }

      if (result.kind === "validation_error") {
        const errors = {};
        for (const item of result.data.detail) {
          const field = item.loc?.at(-1);
          if (REGISTER_FIELDS.has(field)) {
            errors[field] = item.msg;
          }
        }
        setFieldErrors(errors);
        return;
      }

      if (result.kind === "network_error") {
        setRequestError(result.error?.message || String(result.error));
      } else if (result.kind === "http_error") {
        const detail = result.data?.detail;
        setRequestError(
          typeof detail === "string"
            ? detail
            : result.error?.message || `HTTP ${result.status}`,
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  function updateField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  return (
    <section className="card">
      <h2>สมัครสมาชิก</h2>
      <form noValidate onSubmit={submit}>
        <label className="field">
          ชื่อ
          <input
            name="name"
            onChange={updateField}
            required
            type="text"
            value={values.name}
          />
          {fieldErrors.name && <span className="err" role="alert">{fieldErrors.name}</span>}
        </label>

        <label className="field">
          อีเมล
          <input
            autoComplete="email"
            name="email"
            onChange={updateField}
            required
            type="email"
            value={values.email}
          />
          {fieldErrors.email && <span className="err" role="alert">{fieldErrors.email}</span>}
        </label>

        <label className="field">
          เบอร์โทร
          <input
            autoComplete="tel"
            name="phone"
            onChange={updateField}
            required
            type="tel"
            value={values.phone}
          />
          {fieldErrors.phone && <span className="err" role="alert">{fieldErrors.phone}</span>}
        </label>

        <label className="field">
          รหัสผ่าน
          <input
            autoComplete="new-password"
            name="password"
            onChange={updateField}
            required
            type="password"
            value={values.password}
          />
          {fieldErrors.password && <span className="err" role="alert">{fieldErrors.password}</span>}
        </label>

        <button
          className="primary"
          disabled={submitting || registrationComplete}
          type="submit"
        >
          {registrationComplete ? "สมัครสำเร็จแล้ว" : "สมัคร"}
        </button>
      </form>
      {requestError && <p className="err" role="alert">{requestError}</p>}
      {registrationComplete && (
        <p className="msg auth-success" role="status">สมัครสมาชิกสำเร็จแล้ว</p>
      )}
      {otpStartError && (
        <p className="err" role="alert">
          เริ่มยืนยัน OTP ไม่สำเร็จ: {otpStartError} (ไม่ได้ส่งคำขอสมัครซ้ำ)
        </p>
      )}
      <a className="register-login-link" href="/login">เข้าสู่ระบบ</a>
    </section>
  );
}
