import { PaymentModel } from "../models/payment.model.js";
import { BookingModel } from "../models/booking.model.js";
import { sendBookingSuccessEmail } from "../utils/nodemailer.js";
import { getRoomById } from "../models/room.model.js";
import { performCheckAction } from "../models/checkincheckout.model.js";
import crypto from "crypto";

export const simulateReceptionPayment = async (req, res) => {
  try {
    const { guest_id, booking_id, amount, payment_method, receptionist_id } = req.body;

    // 1️⃣ Check if a payment already exists for this booking
    const existingPayments = await PaymentModel.getPaymentsByBooking(booking_id);
    let payment;

    if (existingPayments && existingPayments.length > 0) {
      // Update the latest payment amount and method
      payment = await PaymentModel.updatePaymentAmount(existingPayments[0].payment_id, amount, payment_method);
    } else {
      // Create new payment
      const transaction_ref = `DUMMY-${crypto.randomUUID()}`;
      payment = await PaymentModel.createPayment({
        guest_id,
        booking_id,
        amount,
        payment_method,
        payment_status: "PENDING",
        transaction_ref
      });
    }

    // 2️⃣ Simulate gateway delay
    setTimeout(async () => {
      try {
        // ✅ Update payment status
        await PaymentModel.updatePaymentStatus(payment.payment_id, "SUCCESS");

        // ✅ Update booking status to SUCCESS (if needed)
        const updatedBooking = await BookingModel.updateBookingStatus(booking_id, "SUCCESS");

        // ✅ Perform checkout: update room status and insert checkin_checkout_log
        await performCheckAction({
           bookingId: booking_id,
           actionBy: "reception",
           actionType: "checkout",
           notes: "Checkout after payment",
           force: true,
           receptionistId: receptionist_id // or however you get the logged-in receptionist
        });

        // ✅ Send booking confirmation email
        const room = await getRoomById(updatedBooking.room_id);
        await sendBookingSuccessEmail({
          to: updatedBooking.email,
          firstName: updatedBooking.first_name,
          bookingId: updatedBooking.booking_id,
          amount,
          roomName: room ? room.room_name : "Room"
        });

      } catch (err) {
        console.error("Error updating statuses after payment 👉", err);
      }
    }, 1500);

    // 3️⃣ Return payment info immediately
    return res.status(201).json({
      success: true,
      message: "Payment initiated (simulation)",
      payment
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Payment simulation failed"
    });
  }
};
