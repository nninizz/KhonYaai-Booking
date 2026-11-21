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

// รองรับ REQ-FN-201, REQ-FN-205: แลกหลักฐานสมัครเป็น challenge และเก็บ handoff ชั่วคราวให้หน้า Auth
export async function startRegistrationOtp(registrationProof) {
  const result = await api("/auth/otp-challenges", {
    method: "POST",
    body: { registration_proof: registrationProof },
    auth: false,
  });
  if (!result.otp_challenge_id) {
    throw new Error("รูปแบบผลตอบกลับจากระบบไม่ถูกต้อง");
  }
  window.sessionStorage.setItem("authOtpChallengeId", result.otp_challenge_id);
  return result;
}

// รองรับ REQ-FN-201: อ่าน challenge ID ที่ส่งต่อจาก registration handoff
export function readOtpChallengeHandoff() {
  if (typeof window === "undefined") {
    return "";
  }
  return window.sessionStorage.getItem("authOtpChallengeId") || "";
}

// รองรับ REQ-FN-201: ล้าง handoff หลัง Auth รับค่าไปแล้ว
export function clearOtpChallengeHandoff() {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem("authOtpChallengeId");
  }
}

// รองรับ REQ-FN-205: ขอ OTP ชุดใหม่โดยไม่เริ่มจาก Login และไม่แนบ token
export const resendOtp = (otpChallengeId) =>
  api(`/auth/otp-challenges/${encodeURIComponent(otpChallengeId)}/resend`, {
    method: "POST",
    auth: false,
  });

// รองรับ REQ-FN-203, REQ-FN-205: verify OTP ไม่ต้องใช้ token ก่อนยืนยัน
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

// รองรับ REQ-FN-305, REQ-FN-302, REQ-FN-304 (T-12)
export const getPlaces = () => api("/places");
export const getBookingQuote = (body) =>
  api("/bookings/quote", { method: "POST", body });
export const createBooking = (body) =>
  api("/bookings", { method: "POST", body });

export function buildBookingRequest(scheduledAt, pickup, dropoff, itemSize) {
  if (!pickup || !dropoff) {
    throw new Error("กรอกข้อมูลจองให้ครบ");
  }
  return {
    pickup_address: pickup.address,
    pickup_lat: pickup.lat,
    pickup_lng: pickup.lng,
    dropoff_address: dropoff.address,
    dropoff_lat: dropoff.lat,
    dropoff_lng: dropoff.lng,
    scheduled_at: scheduledAt,
    item_size: itemSize,
  };
}

// รองรับ REQ-FN-305, D-03-15 (API จำลองสำหรับ T-09)
export const MOCK_PLACES = [
  { id: 1, name: "สยามพารากอน", address: "สยามพารากอน กรุงเทพฯ", lat: 13.7462, lng: 100.5347 },
  { id: 2, name: "เซ็นทรัลเวิลด์", address: "เซ็นทรัลเวิลด์ กรุงเทพฯ", lat: 13.7466, lng: 100.5393 },
  { id: 3, name: "อนุสาวรีย์ชัยสมรภูมิ", address: "อนุสาวรีย์ชัยสมรภูมิ กรุงเทพฯ", lat: 13.7649, lng: 100.5383 },
  { id: 4, name: "ตลาดนัดจตุจักร", address: "ตลาดนัดจตุจักร กรุงเทพฯ", lat: 13.7999, lng: 100.5502 },
  { id: 5, name: "สนามบินดอนเมือง", address: "สนามบินดอนเมือง กรุงเทพฯ", lat: 13.9126, lng: 100.6068 },
  { id: 6, name: "ม.ศิลปากร วิทยาเขตสนามจันทร์", address: "มหาวิทยาลัยศิลปากร สนามจันทร์ นครปฐม", lat: 13.8196, lng: 100.0405 },
];

export function getMockPlaces() {
  return MOCK_PLACES.map((place) => ({ ...place }));
}

export function findMockPlace(places, id) {
  return places.find((place) => String(place.id) === String(id)) || null;
}

