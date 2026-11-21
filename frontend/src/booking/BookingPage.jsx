import { useEffect, useState } from "react";
import {
  buildBookingRequest,
  createBooking,
  createQuoteSignature,
  findMockPlace,
  getBookingQuote,
  getPlaces,
  getPayment,
  isQuoteFresh,
  readCurrentLocation,
} from "../api.js";
import "./booking.css";

export default function BookingPage({ onBooked }) {
  // รองรับ REQ-FN-301, REQ-FN-305, REQ-FN-306
  const [places, setPlaces] = useState([]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [itemSize, setItemSize] = useState("MEDIUM");
  const [locationError, setLocationError] = useState("");
  const [quote, setQuote] = useState(null);
  const [quoteError, setQuoteError] = useState("");
  const [quoteStale, setQuoteStale] = useState(false);
  const [quoteSignature, setQuoteSignature] = useState("");
  const [bookingView, setBookingView] = useState("form");
  const [bookingError, setBookingError] = useState("");
  const [paymentFailure, setPaymentFailure] = useState(false);
  const [booking, setBooking] = useState(null);
  const currentSignature = createQuoteSignature(scheduledAt, pickup, dropoff, itemSize);
  const confirmEnabled = isQuoteFresh(currentSignature, quoteSignature);

  useEffect(() => {
    getPlaces()
      .then(setPlaces)
      .catch((error) => {
        setLocationError(error.message);
      });
  }, []);

  async function useCurrentLocation() {
    setLocationError("");
    try {
      setPickup(await readCurrentLocation(navigator.geolocation));
      invalidateQuote();
    } catch {
      setLocationError("อ่านตำแหน่งปัจจุบันไม่ได้ กรุณาเลือกจากรายการ");
      setPickup(null);
      invalidateQuote();
    }
  }

  function invalidateQuote() {
    setQuote(null);
    setQuoteError("");
    setQuoteStale(true);
    setQuoteSignature("");
  }

  async function getQuote() {
    if (!pickup || !dropoff || !scheduledAt) {
      setBookingError("กรอกข้อมูลไม่ครบ");
      setBookingView("error");
      return;
    }
    try {
      const body = buildBookingRequest(scheduledAt, pickup, dropoff, itemSize);
      setQuote(await getBookingQuote(body));
      setQuoteSignature(currentSignature);
      setQuoteError("");
      setQuoteStale(false);
    } catch (error) {
      setQuote(null);
      setQuoteError(error.message);
      setQuoteStale(false);
      setQuoteSignature("");
    }
  }

  async function confirmBooking() {
    if (!confirmEnabled || !quote) return;
    try {
      const body = buildBookingRequest(scheduledAt, pickup, dropoff, itemSize);
      const created = await createBooking(body);
      setBooking(created);
      setBookingError("");
      setBookingView("success");
    } catch (error) {
      setBookingError(error.message);
      setBookingView("error");
    }
  }

  async function openPayment() {
    if (!booking) return;
    try {
      await getPayment(booking.id);
      if (onBooked) onBooked(booking.id, booking);
    } catch {
      setPaymentFailure(true);
    }
  }

  if (bookingView === "success" || bookingView === "error") {
    return (
      <main className="wrap">
        <section className="card">
          <div className="bar">{bookingView === "success" ? "สร้างการจองแล้ว" : "จองรถขนย้าย"}</div>
          {bookingView === "error" && (
            <div className="alert">
              <b>{bookingError}</b>
              {bookingError === "กรอกข้อมูลไม่ครบ" && <p>ช่องที่ขาด: {[
                !pickup ? "จุดรับ" : null,
                !dropoff ? "จุดส่ง" : null,
                !scheduledAt ? "วันและเวลานัดหมาย" : null,
              ].filter(Boolean).join(", ")}</p>}
            </div>
          )}
          {bookingView === "success" && (
            <>
              {paymentFailure ? (
                <div className="alert">
                  <b>การจองหมายเลข {booking.id}</b>
                  สร้างการจองแล้ว แต่เปิดหน้าชำระมัดจำไม่ได้ กรุณาลองใหม่
                </div>
              ) : (
                <div className="alert ok">
                  <b>การจองหมายเลข {booking.id} รอชำระมัดจำ</b>
                  ไปหน้าชำระมัดจำเพื่อดำเนินการต่อ
                </div>
              )}
              <div className="sum">
                <div><span>ค่าบริการทั้งหมด</span><span>{booking.total_price} บาท</span></div>
                <div className="hl"><span>มัดจำ 30%</span><span>{booking.deposit_amount} บาท</span></div>
                <div><span>ส่วนที่เหลือ 70%</span><span>{booking.remaining_amount} บาท</span></div>
              </div>
              <button type="button" className="primary" onClick={openPayment}>
                ไปชำระมัดจำ
              </button>
            </>
          )}
          {bookingView === "error" && (
            <button type="button" className="primary" onClick={() => setBookingView("form")}>
              กลับไปแก้ข้อมูล
            </button>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="wrap">
      <section className="card">
        <div className="bar">จองรถขนย้าย</div>

        <label className="field">
          วันและเวลานัดหมาย
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(event) => {
              setScheduledAt(event.target.value);
              invalidateQuote();
            }}
          />
        </label>

        <label className="field">
          จุดรับ
          <select
            value={pickup?.id || ""}
            onChange={(event) => {
              setPickup(findMockPlace(places, event.target.value));
              setLocationError("");
              invalidateQuote();
            }}
          >
            <option value="">เลือกจุดรับ</option>
            {places.map((place) => (
              <option key={place.id} value={place.id}>{place.name}</option>
            ))}
          </select>
        </label>
        <button type="button" className="location-link" onClick={useCurrentLocation}>
          ใช้ตำแหน่งปัจจุบัน
        </button>
        {pickup?.name === "ตำแหน่งปัจจุบัน" && (
          <div className="selected-location">ตำแหน่งปัจจุบัน</div>
        )}
        {locationError && <div className="alert"><b>{locationError}</b></div>}

        <label className="field">
          จุดส่ง
          <select
            value={dropoff?.id || ""}
            onChange={(event) => {
              setDropoff(findMockPlace(places, event.target.value));
              invalidateQuote();
            }}
          >
            <option value="">เลือกจุดส่ง</option>
            {places.map((place) => (
              <option key={place.id} value={place.id}>{place.name}</option>
            ))}
          </select>
        </label>

        <fieldset className="size-field">
          <legend>ประเภทสิ่งของ</legend>
          <div className="tabs">
            {[
              ["SMALL", "เล็ก"],
              ["MEDIUM", "กลาง"],
              ["LARGE", "ใหญ่"],
            ].map(([value, label]) => (
              <button
                type="button"
                key={value}
                className={itemSize === value ? "on" : ""}
                onClick={() => {
                  setItemSize(value);
                  invalidateQuote();
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        {quoteError && <div className="alert"><b>{quoteError}</b></div>}
        {quote && (
          <div className="sum" aria-live="polite">
            <div><span>ระยะทาง</span><span>{quote.distance_km} กม.</span></div>
            <div><span>ค่าบริการทั้งหมด</span><span>{quote.total_price} บาท</span></div>
            <div className="hl"><span>มัดจำ 30%</span><span>{quote.deposit_amount} บาท</span></div>
            <div><span>ส่วนที่เหลือ 70%</span><span>{quote.remaining_amount} บาท</span></div>
          </div>
        )}
        {quote === null && quoteError === "" && !quoteStale && (
          <p className="hint quote-hint">กด "ดูราคา" เพื่อดูค่าบริการก่อนยืนยัน</p>
        )}
        {quote === null && quoteError === "" && quoteStale && (
          <p className="hint quote-hint">แก้ข้อมูลแล้ว ผลดูราคาเดิมถูกล้าง กรุณากด "ดูราคา" ใหม่</p>
        )}
        <button type="button" className="primary" onClick={getQuote}>
          ดูราคา
        </button>
        <button type="button" className="primary" disabled={!confirmEnabled} onClick={confirmBooking}>
          ยืนยันการจอง
        </button>
      </section>
    </main>
  );
}
