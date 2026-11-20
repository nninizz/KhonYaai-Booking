const REQUIRED_MESSAGE = "ห้ามเว้นว่าง";
const EMAIL_FORMAT_MESSAGE = "รูปแบบอีเมลไม่ถูกต้อง";
const PHONE_FORMAT_MESSAGE = "เบอร์โทรต้องเป็นตัวเลข 10 หลัก ขึ้นต้นด้วย 0";
const PASSWORD_FORMAT_MESSAGE =
  "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร และมีทั้งตัวพิมพ์ใหญ่กับตัวพิมพ์เล็ก";

// REQ-FN-102, REQ-FN-105: ตรวจข้อมูลสมัครและคืนข้อความ error แยกตามช่อง
export function validateRegisterForm(values = {}) {
  const errors = {};
  const name = values.name ?? "";
  const email = values.email ?? "";
  const phone = values.phone ?? "";
  const password = values.password ?? "";

  if (!name.trim()) {
    errors.name = REQUIRED_MESSAGE;
  }

  const normalizedEmail = email.trim();
  if (!normalizedEmail) {
    errors.email = REQUIRED_MESSAGE;
  } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalizedEmail)) {
    errors.email = EMAIL_FORMAT_MESSAGE;
  }

  const normalizedPhone = phone.replace(/[\s-]/g, "");
  if (!normalizedPhone) {
    errors.phone = REQUIRED_MESSAGE;
  } else if (!/^0\d{9}$/.test(normalizedPhone)) {
    errors.phone = PHONE_FORMAT_MESSAGE;
  }

  if (!password) {
    errors.password = REQUIRED_MESSAGE;
  } else if (
    [...password].length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password)
  ) {
    errors.password = PASSWORD_FORMAT_MESSAGE;
  }

  return errors;
}
