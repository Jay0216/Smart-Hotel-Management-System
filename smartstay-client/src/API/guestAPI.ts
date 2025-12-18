// src/api/guestAPI.ts
export interface GuestRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface GuestLoginData {
  email: string;
  password: string;
}

export interface Guest {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  role: 'guest';
  createdAt: string;
}

export interface AuthResponse {
  token?: string;
  guest?: Guest;
  message?: string;
}

const API_BASE = 'http://localhost:3000/api/guests';

export const registerGuest = async (data: GuestRegisterData): Promise<{ status: number; data: AuthResponse }> => {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return { status: res.status, data: json };
};


export const loginGuest = async (data: GuestLoginData): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};


