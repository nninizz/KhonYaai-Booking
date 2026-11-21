// @vitest-environment jsdom
// ทดสอบโครง frontend (T-02) ว่า test runner และ React โหลดได้
// รองรับ: REQ-IF-001, REQ-QA-001 (งานพื้นฐาน ตาม plan.md ข้อ 2) ไม่มี AC ตรง ๆ
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { expect, test } from 'vitest';
import App from './App.jsx';

// บอก React ว่าอยู่ในสภาพแวดล้อม act เพื่อไม่ให้มี warning ตอนทดสอบ
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

test('frontend_app_renders_root_element', () => {
  // เสร็จเมื่อ: App render ออกมาเป็น element ที่มี data-testid="app-root"
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(<App />);
  });
  expect(container.querySelector('[data-testid="app-root"]')).not.toBeNull();
  act(() => root.unmount());
  container.remove();
});
