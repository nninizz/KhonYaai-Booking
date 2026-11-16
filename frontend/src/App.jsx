// หน้า demo ของ ④ — สร้าง booking mock (แทน ③) แล้วเปิดหน้าจ่ายมัดจำ
import { useState } from "react";
import { seedBooking } from "./api.js";
import PaymentPage from "./payment/PaymentPage.jsx";

export default function App() {
  const [bookingId, setBookingId] = useState(null);
  const [distance, setDistance] = useState(30);
  const [error, setError] = useState("");

  async function create() {
    setError("");
    try {
      const b = await seedBooking(Number(distance));
      setBookingId(b.id);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="wrap">
      <header className="top">
        <h1>Khonย้าย</h1>
        <span className="tag">④ ชำระค่าบริการ</span>
      </header>

      {bookingId ? (
        <>
          <PaymentPage bookingId={bookingId} />
          <button className="link" onClick={() => setBookingId(null)}>
            ← สร้างการจองใหม่ (demo)
          </button>
        </>
      ) : (
        <section className="card">
          <h2>จำลองการจอง (แทน feature ③)</h2>
          <p className="muted">สร้าง booking สถานะ PENDING_DEPOSIT เพื่อทดสอบหน้าจ่ายมัดจำ</p>
          <label className="field">
            ระยะทาง (กม.)
            <input type="number" min="0.1" step="0.1" value={distance}
              onChange={(e) => setDistance(e.target.value)} />
          </label>
          <button className="primary" onClick={create}>สร้างการจองและไปหน้าชำระเงิน</button>
          {error && <p className="msg error">{error}</p>}
        </section>
      )}
    </main>
  );
}
