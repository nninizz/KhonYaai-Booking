// รองรับ REQ-CON-201: Payment คงการแนบ token ค่าเริ่มต้นจาก helper เดิม
const DEFAULT_TOKEN = "mock-token-1";

function getToken() {
  try {
    return localStorage.getItem("token") || DEFAULT_TOKEN;
  } catch {
    return DEFAULT_TOKEN;
  }
}

// รองรับ REQ-FN-201, REQ-FN-203, REQ-FN-205: เลือกไม่แนบ token สำหรับ login/verify
export async function api(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    headers.Authorization = `Bearer ${getToken()}`;
  }

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = Array.isArray(data.detail)
      ? data.detail.map((d) => d.msg.replace(/^Value error, /, "")).join(", ")
      : data.detail;
    const err = new Error(detail || `เกิดข้อผิดพลาด (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// รองรับ REQ-FN-201, REQ-FN-205: login ไม่ต้องใช้ token ก่อนเรียก
export const authLogin = (body) =>
  api("/auth/login", { method: "POST", body, auth: false });

// รองรับ REQ-FN-203, REQ-FN-205: verify OTP ไม่ต้องใช้ token ก่อนเรียก
export const verifyOtp = (body) =>
  api("/auth/verify-otp", { method: "POST", body, auth: false });

// รองรับ REQ-FN-203: บันทึก token หลัง flow login สำเร็จ
export function storeAuthToken(token) {
  localStorage.setItem("token", token);
}

export const getPayment = (bookingId) => api(`/payments/${bookingId}`);
export const createPayment = (body) => api("/payments", { method: "POST", body });
export const seedBooking = (distanceKm) =>
  api("/dev/seed-booking", { method: "POST", body: { distance_km: distanceKm } });
