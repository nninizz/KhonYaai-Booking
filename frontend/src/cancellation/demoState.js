// รองรับ REQ-FN-DRAFT-CAN-05 และ BR-CAN-DRAFT-09 ใน Demo โดยเปลี่ยนเฉพาะ React state
export function createInitialDemoState(minutesRemaining = 120) {
  return { minutesRemaining, screen: "booking", confirmed: false };
}

// นาทีคงเหลือก่อนนัดหมายจากการจองจริง (scheduled_at เป็นเวลา server ตาม D-03-08) ไม่ติดลบ
export function minutesUntil(scheduledAt, nowMs = Date.now()) {
  const diff = new Date(scheduledAt).getTime() - nowMs;
  return Number.isFinite(diff) ? Math.max(0, Math.floor(diff / 60000)) : 120;
}

// รองรับ REQ-FN-DRAFT-CAN-05 โดยเลือกหน้าตัวอย่างตามขอบเขตเวลาใน BR-CAN-DRAFT-09
export function cancellationDemoReducer(state, action) {
  switch (action.type) {
    case "select-time":
      return {
        ...state,
        minutesRemaining: action.minutesRemaining,
        screen: "booking",
        confirmed: false,
      };
    case "request-cancellation":
      if (state.minutesRemaining < 45) {
        return { ...state, screen: "not-allowed", confirmed: false };
      }
      if (state.minutesRemaining < 120) {
        return { ...state, screen: "confirmation", confirmed: false };
      }
      return { ...state, screen: "result", confirmed: false };
    case "confirm-demo":
      return state.screen === "confirmation"
        ? { ...state, screen: "result", confirmed: true }
        : state;
    case "back-to-booking":
      return { ...state, screen: "booking", confirmed: false };
    default:
      return state;
  }
}