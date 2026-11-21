// รองรับ REQ-FN-DRAFT-CAN-05 โดยแสดงกรณีเวลาคงเหลือน้อยกว่า 45 นาที
export default function NotAllowed({ minutesRemaining, onBack }) {
  return (
    <section className="cancellation-card" data-ui-id="UI-06-03">
      <h2>ไม่สามารถยกเลิกได้</h2>
      <p className="cancellation-lead">
        เวลาคงเหลือก่อนนัดหมาย: <strong>{minutesRemaining} นาที</strong>
      </p>
      <div className="cancellation-blocked" role="status">
        <strong>ไม่สามารถยกเลิกการจองได้</strong>
        <span>เมื่อเวลาคงเหลือน้อยกว่า 45 นาที ระบบไม่ดำเนินการยกเลิกตาม BR-CAN-DRAFT-09</span>
      </div>
      <p className="cancellation-demo-notice">
        Demo เท่านั้น — ไม่มีการเปลี่ยนแปลงการจองจริง
      </p>
      <button className="cancellation-button cancellation-button-secondary" type="button" onClick={onBack}>
        กลับไปยังรายละเอียดการจอง
      </button>
    </section>
  );
}
