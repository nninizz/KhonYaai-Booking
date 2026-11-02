import { useState } from "react";

// ตรวจรูปแบบฝั่งเว็บก่อนส่ง (backend ตรวจซ้ำเสมอ)
function validate(card) {
  const errors = {};
  const digits = card.number.replace(/\s/g, "");
  if (!/^\d{16}$/.test(digits)) errors.number = "เลขบัตรต้องเป็นตัวเลข 16 หลัก";
  if (!card.holder_name.trim()) errors.holder_name = "กรุณากรอกชื่อบนบัตร";
  const m = card.expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!m) errors.expiry = "รูปแบบ MM/YY";
  else {
    const now = new Date();
    const y = 2000 + Number(m[2]);
    if (y < now.getFullYear() || (y === now.getFullYear() && Number(m[1]) < now.getMonth() + 1))
      errors.expiry = "บัตรหมดอายุแล้ว";
  }
  if (!/^\d{3}$/.test(card.cvv)) errors.cvv = "CVV 3 หลัก";
  return errors;
}

const formatNumber = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
const formatExpiry = (v) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

export default function CardForm({ amount, disabled, onSubmit }) {
  const [card, setCard] = useState({ number: "", holder_name: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState({});

  const set = (k, fmt = (v) => v) => (e) => setCard({ ...card, [k]: fmt(e.target.value) });

  function submit(e) {
    e.preventDefault();
    const errs = validate(card);
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSubmit(card);
  }

  return (
    <form className="panel" onSubmit={submit} noValidate>
      <label className="field">
        เลขบัตร
        <input inputMode="numeric" autoComplete="cc-number" placeholder="4111 1111 1111 1111"
          value={card.number} onChange={set("number", formatNumber)} />
        {errors.number && <span className="err">{errors.number}</span>}
      </label>
      <label className="field">
        ชื่อบนบัตร
        <input autoComplete="cc-name" placeholder="SOMCHAI JAIDEE"
          value={card.holder_name} onChange={set("holder_name", (v) => v.toUpperCase())} />
        {errors.holder_name && <span className="err">{errors.holder_name}</span>}
      </label>
      <div className="row">
        <label className="field">
          วันหมดอายุ
          <input inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY"
            value={card.expiry} onChange={set("expiry", formatExpiry)} />
          {errors.expiry && <span className="err">{errors.expiry}</span>}
        </label>
        <label className="field">
          CVV
          <input inputMode="numeric" autoComplete="cc-csc" placeholder="123" type="password"
            value={card.cvv} onChange={set("cvv", (v) => v.replace(/\D/g, "").slice(0, 3))} />
          {errors.cvv && <span className="err">{errors.cvv}</span>}
        </label>
      </div>
      <p className="muted small">ทดสอบ: เลขบัตรลงท้าย 0000 = ชำระไม่สำเร็จ · เลขอื่น = สำเร็จ</p>
      <button className="primary" type="submit" disabled={disabled}>
        ชำระ {amount.toLocaleString()} บาท
      </button>
    </form>
  );
}
