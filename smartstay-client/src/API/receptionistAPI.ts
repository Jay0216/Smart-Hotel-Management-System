import type { RegisterPayload, LoginPayload, AuthResponse } from './hotelStaffAuthTypes.ts';

const BASE = 'http://localhost:3000/api/receptionist';

export const registerReceptionist = async (data: RegisterPayload): Promise<AuthResponse> => {
  const res = await fetch(`${BASE}/receptionistregister`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const loginReceptionist = async (data: LoginPayload): Promise<AuthResponse> => {
  const res = await fetch(`${BASE}/receptionistlogin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};
