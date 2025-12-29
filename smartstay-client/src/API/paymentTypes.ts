// request sent to backend
export interface SimulatePaymentRequest {
  guest_id: number;
  booking_id: number;
  amount: number;
  payment_method: "CARD" | "CASH" | "ONLINE";
  paymentType?: 'booking' | 'checkout';
}

export interface SimulateReceptionistPaymentRequest {
  guest_id: number;
  booking_id: number;
  receptionist_id: number;
  amount: number;
  payment_method: "CARD" | "CASH" | "ONLINE";
}

// payment object returned from backend
export interface Payment {
  payment_id: number;
  guest_id: number;
  booking_id: number;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: "PENDING" | "SUCCESS" | "FAILED";
  transaction_ref: string;
  created_at: string;
}

// API response
export interface SimulatePaymentResponse {
  success: boolean;
  message: string;
  payment: Payment;
}
