import { DashboardModel } from "../models/dashboard.model.js";

export const getOccupancy = async (req, res) => {
  try {
    const data = await DashboardModel.getOccupancyLast7Days();
    res.json({
      labels: data.map(d => d.day),
      data: data.map(d => Number(d.occupancy.toFixed(2)))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch occupancy data" });
  }
};

export const getRevenue = async (req, res) => {
  try {
    const data = await DashboardModel.getRevenueLast6Months();
    res.json({
      labels: data.map(d => d.month),
      data: data.map(d => Number(d.revenue))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch revenue data" });
  }
};

export const getBookingTrends = async (req, res) => {
  try {
    const data = await DashboardModel.getBookingTrends();
    res.json({
      labels: data.map(d => d.room_type),
      data: data.map(d => Number(d.bookings))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch booking trends" });
  }
};
