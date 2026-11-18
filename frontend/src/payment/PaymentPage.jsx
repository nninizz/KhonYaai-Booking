// ④ หน้าชำระมัดจำ (UI-04-01 mockups/UI-04-01-payment.html) — รับ bookingId จากหน้าจองของ ③
// รองรับ REQ-FN-401, REQ-FN-402, REQ-FN-403, REQ-FN-404, REQ-FN-405
import { useCallback, useEffect, useState } from "react";
import { createPayment, getPayment } from "../api.js";
import CardForm from "./CardForm.jsx";
import Countdown from "./Countdown.jsx";
import PromptPayPanel from "./PromptPayPanel.jsx";

const METHOD_LABEL = { PROMPTPAY_QR: "QR พร้อมเพย์", CREDIT_CARD: "บัตรเครดิต" };
const PAY_STATUS_LABEL = { SUCCESS: "สำเร็จ", FAILED: "ไม่สำเร็จ", REFUNDED: "คืนเงินแล้ว", FORFEITED: "ริบมัดจำ" };
const FAIL_TITLE = "ชำระเงินไม่สำเร็จ";

const baht = (n) => `${n.toLocaleString()} บาท`;
const time = (s) => (s ? new Date(s).toLocaleTimeString("th-TH") : "-");

function Alert({ ok, title, children }) {
  return (
    <div className={`alert${ok ? " ok" : ""}`} role={ok ? "status" : "alert"}>
      <b>{title}</b>
      {children}
    </div>
  );
}

export default function PaymentPage({ bookingId }) {
  const [info, setInfo] = useState(null);
  const [method, setMethod] = useState("PROMPTPAY_QR");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null); // ข้อความผิดพลาดจากการจ่ายครั้งล่าสุด
  const [loadError, setLoadError] = useState("");

  const load = useCallback(async () => {
    try {
      setInfo(await getPayment(bookingId));
      setLoadError("");
    } catch (e) {
      setLoadError(e.message);
    }
  }, [bookingId]);

  useEffect(() => { load(); }, [load]);

  async function pay(card) {
    setBusy(true);
    setMessage(null);
    try {
      await createPayment({ booking_id: bookingId, method, ...(card ? { card } : {}) });
    } catch (e) {
      // AC-04-07: หัวข้อ "ชำระเงินไม่สำเร็จ" ตามด้วยรายละเอียดจาก backend
      setMessage(e.message.replace(new RegExp(`^${FAIL_TITLE}\\s*`), ""));
    } finally {
      setBusy(false);
      load();
    }
  }

  if (loadError) {
    return <section className="card"><div className="bar">ชำระมัดจำ</div><Alert title={FAIL_TITLE}>{loadError}</Alert></section>;
  }
  if (!info) return <section className="card"><div className="bar">ชำระมัดจำ</div><p className="hint">กำลังโหลด…</p></section>;

  const pending = info.booking_status === "PENDING_DEPOSIT";

  return (
    <section className="card">
      <div className="bar">ชำระมัดจำ</div>

      {pending && message && <Alert title={FAIL_TITLE}>{message}</Alert>}

      {pending && (
        <>
          <div className="sum">
            <div><span>ค่าบริการทั้งหมด</span><span>{baht(info.total_price)}</span></div>
            <div className="hl"><span>มัดจำ 30% (ชำระตอนนี้)</span><span>{baht(info.deposit_amount)}</span></div>
            <div><span>ส่วนที่เหลือ 70%</span><span>{baht(info.remaining_amount)}</span></div>
          </div>
          {/* AC-04-02 ต้องตรงทุกตัวอักษร */}
          <p className="hint">ส่วนที่เหลือ {baht(info.remaining_amount)} จ่ายกับคนขับหลังจบงาน</p>

          <Countdown secondsLeft={info.seconds_left} onExpire={load} />

          <div className="tabs" role="tablist">
            {Object.entries(METHOD_LABEL).map(([key, label]) => (
              <button key={key} role="tab" aria-selected={method === key}
                className={method === key ? "on" : ""} onClick={() => setMethod(key)}>
                {label}
              </button>
            ))}
          </div>
          {method === "PROMPTPAY_QR" ? (
            <PromptPayPanel payload={info.promptpay_qr} amount={info.deposit_amount}
              disabled={busy} onPaid={() => pay()} />
          ) : (
            <CardForm amount={info.deposit_amount} disabled={busy} onSubmit={pay} />
          )}
        </>
      )}

      {info.booking_status === "CONFIRMED" && (
        <>
          <Alert ok title="จองสำเร็จ">ชำระมัดจำสำเร็จ การจองของคุณได้รับการยืนยันแล้ว</Alert>
          {/* รอ Q-05: ข้อความและปุ่มของ ⑤ คงไว้ตามเดิมจนกว่าทีมตัดสิน */}
          <div className="done">
            <p>จองสำเร็จ ระบบกำลังหาคนขับในละแวกใกล้เคียง</p>
            <button className="btn" disabled title="ต่อกับหน้า ⑤ ติดตามสถานะ">ไปหน้าติดตามสถานะ</button>
          </div>
        </>
      )}
      {info.booking_status === "CANCELLED" && (
        // AC-04-12: แสดงเหตุผลจาก cancel_reason ถ้ามี ถ้าไม่มีแสดงแค่หัวข้อ
        <Alert title="การจองนี้ถูกยกเลิกแล้ว">{info.cancel_reason}</Alert>
      )}

      {/* รอ Q-05: ตารางประวัติการชำระ ไม่มี REQ รองรับ คงไว้ตามเดิมจนกว่าทีมตัดสิน */}
      {info.payments.length > 0 && (
        <>
          <h3>ประวัติการชำระ</h3>
          <table className="history">
            <thead><tr><th>เวลา</th><th>วิธี</th><th>ยอด</th><th>สถานะ</th></tr></thead>
            <tbody>
              {info.payments.map((p) => (
                <tr key={p.id}>
                  <td>{time(p.created_at)}</td>
                  <td>{METHOD_LABEL[p.method]}{p.card_last4 && ` ···· ${p.card_last4}`}</td>
                  <td>{baht(p.amount)}</td>
                  <td className={`ps-${p.status}`}>{PAY_STATUS_LABEL[p.status]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
