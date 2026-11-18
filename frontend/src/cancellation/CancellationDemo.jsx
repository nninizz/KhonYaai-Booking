import { useReducer } from "react";
import BookingDetail from "./BookingDetail.jsx";
import ConfirmationWarning from "./ConfirmationWarning.jsx";
import DemoTimeSelector from "./DemoTimeSelector.jsx";
import NotAllowed from "./NotAllowed.jsx";
import ResultPreview from "./ResultPreview.jsx";
import { cancellationDemoReducer, createInitialDemoState } from "./demoState.js";
import "./cancellation.css";

// รองรับ REQ-FN-DRAFT-CAN-05 โดยควบคุม Demo ด้วย React state เท่านั้น
export default function CancellationDemo() {
  const [state, dispatch] = useReducer(
    cancellationDemoReducer,
    undefined,
    createInitialDemoState
  );

  return (
    <section className="cancellation-demo">
      <p className="cancellation-demo-banner">Demo — ใช้ข้อมูลจำลอง ไม่มีการเรียก Backend หรือบันทึกข้อมูล</p>
      <DemoTimeSelector
        value={state.minutesRemaining}
        onChange={(minutesRemaining) => dispatch({ type: "select-time", minutesRemaining })}
      />

      {state.screen === "booking" && (
        <BookingDetail
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
          minutesRemaining={state.minutesRemaining}
          onBack={() => dispatch({ type: "back-to-booking" })}
        />
      )}
    </section>
  );
}
