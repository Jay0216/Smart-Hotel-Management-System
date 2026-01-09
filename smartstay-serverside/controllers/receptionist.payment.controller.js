import { PaymentModel } from "../models/payment.model.js";
import { BookingModel } from "../models/booking.model.js";
import { getRoomById } from "../models/room.model.js";
import { performCheckAction } from "../models/checkincheckout.model.js";
import crypto from "crypto";
import { sendEmail } from "../utils/nodemailer.js"; // updated email utility

export const simulateReceptionPayment = async (req, res) => {
  try {
    const { guest_id, booking_id, amount, payment_method, receptionist_id } = req.body;

    // 1️⃣ Check if a payment already exists for this booking
    const existingPayments = await PaymentModel.getPaymentsByBooking(booking_id, "checkout");
    let payment;

    if (existingPayments && existingPayments.length > 0) {
      // Update the latest payment amount and method
      payment = await PaymentModel.updatePaymentAmount(
        existingPayments[0].payment_id,
        amount,
        payment_method
      );
    } else {
      // Create new checkout payment
      const transaction_ref = `DUMMY-${crypto.randomUUID()}`;
      payment = await PaymentModel.createPayment({
        guest_id,
        booking_id,
        amount,
        payment_method,
        payment_status: "PENDING",
        transaction_ref,
        payment_type: "checkout" // mark it as checkout
      });
    }

    // 2️⃣ Simulate gateway delay
    setTimeout(async () => {
      try {
        // ✅ Update payment status
        await PaymentModel.updatePaymentStatus(payment.payment_id, "SUCCESS");

        // ✅ Update booking status if needed
        const updatedBooking = await BookingModel.updateBookingStatus(booking_id, "SUCCESS");

        // ✅ Perform checkout
        await performCheckAction({
          bookingId: booking_id,
          actionBy: "reception",
          actionType: "checkout",
          notes: "Checkout after payment",
          force: true,
          receptionistId: receptionist_id
        });

        const bookingPayments = await PaymentModel.getPaymentsByBooking(booking_id, "booking");

        const paidBookingAmount = bookingPayments
          ? bookingPayments.reduce((sum, p) => sum + Number(p.amount), 0)
          : 0;

        let emailAmount = amount - paidBookingAmount;
        if (emailAmount < 0) emailAmount = 0;

        // ✅ Send checkout email (not booking email)
        const room = await getRoomById(updatedBooking.room_id);
        await sendEmail({
          to: updatedBooking.email,
          firstName: updatedBooking.first_name,
          bookingId: updatedBooking.booking_id,
          amount: emailAmount,
          roomName: room ? room.room_name : "Room",
          type: "checkout"
        });

      } catch (err) {
        console.error("Error updating statuses after checkout payment 👉", err);
      }
    }, 1500);

    // 3️⃣ Return payment info immediately
    return res.status(201).json({
      success: true,
      message: "Checkout payment initiated (simulation)",
      payment
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Checkout payment simulation failed"
    });
  }
};
