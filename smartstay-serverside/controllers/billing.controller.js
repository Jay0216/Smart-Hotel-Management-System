import { getBillingSummaryByGuestId } from '../models/billing.model.js';

export const getBillingSummaryByGuest = async (req, res) => {
  try {
    const { guestId } = req.params;

    const summary = await getBillingSummaryByGuestId(guestId);

    if (!summary) {
      return res.status(404).json({ message: 'Billing data not found for this guest' });
    }

    const subtotal =
      Number(summary.room_paid_amount) +
      Number(summary.service_total);

    const taxAmount = (subtotal * Number(summary.tax_rate)) / 100;
    const total = subtotal + taxAmount;

    res.json({
      bookingId: summary.booking_id, 
      branch: summary.branch_name,
      roomCharges: summary.room_paid_amount,
      serviceCharges: summary.service_total,
      taxRate: summary.tax_rate,
      taxAmount,
      total
    });
  } catch (error) {
    console.error('BILLING SUMMARY ERROR 👉', error);
    res.status(500).json({ message: 'Failed to load billing summary' });
  }
};

