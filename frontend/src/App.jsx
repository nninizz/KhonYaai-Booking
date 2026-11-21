import { useState } from "react";
import { AuthFlow } from "./auth/AuthFields.jsx";
import RegisterPage from "./register/RegisterPage.jsx";
import BookingPage from "./booking/BookingPage.jsx";
import PaymentPage from "./payment/PaymentPage.jsx";
import CancellationDemo from "./cancellation/CancellationDemo.jsx";

// flow: Register → Login/OTP → จอง ③ → ชำระมัดจำ ④ → รายละเอียดการจอง + ยกเลิก ⑥ (ยกเลิกเป็น Demo)
// รองรับ REQ-FN-201, REQ-FN-203, REQ-FN-205, REQ-FN-304, REQ-IF-301, REQ-FN-DRAFT-CAN-05
export default function App({ onAuthenticated } = {}) {
  const [token, setToken] = useState(null);
  const [booking, setBooking] = useState(null);   // response 201 ของ ③
  const [view, setView] = useState("booking");    // booking | payment | details
  const isRegisterRoute = window.location.pathname === "/register";

  const header = (
    <header className="top">
      <h1>Khonย้าย</h1>
    </header>
  );
  const reset = () => { setBooking(null); setView("booking"); };

  if (isRegisterRoute) {
    return (
      <main className="wrap" data-testid="app-root">
        {header}
        <RegisterPage />
      </main>
    );
  }

  // ยังไม่ผ่าน Auth → Login/OTP
  if (!token) {
    return (
      <main className="wrap" data-testid="app-root">
        {header}
        <AuthFlow
          onAuthenticated={(t) => {
            setToken(t);
            onAuthenticated?.(t);
          }}
        />
      </main>
    );
  }

  // ชำระมัดจำ (④) → เมื่อ CONFIRMED ไปหน้ารายละเอียดการจองอัตโนมัติ
  if (view === "payment" && booking) {
    return (
      <main className="wrap" data-testid="app-root">
        <PaymentPage bookingId={booking.id} onConfirmed={() => setView("details")} />
        <button type="button" className="link" onClick={reset}>
          กลับไปหน้าจองรถขนย้าย
        </button>
      </main>
    );
  }

  // รายละเอียดการจอง + ทางยกเลิก (⑥)
  if (view === "details" && booking) {
    return (
      <main className="wrap" data-testid="app-root">
        {header}
        <CancellationDemo booking={booking} />
        <button type="button" className="link" onClick={reset}>
          จองรถขนย้ายใหม่
        </button>
      </main>
    );
  }

  return (
    <div data-testid="app-root">
      <BookingPage
        onBooked={(id, created) => {
          setBooking(created ?? { id });
          setView("payment");
        }}
      />
    </div>
  );
}