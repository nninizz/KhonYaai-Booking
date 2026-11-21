// เดโมของ 005-tracking (ไม่ใช่โค้ดของแอปจริง) รันจากโฟลเดอร์ frontend:
//   node node_modules/vite/bin/vite.js --config demo/vite.config.mjs --port 5180
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const demoDir = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

export default defineConfig({
  root: demoDir,
  server: { host: '127.0.0.1', port: 5180, fs: { allow: [repoRoot] } },
});
