import type { RegisterPayload, LoginPayload, AuthResponse } from './hotelStaffAuthTypes.ts';



const BASE = 'http://localhost:3000/api/staff';

export const registerStaff = async (data: RegisterPayload): Promise<AuthResponse> => {
  const res = await fetch(`${BASE}/staffregister`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const loginStaff = async (data: LoginPayload): Promise<AuthResponse> => {
  const res = await fetch(`${BASE}/stafflogin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const fetchAssignableStaffByBranch = async (branchId: number) => {
  const res = await fetch(`${BASE}/staff/assignable/${branchId}`);
  if (!res.ok) throw await res.json();
  return res.json(); // returns { staff: [...] }
};


