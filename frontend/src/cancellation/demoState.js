// รองรับ REQ-FN-DRAFT-CAN-05 และ BR-CAN-DRAFT-09 ใน Demo โดยเปลี่ยนเฉพาะ React state
export function createInitialDemoState() {
  return { minutesRemaining: 120, screen: "booking", confirmed: false };
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
