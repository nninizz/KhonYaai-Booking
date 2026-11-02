// UI-04-01 แท็บ QR พร้อมเพย์ — รองรับ REQ-FN-402 (AC-04-04, AC-04-05)
import MockQr from "./MockQr.jsx";

export default function PromptPayPanel({ payload, amount, disabled, onPaid }) {
  return (
    <div className="panel center">
      {payload && <MockQr payload={payload} />}
      <p className="amount">{amount.toLocaleString()} บาท</p>
      <button className="btn" disabled={disabled} onClick={onPaid}>
        จำลองว่าจ่ายแล้ว
      </button>
    </div>
  );
}
