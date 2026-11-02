import { useEffect, useState } from "react";

// นับถอยหลังจาก seconds_left ที่ backend ส่งมา (กฎข้อ 8)
export default function Countdown({ secondsLeft, onExpire }) {
  const [left, setLeft] = useState(secondsLeft);

  useEffect(() => setLeft(secondsLeft), [secondsLeft]);

  useEffect(() => {
    if (left <= 0) {
      onExpire();
      return;
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const mm = String(Math.floor(Math.max(left, 0) / 60)).padStart(2, "0");
  const ss = String(Math.max(left, 0) % 60).padStart(2, "0");
  return (
    <div className={`countdown ${left <= 120 ? "urgent" : ""}`}>
      <span>ชำระมัดจำภายใน</span>
      <strong>{mm}:{ss}</strong>
      <small>ไม่ชำระภายใน 15 นาที ระบบจะยกเลิกการจองอัตโนมัติ</small>
    </div>
  );
}
