export type UserRole = 'receptionist' | 'staff';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  branch: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
  };
}
