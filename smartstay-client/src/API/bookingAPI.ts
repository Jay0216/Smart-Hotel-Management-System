// bookingAPI.ts
export interface BookingPayload {
  room_id: string;
  branch_name: string;
  guest_id?: string; // make it optional
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  id_number?: string | null;
  guests: number;
  nights: number;
  additional_note?: string | null;
  
}



export interface BookingResponse extends BookingPayload {
  booking_id: number;
  booking_status: string;
  created_at: string;
  paid_amount: number;
  
}

export interface APIError {
  message: string;
}

const BASE_URL = 'http://localhost:3000/api/bookings'; // adjust your server URL

export const createBooking = async (payload: BookingPayload): Promise<BookingResponse> => {
  const res = await fetch(`${BASE_URL}/makebookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error: APIError = await res.json();
    throw new Error(error.message || 'Failed to create booking');
  }

  const data: BookingResponse = await res.json();
  return data;
};

export const getBookingById = async (bookingId: number): Promise<BookingResponse> => {
  const res = await fetch(`${BASE_URL}/${bookingId}`);
  if (!res.ok) {
    const error: APIError = await res.json();
    throw new Error(error.message || 'Failed to fetch booking');
  }
  const data: BookingResponse = await res.json();
  return data;
};

export const getAllBookings = async (): Promise<BookingResponse[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    const error: APIError = await res.json();
    throw new Error(error.message || 'Failed to fetch bookings');
  }
  const data: BookingResponse[] = await res.json();
  return data;
};


// Fetch all bookings for a specific guest
export const getBookingsByGuestId = async (guestId: string): Promise<BookingResponse[]> => {
  const res = await fetch(`${BASE_URL}/guest/${guestId}`);
  if (!res.ok) {
    const error: APIError = await res.json();
    throw new Error(error.message || 'Failed to fetch guest bookings');
  }
  const data: BookingResponse[] = await res.json();
  return data;
};
