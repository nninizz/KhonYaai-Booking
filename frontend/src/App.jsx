import { useState } from "react";
import { AuthFlow } from "./auth/AuthFields.jsx";
import RegisterPage from "./register/RegisterPage.jsx";
import BookingPage from "./booking/BookingPage.jsx";
import PaymentPage from "./payment/PaymentPage.jsx";
import CancellationDemo from "./cancellation/CancellationDemo.jsx";

// รองรับ REQ-FN-201, REQ-FN-203, REQ-FN-205: เปิด Auth เป็นหน้าเริ่มต้นและส่ง token ให้ผู้เรียก
// รองรับ REQ-FN-304, REQ-IF-301 (T-12): หลัง Auth สำเร็จเข้าหน้าจอง แล้วส่ง bookingId ต่อให้หน้าชำระมัดจำ
// รองรับ REQ-FN-DRAFT-CAN-05: เปิด Cancellation Demo (ข้อมูลจำลอง) จากหน้าจอง โดยไม่กระทบ flow จอง → ชำระมัดจำ
export default function App({ onAuthenticated } = {}) {
  const [token, setToken] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [view, setView] = useState("booking"); // "booking" | "cancellation-demo"
  const isRegisterRoute = window.location.pathname === "/register";

  if (isRegisterRoute) {
    return (
      <main className="wrap">
        <header className="top">
          <h1>Khonย้าย</h1>
        </header>
        <RegisterPage />
      </main>
    );
  }

  // ยังไม่ผ่าน Auth → แสดง Login/OTP
  if (!token) {
    return (
      <main className="wrap">
        <header className="top">
          <h1>Khonย้าย</h1>
        </header>
        <AuthFlow
          onAuthenticated={(t) => {
            setToken(t);
            onAuthenticated?.(t);
          }}
        />
      </main>
    );
  }

  // Cancellation Demo (⑥) — ใช้ข้อมูลจำลอง ไม่เรียก backend
  if (view === "cancellation-demo") {
    return (
      <main className="wrap">
        <header className="top">
          <h1>Khonย้าย</h1>
          <span className="tag">Cancellation Demo</span>
        </header>
        <CancellationDemo />
        <button type="button" className="link" onClick={() => setView("booking")}>
          กลับไปหน้าจองรถขนย้าย
        </button>
      </main>
    );
  }

  // จองสำเร็จ → หน้าชำระมัดจำของ ④
  if (bookingId) {
    return (
      <main className="wrap">
        <PaymentPage bookingId={bookingId} />
        <button type="button" className="link" onClick={() => setBookingId(null)}>
          กลับไปหน้าจองรถขนย้าย
        </button>
      </main>
    );
  }

  return (
    <>
      <BookingPage onBooked={(id) => setBookingId(id)} />
      <button type="button" className="link" onClick={() => setView("cancellation-demo")}>
        ดูหน้าจอยกเลิกการจอง (Demo)
      </button>
    </>
  );
}