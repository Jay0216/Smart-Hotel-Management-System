const BASE = 'http://localhost:3000/api/admin';

/**
 * Admin Registration
 * Input: { firstName, lastName, email, password, imageUrl? }
 * Response: { message: string, user: { admin_id, first_name, last_name, email, image_url } }
 */
export const registerAdmin = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  imageUrl?: string;
}): Promise<{
  message: string;
  user: {
    admin_id: string;
    first_name: string;
    last_name: string;
    email: string;
    image_url: string | null;
  };
}> => {
  const res = await fetch(`${BASE}/adminregister`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw await res.json();
  return res.json();
};

/**
 * Admin Login
 * Input: { email, password }
 * Response: { token: string, user: { id, firstName, lastName, email, role: 'admin', imageUrl } }
 */
export const loginAdmin = async (data: {
  email: string;
  password: string;
}): Promise<{
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'admin';
    imageUrl: string | null;
  };
}> => {
  const res = await fetch(`${BASE}/adminlogin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw await res.json();
  return res.json();
};

