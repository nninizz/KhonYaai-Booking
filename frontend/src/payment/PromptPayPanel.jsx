import MockQr from "./MockQr.jsx";

export default function PromptPayPanel({ payload, amount, disabled, onPaid }) {
  return (
    <div className="panel center">
      <div className="pp-head">PromptPay · พร้อมเพย์</div>
      {payload && <MockQr payload={payload} />}
      <p className="amount">{amount.toLocaleString()} บาท</p>
      <p className="muted small">QR จำลอง — กดปุ่มด้านล่างแทนการสแกนจ่ายจริง</p>
      <button className="primary" disabled={disabled} onClick={onPaid}>
        จำลองว่าจ่ายแล้ว
      </button>
    </div>
  );
}
