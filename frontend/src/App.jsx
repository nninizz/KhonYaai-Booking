import { Suspense, lazy, useEffect, useState } from "react";
import { AuthFlow } from "./auth/AuthFields.jsx";
import RegisterPage from "./register/RegisterPage.jsx";
import BookingPage from "./booking/BookingPage.jsx";
import CancellationDemo from "./cancellation/CancellationDemo.jsx";
import PaymentPage from "./payment/PaymentPage.jsx";
import BookingOverviewPage from "./tracking/pages/BookingOverviewPage.jsx";
import DriverTrackingPage from "./tracking/pages/DriverTrackingPage.jsx";
import * as trackingApi from "./tracking/api/trackingMock.js";
import { simulatedDriverPosition, simulatedStage } from "./tracking/api/simulatedDriver.js";
import { fetchRoute } from "./tracking/api/route.js";

// flow: Register → Login/OTP → จอง ③ → ชำระมัดจำ ④ → รายละเอียดการจอง + ยกเลิก ⑥ ↔ ภาพรวมการจอง ⑤ → แผนที่ติดตาม ⑤
// รองรับ REQ-FN-201, REQ-FN-203, REQ-FN-205, REQ-FN-304, REQ-IF-301, REQ-FN-DRAFT-CAN-05
// ส่วนติดตามสถานะ (⑤) ใช้ข้อมูลจำลองตามที่เจ้าของ ⑤ ทำไว้ (ขั้นสถานะ ทีมงาน ตำแหน่งคนขับ) แต่อ่านการจองจริงจาก ③
// ระยะรอหาคนขับจำลอง 30 วินาที; VITE_DEMO_FIND_DRIVER_MS ใช้เฉพาะตอนเดโม
const FIND_DRIVER_MS = Number(import.meta.env.VITE_DEMO_FIND_DRIVER_MS) || 30000;

// โหลดหน้าแผนที่เมื่อใช้งานเท่านั้น: Leaflet ต้องใช้ window จึงห้ามโหลดตอน import App (เช่น test ที่ render ฝั่ง server)
const CustomerTrackingPage = lazy(() => import("./tracking/pages/CustomerTrackingPage.jsx"));

