import { PaymentModel } from "../models/payment.model.js";
import { BookingModel } from "../models/booking.model.js";
import { updateRoomStatus } from "../models/room.model.js"; // <-- import this
import { sendBookingSuccessEmail } from "../utils/nodemailer.js";
import crypto from "crypto";

export const simulatePayment = async (req, res) => {
  try {
    const {
      guest_id,
      booking_id,
      amount,
      payment_method
    } = req.body;

    // 1️⃣ Create payment as PENDING
    const transaction_ref = `DUMMY-${crypto.randomUUID()}`;

    const payment = await PaymentModel.createPayment({
      guest_id,
      booking_id,
      amount,
      payment_method,
      payment_status: "PENDING",
      transaction_ref
    });

    // 2️⃣ Simulate gateway delay
    setTimeout(async () => {
      try {
        // ✅ update payment status
        await PaymentModel.updatePaymentStatus(payment.payment_id, "SUCCESS");

        // ✅ update booking status
        const updatedBooking = await BookingModel.updateBookingStatus(
          booking_id,
          "SUCCESS"
        );

        // ✅ update room status
        if (updatedBooking) {
          await updateRoomStatus(updatedBooking.room_id, "Booked");

          await sendBookingSuccessEmail({
            to: updatedBooking.email,
            firstName: updatedBooking.first_name,
            bookingId: updatedBooking.booking_id,
            amount,
            roomName: updatedBooking.room_name // make sure room_name is returned in booking
          });
        }

        

      } catch (err) {
        console.error("Error updating statuses after payment 👉", err);
      }
    }, 1500);

    // 3️⃣ Return initial payment info immediately
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

