const BASE_URL = "http://localhost:3000/api/dashboard"; // adjust your server URL

export const DashboardAPI = {
  fetchOccupancy: async () => {
    const res = await fetch(`${BASE_URL}/stats/occupancy`);
    if (!res.ok) throw new Error("Failed to fetch occupancy data");
    return res.json(); // { labels: [], data: [] }
  },

  fetchRevenue: async () => {
    const res = await fetch(`${BASE_URL}/stats/revenue`);
    if (!res.ok) throw new Error("Failed to fetch revenue data");
    return res.json();
  },

  fetchBookingTrends: async () => {
    const res = await fetch(`${BASE_URL}/stats/trends`);
    if (!res.ok) throw new Error("Failed to fetch booking trends data");
    return res.json();
  },
};
