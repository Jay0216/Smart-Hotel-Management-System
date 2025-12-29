const API_BASE_URL = 'http://localhost:3000/api/checkincheckout';

/* ===================== INTERFACES ===================== */

export type ActionBy = 'guest' | 'reception';
export type ActionType = 'checkin' | 'checkout';

export interface CheckActionPayload {
  bookingId: number;
  actionBy: ActionBy;
  actionType: ActionType;
  staffId?: number;   // only for receptionist
  notes?: string;
}

export interface CheckActionResponse {
  message: string;
  result: {
    bookingId: number;
    status: 'checked_in' | 'checked_out';
    actionType: ActionType;
  };
}

export interface CheckLog {
  id: number;
  booking_id: number;
  action_by: ActionBy;
  staff_id?: number;
  action_type: ActionType;
  action_time: string;
  notes?: string;
  first_name?: string;
  last_name?: string;
}

/* ===================== API METHODS ===================== */

/**
 * Check-in or Check-out
 */
export const performCheckAction = async (
  payload: CheckActionPayload
): Promise<CheckActionResponse> => {
  const res = await fetch(`${API_BASE_URL}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Action failed');
  }

  return res.json();
};

/**
 * Fetch check-in/check-out logs for a booking
 */
export const fetchCheckLogsByBooking = async (
  bookingId: number
): Promise<CheckLog[]> => {
  const res = await fetch(`${API_BASE_URL}/logs/${bookingId}`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch logs');
  }

  const data = await res.json();
  return data.logs;
};
