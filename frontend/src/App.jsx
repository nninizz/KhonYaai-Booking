import { AuthFlow } from "./auth/AuthFields.jsx";
import RegisterPage from "./register/RegisterPage.jsx";

// รองรับ REQ-FN-201, REQ-FN-203, REQ-FN-205: เปิด Auth เป็นหน้าเริ่มต้นและส่ง token ให้ผู้เรียก
export default function App({ onAuthenticated } = {}) {
  const isRegisterRoute = window.location.pathname === "/register";

  return (
    <main className="wrap">
      <header className="top">
        <h1>Khonย้าย</h1>
      </header>
      {isRegisterRoute ? (
        <RegisterPage />
      ) : (
        <AuthFlow onAuthenticated={onAuthenticated} />
      )}
    </main>
  );
}
