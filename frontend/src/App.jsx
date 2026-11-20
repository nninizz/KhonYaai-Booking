import { useState } from "react";
import BookingPage from "./booking/BookingPage.jsx";
import PaymentPage from "./payment/PaymentPage.jsx";

export default function App() {
  // รองรับ REQ-FN-304, REQ-IF-301 (T-12)
  const [bookingId, setBookingId] = useState(null);

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
  return <BookingPage onBooked={(id) => setBookingId(id)} />;
}
