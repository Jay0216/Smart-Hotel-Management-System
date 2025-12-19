import type { RegisterPayload, LoginPayload, AuthResponse } from './hotelStaffAuthTypes.ts';

const BASE = 'http://localhost:3000/api/admin';

export const registerAdmin = async (data: RegisterPayload): Promise<AuthResponse> => {
  const res = await fetch(`${BASE}/adminregister`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const loginAdmin = async (data: LoginPayload): Promise<AuthResponse> => {
  const res = await fetch(`${BASE}/adminlogin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};
