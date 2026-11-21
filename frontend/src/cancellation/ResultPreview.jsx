// รองรับ REQ-FN-DRAFT-CAN-05 โดยแสดงผลตาม BR-CAN-DRAFT-09 เป็นตัวอย่างเท่านั้น
export default function ResultPreview({ minutesRemaining, onBack, live = false, liveResult = null }) {
  const eligibleForRefund = minutesRemaining >= 120;

  // โหมดจริง: แสดงผลจาก backend (④ คืน/ริบมัดจำ, ⑤ หยุดติดตาม)
  if (live) {
    const data = liveResult?.data;
    return (
      <section className="cancellation-card" data-ui-id="UI-06-04">
        <h2>ผลการยกเลิก</h2>
        {(!liveResult || liveResult.phase === "loading") && <p role="status">กำลังยกเลิกการจอง…</p>}
        {liveResult?.phase === "error" && (
          <>
            <div className="cancellation-result" role="alert">
              <strong>ยกเลิกไม่สำเร็จ</strong>
              <span>{liveResult.message}</span>
            </div>
            <button className="cancellation-button cancellation-button-secondary" type="button" onClick={onBack}>
              กลับไปยังรายละเอียดการจอง
            </button>
          </>
        )}
        {liveResult?.phase === "done" && (
          <div className="cancellation-result" role="status">
            <strong>ยกเลิกการจองหมายเลข {data.booking_id} แล้ว</strong>
            {data.deposit_result === "REFUNDED" ? (
              <span>คืนมัดจำเต็มจำนวน {Number(data.deposit_amount).toLocaleString()} บาท</span>
            ) : (
              <span>ไม่คืนมัดจำ {Number(data.deposit_amount).toLocaleString()} บาท มัดจำเป็นของ Platform</span>
            )}
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="cancellation-card" data-ui-id="UI-06-04">
      <h2>ตัวอย่างผลตามเงื่อนไข</h2>
      <p className="cancellation-lead">
        เวลาคงเหลือก่อนนัดหมาย: <strong>{minutesRemaining} นาที</strong>
      </p>
      <div className="cancellation-result" role="status">
        <strong>{eligibleForRefund ? "ตัวอย่าง: เข้าเงื่อนไขคืนมัดจำ" : "ตัวอย่าง: ไม่คืนมัดจำ"}</strong>
        {eligibleForRefund ? (
          <span>
            ตาม Draft BR-CAN-DRAFT-09 กรณีนี้เข้าเงื่อนไขคืนมัดจำเต็มจำนวนภายใน 2 ชั่วโมง
          </span>
        ) : (
          <span>
            ตาม Draft BR-CAN-DRAFT-09 กรณีนี้ไม่คืนมัดจำและมัดจำเป็นของ Platform
          </span>
        )}
      </div>
      <p className="cancellation-demo-notice">
        Demo เท่านั้น — ไม่มีการยกเลิกการจองหรือคืนเงินจริง
      </p>
      <button className="cancellation-button cancellation-button-secondary" type="button" onClick={onBack}>
        กลับไปยังรายละเอียดการจอง
      </button>
    </section>
  );
}
