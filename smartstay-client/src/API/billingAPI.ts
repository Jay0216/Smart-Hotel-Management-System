const API_URL = 'http://localhost:3000/api/billing';

export const getBillingSummaryByGuestAPI = async (guestId: string | number) => {
  try {
    const response = await fetch(`${API_URL}/billing/${guestId}`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch billing summary');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch billing summary');
  }
};
