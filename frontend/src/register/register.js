const API_BASE = (
  import.meta.env?.VITE_API_BASE || ""
).replace(/\/+$/, "");

// REQ-FN-101, REQ-SEC-101: ส่งข้อมูลสมัครโดยไม่แนบ Authorization
export async function registerUser(body) {
  const requestBody = JSON.stringify(body);
  let response;
  try {
    response = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: requestBody,
    });
  } catch (error) {
    return { kind: "network_error", error };
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    return { kind: "http_error", status: response.status, error };
  }

  if (response.status === 201) {
    return { kind: "success", data };
  }
  if (response.status === 409) {
    return { kind: "conflict", data };
  }
  if (response.status === 422) {
    return { kind: "validation_error", data };
  }
  return { kind: "http_error", status: response.status, data };
}
