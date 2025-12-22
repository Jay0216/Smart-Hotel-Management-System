export interface StaffUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  branch: string;
  role: 'staff' | 'receptionist';
}

const BASE_URL = 'http://localhost:3000/api';

export const fetchAllStaffUsers = async (): Promise<StaffUser[]> => {
  const res = await fetch(`${BASE_URL}/staffusers`);

  if (!res.ok) {
    throw new Error('Failed to fetch staff users');
  }

  const data = await res.json();

  // 🔒 always return array
  return Array.isArray(data.users) ? data.users : [];
};
