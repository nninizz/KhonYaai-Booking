// รองรับ: REQ-IF-001, REQ-QA-001 (จุดเริ่มต้นของแอป frontend)
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// เรียก render เฉพาะเมื่อมี element ที่ id ว่า root (index.html จะถูกสร้างใน task ถัดไป)
const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<App />);
}
