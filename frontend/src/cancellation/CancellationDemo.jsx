import { useEffect, useReducer, useRef, useState } from "react";
import { cancelBooking } from "../api.js";
import BookingDetail from "./BookingDetail.jsx";
import ConfirmationWarning from "./ConfirmationWarning.jsx";
import DemoTimeSelector from "./DemoTimeSelector.jsx";
import NotAllowed from "./NotAllowed.jsx";
import ResultPreview from "./ResultPreview.jsx";
import { cancellationDemoReducer, createInitialDemoState, minutesUntil } from "./demoState.js";
import "./cancellation.css";

// รองรับ REQ-FN-DRAFT-CAN-05 โดยควบคุม Demo ด้วย React state เท่านั้น
// booking (ไม่บังคับ): การจองจริงจาก ③ ใช้แสดงรายละเอียดและตั้งเวลาคงเหลือเริ่มต้น
export default function CancellationDemo({ booking = null }) {
  const actualMinutes = booking?.scheduled_at ? minutesUntil(booking.scheduled_at) : null;
  const [state, dispatch] = useReducer(
    cancellationDemoReducer,
    actualMinutes ?? undefined,
    createInitialDemoState
  );

  // โหมดจริง: มีการจองจริงและใช้ "เวลาจริง" → ยืนยันแล้วเรียก backend ยกเลิกจริง
  // เลือกเวลาจำลอง (44/45/119/120) → เป็นตัวอย่าง ไม่เรียก backend
  const live = Boolean(booking) && actualMinutes !== null && state.minutesRemaining === actualMinutes;
  const [liveResult, setLiveResult] = useState(null);
  const requested = useRef(false);

  useEffect(() => {
    if (state.screen !== "result" || !live) {
      requested.current = false;
      setLiveResult(null);
      return;
    }
    if (requested.current) return; // กันเรียกซ้ำ (React StrictMode เรียก effect สองรอบ)
    requested.current = true;
    setLiveResult({ phase: "loading" });
    cancelBooking(booking.id, state.minutesRemaining < 120)
      .then((data) => setLiveResult({ phase: "done", data }))
      .catch((e) => setLiveResult({ phase: "error", message: e.message }));
  }, [state.screen, live, booking?.id, state.minutesRemaining]);

  return (
    <section className="cancellation-demo">
      <p className="cancellation-demo-banner">
        {live
          ? "แสดงข้อมูลการจองจริง การกดยืนยันจะยกเลิกการจองจริงและคืน/ริบมัดจำตามเงื่อนไข"
          : booking
            ? "Demo — เลือกเวลาจำลองอยู่ แสดงข้อมูลการจองจริงแต่การยกเลิกเป็นตัวอย่าง ไม่เรียก Backend"
            : "Demo — ใช้ข้อมูลจำลอง ไม่มีการเรียก Backend หรือบันทึกข้อมูล"}
      </p>
      <DemoTimeSelector
        value={state.minutesRemaining}
        actualMinutes={actualMinutes}
        onChange={(minutesRemaining) => dispatch({ type: "select-time", minutesRemaining })}
      />

      {state.screen === "booking" && (
        <BookingDetail
          booking={booking}
          live={live}
          minutesRemaining={state.minutesRemaining}
          onRequestCancellation={() => dispatch({ type: "request-cancellation" })}
        />
      )}
      {state.screen === "confirmation" && (
        <ConfirmationWarning
          minutesRemaining={state.minutesRemaining}
          onConfirm={() => dispatch({ type: "confirm-demo" })}
          onBack={() => dispatch({ type: "back-to-booking" })}
        />
      )}
      {state.screen === "not-allowed" && (
        <NotAllowed
          minutesRemaining={state.minutesRemaining}
          onBack={() => dispatch({ type: "back-to-booking" })}
        />
      )}
      {state.screen === "result" && (
        <ResultPreview
          live={live}
          liveResult={liveResult}
          minutesRemaining={state.minutesRemaining}
          onBack={() => dispatch({ type: "back-to-booking" })}
        />
      )}
    </section>
  );
}
