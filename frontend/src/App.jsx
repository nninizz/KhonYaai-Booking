// หน้า demo ของ ④ — สร้าง booking mock (แทน ③) แล้วเปิดหน้าจ่ายมัดจำ
import { useState } from "react";
import { seedBooking } from "./api.js";
import CancellationDemo from "./cancellation/CancellationDemo.jsx";
import PaymentPage from "./payment/PaymentPage.jsx";

// รองรับ REQ-FN-DRAFT-CAN-05 โดยเปิด Demo แยกจาก Payment Demo เดิม
export default function App() {
  const [bookingId, setBookingId] = useState(null);
  const [distance, setDistance] = useState(30);
  const [error, setError] = useState("");
  const [activeDemo, setActiveDemo] = useState("payment");

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
        <span className="tag">{activeDemo === "payment" ? "④ ชำระค่าบริการ" : "Cancellation Demo"}</span>
      </header>

      <nav className="demo-nav" aria-label="เลือก Demo">
        <button
          type="button"
          className={activeDemo === "payment" ? "demo-nav-active" : ""}
          aria-pressed={activeDemo === "payment"}
          onClick={() => setActiveDemo("payment")}
        >
          Payment Demo
        </button>
        <button
          type="button"
          className={activeDemo === "cancellation" ? "demo-nav-active" : ""}
          aria-pressed={activeDemo === "cancellation"}
          onClick={() => setActiveDemo("cancellation")}
        >
          Cancellation Demo
        </button>
      </nav>

      {activeDemo === "cancellation" ? (
        <CancellationDemo />
      ) : bookingId ? (
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
