import { useState } from "react";
import { AuthFlow } from "./auth/AuthFields.jsx";
import RegisterPage from "./register/RegisterPage.jsx";
import BookingPage from "./booking/BookingPage.jsx";
import CancellationDemo from "./cancellation/CancellationDemo.jsx";
import PaymentPage from "./payment/PaymentPage.jsx";

// รองรับ REQ-FN-201, REQ-FN-203, REQ-FN-205: เปิด Auth เป็นหน้าเริ่มต้นและส่ง token ให้ผู้เรียก
// รองรับ REQ-FN-304, REQ-IF-301 (T-12): หลัง Auth สำเร็จเข้าหน้าจอง แล้วส่ง bookingId ต่อให้หน้าชำระมัดจำ
// รองรับ REQ-FN-DRAFT-CAN-05 โดยเปิด Cancellation Demo แยกจาก flow หลัก
export default function App({ onAuthenticated } = {}) {
  const [token, setToken] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [showCancellation, setShowCancellation] = useState(false);
  const isRegisterRoute = window.location.pathname === "/register";

  if (isRegisterRoute) {
    return (
      <main className="wrap" data-testid="app-root">
        <header className="top">
          <h1>Khonย้าย</h1>
        </header>
        <RegisterPage />
      </main>
    );
  }

  if (!token) {
    return (
      <main className="wrap" data-testid="app-root">
        <header className="top">
          <h1>Khonย้าย</h1>
        </header>
        <AuthFlow
          onAuthenticated={(authenticatedToken) => {
            setToken(authenticatedToken);
            onAuthenticated?.(authenticatedToken);
          }}
        />
      </main>
    );
  }

  if (showCancellation) {
    return (
      <main className="wrap" data-testid="app-root">
        <header className="top">
          <h1>Khonย้าย</h1>
          <span className="tag">Cancellation Demo</span>
        </header>
        <CancellationDemo />
        <button
          type="button"
          className="link"
          onClick={() => setShowCancellation(false)}
        >
          กลับไปยัง flow หลัก
        </button>
      </main>
    );
  }

  if (bookingId) {
    return (
      <main className="wrap" data-testid="app-root">
        <PaymentPage bookingId={bookingId} />
        <button type="button" className="link" onClick={() => setBookingId(null)}>
          กลับไปหน้าจองรถขนย้าย
        </button>
        <button
          type="button"
          className="link"
          onClick={() => setShowCancellation(true)}
        >
          เปิด Cancellation Demo
        </button>
      </main>
    );
  }

  return (
    <div data-testid="app-root">
      <BookingPage onBooked={(id) => setBookingId(id)} />
      <button
        type="button"
        className="link"
        onClick={() => setShowCancellation(true)}
      >
        เปิด Cancellation Demo
      </button>
    </div>
  );
}