export default function App({ onAuthenticated } = {}) {
  const [token, setToken] = useState(null);
  const [booking, setBooking] = useState(null);   // response 201 ของ ③
  const [view, setView] = useState("booking");    // booking | payment | details | overview | track | driver
  const [route, setRoute] = useState(null);       // เส้นทางตามถนนจากจุดรับไปจุดส่ง (ใช้ทั้งคนขับจำลองและเส้นบนแผนที่)
  const [demoScheduledAt, setDemoScheduledAt] = useState(null); // Demo: เลื่อนเวลานัดมาเป็นตอนนี้ (ไม่แก้การจองจริง)
  const isRegisterRoute = window.location.pathname === "/register";

  // job_id ของ ⑤ = หมายเลขการจอง (เป็นข้อความ ให้ตรงกับที่ ⑥ ส่งไป endJob)
  const jobId = booking ? String(booking.id) : null;
  const scheduledAt = demoScheduledAt ?? booking?.scheduled_at ?? null;
  const pickup = booking ? { lat: booking.pickup_lat, lng: booking.pickup_lng, address: booking.pickup_address } : null;
  const dropoff = booking ? { lat: booking.dropoff_lat, lng: booking.dropoff_lng, address: booking.dropoff_address } : null;

  // ดึงเส้นทางเมื่อมีการจอง ถ้าดึงไม่ได้ใช้เส้นตรงแทน
  useEffect(() => {
    if (!booking) return undefined;
    const from = { lat: booking.pickup_lat, lng: booking.pickup_lng };
    const to = { lat: booking.dropoff_lat, lng: booking.dropoff_lng };
    let active = true;
    fetchRoute(from, to)
      .then((line) => { if (active) setRoute(line); })
      .catch(() => { if (active) setRoute([[from.lat, from.lng], [to.lat, to.lng]]); });
    return () => { active = false; };
  }, [booking]);

  const header = (
    <header className="top">
      <h1>Khonย้าย</h1>
    </header>
  );
  const reset = () => { setBooking(null); setRoute(null); setDemoScheduledAt(null); setView("booking"); };

  // ขนของถึงปลายทางแล้ว → งานสิ้นสุด (AS-13) หน้าภาพรวมแสดงขั้น "สิ้นสุดงาน"
  function endJobIfDelivered() {
    if (scheduledAt && simulatedStage({ scheduledAt }) === "delivered") trackingApi.endJob(jobId);
  }

  // เปิดหน้าภาพรวม: ให้เห็นขั้น "กำลังจัดหารถและทีมช่าง" ก่อน แล้วจำลองว่าหาคนขับได้หลัง 30 วินาที (D-05-38)
  async function openOverview() {
    endJobIfDelivered();
    setView("overview");
    const { stage } = await trackingApi.getStage(jobId);
    if (stage === "searching") {
      setTimeout(() => trackingApi.setStage(jobId, "driver_found"), FIND_DRIVER_MS);
    }
  }

  // Demo สถานะการจอง (ใช้ทดลองเท่านั้น ไม่กระทบการจองจริงใน backend)
  const demoDriverAccepted = () => trackingApi.setStage(jobId, "driver_found");
  const demoAppointmentReached = () => {
    trackingApi.setStage(jobId, "driver_found");
    setDemoScheduledAt(new Date().toISOString());
  };
  const demoPanel = (
    <>
      <h3>Demo (ใช้ทดลองเท่านั้น)</h3>
      <p className="hint">ยังไม่มีระบบจัดหาคนขับจริง (Q-08) จึงจำลองด้วยปุ่มด้านล่าง ไม่กระทบการจองจริง</p>
      <div style={{ display: "grid", gap: 8 }}>
        <button type="button" className="demo-btn" onClick={demoDriverAccepted}>จำลอง: ทีมงานรับงานแล้ว</button>
        <button type="button" className="demo-btn" onClick={demoAppointmentReached}>จำลอง: ถึงเวลานัดและคนขับส่งตำแหน่ง</button>
        <button type="button" className="demo-btn" onClick={() => setView("driver")}>ดูมุมมองคนขับ (Demo)</button>
      </div>
    </>
  );

  // หน้าภาพรวมอ่านวันเวลานัดและที่อยู่จากการจองจริง ส่วนที่เหลือยังใช้ข้อมูลจำลอง
  const overviewApi = {
    ...trackingApi,
    getBooking: async (id) => ({
      ...(await trackingApi.getBooking(id)),
      paid: true,
      scheduled_at: scheduledAt,
      pickup: booking?.pickup_address,
      destination: booking?.dropoff_address,
    }),
  };

  // หน้าแผนที่: ตำแหน่งคนขับเป็นข้อมูลจำลองที่เคลื่อนจากจุดรับไปจุดส่งหลังถึงเวลานัด
  const trackingMapApi = {
    ...trackingApi,
    getLatest: async () => simulatedDriverPosition({ pickup, dropoff, scheduledAt, route }),
    getStage: async () => ({ stage: simulatedStage({ scheduledAt }) }),
    // ข้อมูลทีมงานแสดงตั้งแต่ขั้นหาคนขับได้แล้ว (D-05-34)
    getTeamInfo: async (id) => {
      trackingApi.setStage(id, "driver_found");
      return trackingApi.getTeamInfo(id);
    },
  };

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

  // ชำระมัดจำ (④) → เมื่อ CONFIRMED มีปุ่มไปติดตามสถานะ (⑤) หรือรายละเอียด/ยกเลิก (⑥)
  if (view === "payment" && booking) {
    return (
      <main className="wrap" data-testid="app-root">
        <PaymentPage bookingId={booking.id} onTrack={openOverview} onDetails={() => setView("details")} />
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
        <button type="button" className="btn" onClick={openOverview}>
          ไปหน้าติดตามสถานะ
        </button>
        <button type="button" className="link" onClick={reset}>
          จองรถขนย้ายใหม่
        </button>
      </main>
    );
  }

  // ภาพรวมการจอง (⑤)
  if (view === "overview" && booking) {
    return (
      <main className="wrap" data-testid="app-root">
        {header}
        <button type="button" className="btn" onClick={() => setView("details")}>
          ← กลับไปรายละเอียดการจอง
        </button>
        <section className="card">
          <div className="bar">ติดตามสถานะ · การจองหมายเลข {booking.id}</div>
          <BookingOverviewPage jobId={jobId} api={overviewApi} onTrack={() => setView("track")} />
          {demoPanel}
        </section>
      </main>
    );
  }

  // มุมมองคนขับ (Demo): ส่งตำแหน่งจากเครื่องนี้ทุก 15 วินาที
  if (view === "driver" && booking) {
    return (
      <main className="wrap" data-testid="app-root">
        {header}
        <section className="card">
          <div className="bar">มุมมองคนขับ (Demo) · การจองหมายเลข {booking.id}</div>
          <p className="hint">ส่งตำแหน่งจากเครื่องนี้ทุก 15 วินาที</p>
          <DriverTrackingPage jobId={jobId} />
        </section>
        <button type="button" className="btn" onClick={() => setView("overview")}>
          ← กลับไปภาพรวมการจอง
        </button>
      </main>
    );
  }

  // แผนที่ติดตาม (⑤)
  if (view === "track" && booking) {
    return (
      <main className="wrap" data-testid="app-root">
        {header}
        <section className="card">
          <div className="bar">ติดตามสถานะ · การจองหมายเลข {booking.id}</div>
          <Suspense fallback={<p className="hint">กำลังโหลดแผนที่…</p>}>
            <CustomerTrackingPage
              jobId={jobId}
              api={trackingMapApi}
              scheduledAt={scheduledAt}
              pickup={pickup}
              dropoff={dropoff}
              route={route}
            />
          </Suspense>
        </section>
        <button type="button" className="btn" onClick={() => { endJobIfDelivered(); setView("overview"); }}>
          ← กลับไปภาพรวมการจอง
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