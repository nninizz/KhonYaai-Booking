// รองรับ REQ-FN-DRAFT-CAN-05 และ REQ-FN-DRAFT-CAN-08 โดยแสดงข้อมูลประกอบแบบจำลอง
const DEMO_DETAILS = [
  ["วันนัดหมาย", "ข้อมูลจำลอง"],
  ["เวลา", "ข้อมูลจำลอง"],
  ["สถานที่", "ข้อมูลจำลอง"],
  ["ขนาดสิ่งของ", "ข้อมูลจำลอง"],
];

const SIZE_LABEL = { SMALL: "เล็ก", MEDIUM: "กลาง", LARGE: "ใหญ่" };

// ถ้ามีการจองจริงให้แสดงข้อมูลจริง ไม่เช่นนั้นใช้ข้อมูลจำลองเดิม
function detailsOf(booking) {
  if (!booking || !booking.scheduled_at) return DEMO_DETAILS;
  const when = new Date(booking.scheduled_at);
  return [
    ["หมายเลขการจอง", String(booking.id)],
    ["วันนัดหมาย", when.toLocaleDateString("th-TH")],
    ["เวลา", when.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })],
    ["สถานที่", `${booking.pickup_address} → ${booking.dropoff_address}`],
    ["ขนาดสิ่งของ", SIZE_LABEL[booking.item_size] ?? booking.item_size],
  ];
}

export default function BookingDetail({ booking, live = false, minutesRemaining, onRequestCancellation }) {
  return (
    <section className="cancellation-card" data-ui-id="UI-06-01">
      <h2>รายละเอียดการจอง</h2>
      <p className="cancellation-lead">
        เวลาคงเหลือก่อนนัดหมาย: <strong>{minutesRemaining} นาที</strong>
      </p>

      <h3>ข้อมูลการจอง</h3>
      <dl className="cancellation-details">
        {detailsOf(booking).map(([label, value]) => (
          <div className="cancellation-detail-row" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <h3>เงินมัดจำ</h3>
      <p className="cancellation-placeholder">ไม่แสดงยอดเงินจริงใน Demo</p>

      <button className="cancellation-button cancellation-button-danger" type="button" onClick={onRequestCancellation}>
        {live ? "ยกเลิกการจอง" : "ทดลองเงื่อนไขการยกเลิก"}
      </button>
    </section>
  );
}
