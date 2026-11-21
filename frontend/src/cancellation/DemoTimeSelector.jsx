// รองรับ REQ-FN-DRAFT-CAN-05 โดยให้ทดลอง boundary values ใน Demo เท่านั้น
const DEMO_MINUTES = [44, 45, 119, 120];

export default function DemoTimeSelector({ value, onChange, actualMinutes = null }) {
  return (
    <fieldset className="cancellation-time-selector">
      <legend>เลือกเวลาจำลองก่อนนัดหมาย</legend>
      <div className="cancellation-time-options">
        {actualMinutes !== null && (
          <button
            type="button"
            className={value === actualMinutes ? "cancellation-time-selected" : ""}
            aria-pressed={value === actualMinutes}
            onClick={() => onChange(actualMinutes)}
          >
            เวลาจริง ({actualMinutes} นาที)
          </button>
        )}
        {DEMO_MINUTES.map((minutes) => (
          <button
            key={minutes}
            type="button"
            className={value === minutes ? "cancellation-time-selected" : ""}
            aria-pressed={value === minutes}
            onClick={() => onChange(minutes)}
          >
            {minutes} นาที
          </button>
        ))}
      </div>
      <p className="cancellation-muted">ข้อมูลนี้ใช้ทดลองหน้าจอ Demo เท่านั้น</p>
    </fieldset>
  );
}