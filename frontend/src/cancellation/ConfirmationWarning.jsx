// รองรับ REQ-FN-DRAFT-CAN-05 โดยขอการยืนยันก่อนแสดงผลตัวอย่าง
export default function ConfirmationWarning({ minutesRemaining, onConfirm, onBack }) {
  return (
    <section className="cancellation-card" data-ui-id="UI-06-02">
      <h2>ยืนยันการยกเลิก</h2>
      <p className="cancellation-lead">
        เวลาคงเหลือก่อนนัดหมาย: <strong>{minutesRemaining} นาที</strong>
      </p>
      <div className="cancellation-warning" role="note">
        <strong>คำเตือนเรื่องเงินมัดจำ</strong>
        <span>หากยืนยันการยกเลิก เงินมัดจำจะไม่ได้รับคืนและจะเป็นของ Platform</span>
      </div>
      <p className="cancellation-demo-notice">
        Demo เท่านั้น — การยืนยันจะแสดงผลตัวอย่างในหน้านี้เท่านั้น
      </p>
      <button className="cancellation-button cancellation-button-danger" type="button" onClick={onConfirm}>
        ยืนยันเพื่อดูตัวอย่าง
      </button>
      <button className="cancellation-button cancellation-button-secondary" type="button" onClick={onBack}>
        กลับ
      </button>
    </section>
  );
}
