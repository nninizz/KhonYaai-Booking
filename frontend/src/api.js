// แนบ token ทุก request — ระหว่างรอ ② ใช้ mock-token-1
const DEFAULT_TOKEN = "mock-token-1";

function getToken() {
  try {
    return localStorage.getItem("token") || DEFAULT_TOKEN;
  } catch {
    return DEFAULT_TOKEN;
  }
}

export async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
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

export const getPayment = (bookingId) => api(`/payments/${bookingId}`);
export const createPayment = (body) => api("/payments", { method: "POST", body });
export const seedBooking = (distanceKm) =>
  api("/dev/seed-booking", { method: "POST", body: { distance_km: distanceKm } });
