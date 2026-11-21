// ทดสอบการอ่านคีย์ Google Maps จากตัวแปรสภาพแวดล้อม (T-14)
// รองรับ: REQ-IF-001, D-05-01, D-05-04
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { MAPS_KEY_ENV_NAME, buildMapsScriptUrl, getMapsApiKey } from './maps.js';

const here = dirname(fileURLToPath(import.meta.url));

describe('การอ่านคีย์จากตัวแปรสภาพแวดล้อม', () => {
  test('maps_key_is_read_from_environment_variable', () => {
    // เสร็จเมื่อ: โค้ดอ่านคีย์จากตัวแปรสภาพแวดล้อม ไม่ได้ฝังคีย์ในโค้ด
    const key = getMapsApiKey({ [MAPS_KEY_ENV_NAME]: 'test-key-123' });
    expect(key).toBe('test-key-123');
  });

  test('maps_key_is_null_when_not_configured', () => {
    // เสร็จเมื่อ: ถ้าไม่ได้ตั้งค่า คืน null ไม่คืนคีย์ปลอม
    expect(getMapsApiKey({})).toBeNull();
    expect(getMapsApiKey({ [MAPS_KEY_ENV_NAME]: '   ' })).toBeNull();
  });

  test('maps_script_url_contains_key_only_when_given', () => {
    // รองรับ D-05-01: URL สคริปต์ใช้คีย์ที่อ่านมา
    expect(buildMapsScriptUrl('abc')).toBe('https://maps.googleapis.com/maps/api/js?key=abc');
  });
});

describe('ไม่มีคีย์จริงใน repo', () => {
  test('env_example_has_empty_maps_key', () => {
    // เสร็จเมื่อ: .env.example มีชื่อตัวแปรแต่ค่าว่าง ไม่มีคีย์จริง
    const text = readFileSync(resolve(here, '..', '..', '.env.example'), 'utf-8');
    const line = text.split('\n').find((l) => l.startsWith(`${MAPS_KEY_ENV_NAME}=`));
    expect(line).toBeDefined();
    expect(line.slice(`${MAPS_KEY_ENV_NAME}=`.length).trim()).toBe('');
  });
});
