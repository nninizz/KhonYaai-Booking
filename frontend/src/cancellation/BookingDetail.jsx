// รองรับ REQ-FN-DRAFT-CAN-05 และ REQ-FN-DRAFT-CAN-08 โดยแสดงข้อมูลประกอบแบบจำลอง
const DEMO_DETAILS = [
  ["วันนัดหมาย", "ข้อมูลจำลอง"],
  ["เวลา", "ข้อมูลจำลอง"],
  ["สถานที่", "ข้อมูลจำลอง"],
  ["ขนาดสิ่งของ", "ข้อมูลจำลอง"],
];

export default function BookingDetail({ minutesRemaining, onRequestCancellation }) {
  return (
    <section className="cancellation-card" data-ui-id="UI-06-01">
      <h2>รายละเอียดการจอง</h2>
      <p className="cancellation-lead">
        เวลาคงเหลือก่อนนัดหมาย: <strong>{minutesRemaining} นาที</strong>
      </p>

      <h3>ข้อมูลการจอง</h3>
      <dl className="cancellation-details">
        {DEMO_DETAILS.map(([label, value]) => (
          <div className="cancellation-detail-row" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <h3>เงินมัดจำ</h3>
      <p className="cancellation-placeholder">ไม่แสดงยอดเงินจริงใน Demo</p>

      <button className="cancellation-button cancellation-button-danger" type="button" onClick={onRequestCancellation}>
        ทดลองเงื่อนไขการยกเลิก
      </button>
    </section>
  );
}
