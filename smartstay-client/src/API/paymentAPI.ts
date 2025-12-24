import type {
  SimulatePaymentRequest,
  SimulatePaymentResponse
} from "./paymentTypes";

const BASE_URL = "http://localhost:3000/api/payments";

export const simulatePaymentAPI = async (
  payload: SimulatePaymentRequest
): Promise<SimulatePaymentResponse> => {
  const res = await fetch(`${BASE_URL}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error("Payment simulation failed");
  }

  return res.json();
};
