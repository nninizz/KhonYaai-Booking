import { useEffect, useState } from "react";
import { AuthFlow } from "./auth/AuthFields.jsx";
import RegisterPage from "./register/RegisterPage.jsx";
import BookingPage from "./booking/BookingPage.jsx";
import CancellationDemo from "./cancellation/CancellationDemo.jsx";
import PaymentPage from "./payment/PaymentPage.jsx";
import BookingOverviewPage from "./tracking/pages/BookingOverviewPage.jsx";
import CustomerTrackingPage from "./tracking/pages/CustomerTrackingPage.jsx";
import * as trackingApi from "./tracking/api/trackingMock.js";
import { simulatedDriverPosition, simulatedStage } from "./tracking/api/simulatedDriver.js";
import { fetchRoute } from "./tracking/api/route.js";

// รองรับ REQ-FN-201, REQ-FN-203, REQ-FN-205: เปิด Auth เป็นหน้าเริ่มต้นและส่ง token ให้ผู้เรียก
// รองรับ REQ-FN-304, REQ-IF-301 (T-12): หลัง Auth สำเร็จเข้าหน้าจอง แล้วส่ง bookingId ต่อให้หน้าชำระมัดจำ
// เพิ่ม route หน้าติดตามสถานะ (005-tracking): ภาพรวม → แผนที่ ด้วย view ภายในหน้าเดียวกัน
// ระยะรอหาคนขับจำลอง 30 วินาที; VITE_DEMO_FIND_DRIVER_MS ใช้เฉพาะตอนเดโม
const FIND_DRIVER_MS = Number(import.meta.env.VITE_DEMO_FIND_DRIVER_MS) || 30000;
// วันเวลานัดขนย้ายมาจากการจอง (scheduled_at) และใช้ทั้งหน้าภาพรวมและหน้าแผนที่ (Q-05 ตัดสินแล้ว: ปุ่มไปหน้าติดตามกดได้)
export default function App({ onAuthenticated } = {}) {
  const [token, setToken] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [showCancellation, setShowCancellation] = useState(false);
  const [booking, setBooking] = useState(null); // ข้อมูลการจองที่สร้างจริง (ใช้วันเวลาและพิกัดรับ-ส่ง)
  const [view, setView] = useState(null); // null | "overview" | "track"
  const [route, setRoute] = useState(null); // เส้นทางตามถนนจากจุดรับไปจุดส่ง (ใช้ทั้งคนขับจำลองและเส้นบนแผนที่)

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

  // ยังไม่ผ่าน Auth → แสดง Login/OTP
  if (!token) {
    return (
      <main className="wrap" data-testid="app-root">
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

  // จองสำเร็จ → หน้าชำระมัดจำของ ④
  // เปิดหน้าภาพรวม: ให้เห็นขั้น "กำลังจัดหารถและทีมช่าง" ก่อน แล้วจำลองว่าหาคนขับได้หลัง 30 วินาที
  // (ค่า 30 วินาทีตามคำอธิบาย mockup การเลื่อนสถานะ mock) ตาม D-05-38 ขั้นจะไปเป็น "รอกำหนดการตามนัด" ทันที
  // เป็นข้อมูลจำลองจนกว่าจะมีการรับงานจริง
  // ขนของถึงปลายทางแล้ว → งานสิ้นสุด (AS-13) หน้าภาพรวมแสดงขั้น "สิ้นสุดงาน"
  function endJobIfDelivered() {
    if (scheduledAt && simulatedStage({ scheduledAt }) === "delivered") trackingApi.endJob(bookingId);
  }

  async function openOverview() {
    endJobIfDelivered();
    setView("overview");
    const { stage } = await trackingApi.getStage(bookingId);
    if (stage === "searching") {
      setTimeout(() => trackingApi.setStage(bookingId, "driver_found"), FIND_DRIVER_MS);
    }
  }

  const scheduledAt = booking?.scheduled_at ?? null;
  const pickup = booking ? { lat: booking.pickup_lat, lng: booking.pickup_lng, address: booking.pickup_address } : null;
  const dropoff = booking ? { lat: booking.dropoff_lat, lng: booking.dropoff_lng, address: booking.dropoff_address } : null;

  // หน้าภาพรวมอ่านวันเวลานัดจากการจองจริง ส่วนที่เหลือยังใช้ข้อมูลจำลอง
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
    // ข้อมูลทีมงานแสดงตั้งแต่ขั้นหาคนขับได้แล้ว (D-05-34) ตั้งขั้นในข้อมูลจำลองให้ตรงกับหน้าแผนที่
    // เพราะหน้าภาพรวมตั้งขั้นนี้ด้วย timer ซึ่งอาจยังไม่ทำงานเมื่อเปิดหน้าแผนที่โดยตรง
    getTeamInfo: async (id) => {
      trackingApi.setStage(id, "driver_found");
      return trackingApi.getTeamInfo(id);
    },
  };

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
    if (view === "track") {
      return (
        <main className="wrap" data-testid="app-root">
          <CustomerTrackingPage
            jobId={bookingId}
            api={trackingMapApi}
            scheduledAt={scheduledAt}
            pickup={pickup}
            dropoff={dropoff}
            route={route}
          />
          <button type="button" className="link" onClick={() => { endJobIfDelivered(); setView("overview"); }}>
            กลับไปหน้าภาพรวมการจอง
          </button>
        </main>
      );
    }
    if (view === "overview") {
      return (
        <main className="wrap" data-testid="app-root">
          <BookingOverviewPage jobId={bookingId} api={overviewApi} onTrack={() => setView("track")} />
          <button type="button" className="link" onClick={() => setView(null)}>
            กลับไปหน้าชำระมัดจำ
          </button>
        </main>
      );
    }
    return (
      <main className="wrap" data-testid="app-root">
        <PaymentPage bookingId={bookingId} onTrackStatus={openOverview} />
        <button type="button" className="link" onClick={() => { setView(null); setBookingId(null); }}>
          กลับไปหน้าจองรถขนย้าย
        </button>
        <button type="button" className="link" onClick={() => setShowCancellation(true)}>
          เปิด Cancellation Demo
        </button>
      </main>
    );
  }

  return (
    <div data-testid="app-root">
      <BookingPage
        onBooked={(id, created) => {
          setBookingId(id);
          setBooking(created);
        }}
      />
      <button type="button" className="link" onClick={() => setShowCancellation(true)}>
        เปิด Cancellation Demo
      </button>
    </div>
  );
}