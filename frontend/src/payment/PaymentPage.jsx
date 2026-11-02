// ④ หน้าชำระมัดจำ — รับ bookingId จากหน้าจองของ ③
import { useCallback, useEffect, useState } from "react";
import { createPayment, getPayment } from "../api.js";
import CardForm from "./CardForm.jsx";
import Countdown from "./Countdown.jsx";
import PromptPayPanel from "./PromptPayPanel.jsx";

const METHOD_LABEL = { PROMPTPAY_QR: "QR พร้อมเพย์", CREDIT_CARD: "บัตรเครดิต" };
const PAY_STATUS_LABEL = { SUCCESS: "สำเร็จ", FAILED: "ไม่สำเร็จ", REFUNDED: "คืนเงินแล้ว", FORFEITED: "ริบมัดจำ" };
const BOOKING_STATUS_LABEL = {
  PENDING_DEPOSIT: "รอชำระมัดจำ", CONFIRMED: "จองสำเร็จ", FINDING_DRIVER: "กำลังหาคนขับ",
  DRIVER_ACCEPTED: "คนขับรับงาน", COMPLETED: "จบงาน", CANCELLED: "ยกเลิกแล้ว",
};

const baht = (n) => `${n.toLocaleString()} บาท`;
const time = (s) => (s ? new Date(s).toLocaleTimeString("th-TH") : "-");

export default function PaymentPage({ bookingId }) {
  const [info, setInfo] = useState(null);
  const [method, setMethod] = useState("PROMPTPAY_QR");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null); // { type: "error" | "success", text }
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
      setMessage({ type: "success", text: "ชำระมัดจำสำเร็จ การจองของคุณได้รับการยืนยันแล้ว" });
    } catch (e) {
      setMessage({ type: "error", text: e.message });
    } finally {
      setBusy(false);
      load();
    }
  }

  if (loadError) return <section className="card"><p className="msg error">{loadError}</p></section>;
  if (!info) return <section className="card"><p className="muted">กำลังโหลด…</p></section>;

  const pending = info.booking_status === "PENDING_DEPOSIT";

  return (
    <section className="card">
      <div className="head">
        <h2>ชำระมัดจำ · การจอง #{info.booking_id}</h2>
        <span className={`badge s-${info.booking_status}`}>{BOOKING_STATUS_LABEL[info.booking_status]}</span>
      </div>

      <dl className="summary">
        <div><dt>ค่าบริการทั้งหมด</dt><dd>{baht(info.total_price)}</dd></div>
        <div className="hl"><dt>มัดจำ 30% (ชำระตอนนี้)</dt><dd>{baht(info.deposit_amount)}</dd></div>
        <div><dt>ส่วนที่เหลือ 70%</dt><dd>{baht(info.remaining_amount)}</dd></div>
      </dl>
      <p className="muted small">ส่วนที่เหลือ {baht(info.remaining_amount)} จ่ายกับคนขับหลังจบงาน</p>  {/* AC-04-02 ต้องตรงทุกตัวอักษร */}

      {pending && <Countdown secondsLeft={info.seconds_left} onExpire={load} />}

      {message && <p className={`msg ${message.type}`}>{message.text}</p>}

      {pending && (
        <>
          <div className="tabs" role="tablist">
            {Object.entries(METHOD_LABEL).map(([key, label]) => (
              <button key={key} role="tab" aria-selected={method === key}
                className={method === key ? "active" : ""} onClick={() => setMethod(key)}>
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
        <div className="done">
          <p>จองสำเร็จ ระบบกำลังหาคนขับในละแวกใกล้เคียง</p>
          <button className="primary" disabled title="ต่อกับหน้า ⑤ ติดตามสถานะ">ไปหน้าติดตามสถานะ</button>
        </div>
      )}
      {info.booking_status === "CANCELLED" && (
        <p className="msg error">การจองนี้ถูกยกเลิกแล้ว (ไม่ชำระมัดจำภายใน 15 นาที หรือถูกยกเลิก)</p>
      )}

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
