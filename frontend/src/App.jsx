// รองรับ: REQ-IF-001, REQ-QA-001 (โครงหน้าจอพื้นฐานของ T-02 ยังไม่มีเนื้อหาหน้าจอ ตามข้อจำกัดของ task)
import React from 'react';

// App คือรากของแอป frontend ยังไม่มีข้อความหรือปุ่ม เพราะ Q-26 ยังไม่ตอบ
export default function App() {
  return <div data-testid="app-root" />;
}