export function readCurrentLocation(geolocation, timeout = 10000) {
  if (!geolocation) {
    return Promise.reject(new Error("geolocation-unavailable"));
  }
  return new Promise((resolve, reject) => {
    geolocation.getCurrentPosition(
      ({ coords }) => {
        if (!Number.isFinite(coords.latitude) || !Number.isFinite(coords.longitude)) {
          reject(new Error("invalid-coordinates"));
          return;
        }
        resolve({
          name: "ตำแหน่งปัจจุบัน",
          address: "ตำแหน่งปัจจุบัน",
          lat: coords.latitude,
          lng: coords.longitude,
        });
      },
      () => reject(new Error("location-failed")),
      { timeout },
    );
  });
}

export function createMockQuote(pickup, dropoff) {
  // รองรับ REQ-FN-302, REQ-DAT-301 (mock API สำหรับ T-10)
  if (!pickup || !dropoff) {
    const error = new Error("กรอกข้อมูลจองให้ครบ");
    error.status = 422;
    throw error;
  }
  const radians = (value) => value * Math.PI / 180;
  const dlat = radians(dropoff.lat - pickup.lat);
  const dlng = radians(dropoff.lng - pickup.lng);
  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(radians(pickup.lat)) *
      Math.cos(radians(dropoff.lat)) *
      Math.sin(dlng / 2) ** 2;
  const distanceKm = Math.round(6371 * 2 * Math.asin(Math.sqrt(a)) * 10) / 10;

  if (distanceKm === 0) {
    const error = new Error("จุดรับและจุดส่งต้องอยู่คนละที่");
    error.status = 422;
    throw error;
  }
  const totalPrice = Math.round(distanceKm * 10);
  const depositAmount = Math.floor((totalPrice * 30 + 50) / 100);
  if (depositAmount === 0) {
    const error = new Error("ระยะใกล้เกินไป");
    error.status = 422;
    throw error;
  }
  return {
    distance_km: distanceKm,
    total_price: totalPrice,
    deposit_amount: depositAmount,
    remaining_amount: totalPrice - depositAmount,
  };
}

export function createQuoteSignature(scheduledAt, pickup, dropoff, itemSize) {
  return JSON.stringify({
    scheduledAt: scheduledAt || "",
    pickup: pickup ? [pickup.address, pickup.lat, pickup.lng] : null,
    dropoff: dropoff ? [dropoff.address, dropoff.lat, dropoff.lng] : null,
    itemSize,
  });
}

export function isQuoteFresh(currentSignature, quoteSignature) {
  return Boolean(currentSignature && quoteSignature && currentSignature === quoteSignature);
}

export function validateMockBookingState(scheduledAt, pickup, dropoff, itemSize) {
  // รองรับ REQ-FN-301, REQ-FN-303, AC-03-05, AC-03-14
  if (!scheduledAt) return "กรอกข้อมูลไม่ครบ";
  if (!pickup) return "กรอกข้อมูลไม่ครบ";
  if (!dropoff) return "กรอกข้อมูลไม่ครบ";
  if (!itemSize) return "กรอกข้อมูลไม่ครบ";

  const scheduled = new Date(scheduledAt);
  if (Number.isNaN(scheduled.getTime()) || scheduled.getTime() - Date.now() < 4 * 60 * 60 * 1000) {
    return "จองล่วงหน้าไม่ถึง 4 ชั่วโมง";
  }
  return "";
}

export function createMockBookingSuccess(quote) {
  // รองรับ REQ-FN-304, REQ-IF-301
  return {
    id: 101,
    status: "PENDING_DEPOSIT",
    ...quote,
  };
}

export function retryPaymentBookingId(currentBookingId, paymentLoadFailed) {
  // รองรับ AC-03-06: retry ใช้ booking id เดิม ไม่สร้าง booking ใหม่
  if (!currentBookingId) return null;
  return paymentLoadFailed ? currentBookingId : currentBookingId;
}
