import { PaymentModel } from "../models/payment.model.js";
import { BookingModel } from "../models/booking.model.js";
import { getRoomById, updateRoomStatus } from "../models/room.model.js";
import { performCheckAction } from "../models/checkincheckout.model.js";
import crypto from "crypto";
import { sendEmail } from "../utils/nodemailer.js";

export const simulatePayment = async (req, res) => {
  try {
    const { guest_id, booking_id, amount, payment_method, paymentType } = req.body;

    // 1️⃣ Check if a payment already exists for this booking & type
    const existingPayments = await PaymentModel.getPaymentsByBooking(booking_id, paymentType);
    let payment;

    if (existingPayments && existingPayments.length > 0) {
      // Update the latest payment amount and method
      payment = await PaymentModel.updatePaymentAmount(
        existingPayments[0].payment_id,
        amount,
        payment_method
      );
    } else {
      // Create new payment
      const transaction_ref = `DUMMY-${crypto.randomUUID()}`;
      payment = await PaymentModel.createPayment({
        guest_id,
        booking_id,
        amount,
        payment_method,
        payment_status: "PENDING",
        transaction_ref,
        payment_type: paymentType
      });
    }

    // 2️⃣ Simulate payment processing delay
    setTimeout(async () => {
      try {
        // ✅ Update payment status to SUCCESS
        await PaymentModel.updatePaymentStatus(payment.payment_id, "SUCCESS");

        // ✅ Get updated booking details
        const updatedBooking = await BookingModel.getBookingById(booking_id);

        if (paymentType === "booking") {
          // Booking payment: update booking status
          await BookingModel.updateBookingStatus(booking_id, "SUCCESS");

          // Update room status to "Booked"
          await updateRoomStatus(updatedBooking.room_id, "Booked");

        } else if (paymentType === "checkout") {
          // Checkout payment: perform checkout
          await performCheckAction({
            bookingId: booking_id,
            actionBy: "guest", // or receptionist/system
            actionType: "checkout",
            notes: "Checkout after payment",
            force: true
          });
        }

        // ✅ Send appropriate email
        const room = await getRoomById(updatedBooking.room_id);
        await sendEmail({
          to: updatedBooking.email,
          firstName: updatedBooking.first_name,
          bookingId: updatedBooking.booking_id,
          amount,
          roomName: room ? room.room_name : "Room",
          type: paymentType === "booking" ? "booking" : "checkout"
        });

      } catch (err) {
        console.error("Error processing payment 👉", err);
      }
    }, 1500);

    // 3️⃣ Return payment info immediately
    return res.status(201).json({
      success: true,
      message: `Payment initiated for ${paymentType}`,
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

