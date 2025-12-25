import nodemailer from "nodemailer";

export const sendBookingSuccessEmail = async ({
  to,
  firstName,
  bookingId,
  amount,
  roomName
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // App Password
    }
  });

  const mailOptions = {
    from: `"Hotel Booking" <${process.env.EMAIL_USER}>`,
    to,
    subject: "✅ Booking Confirmed!",
    html: `
      <h2>Booking Confirmation</h2>
      <p>Hi <b>${firstName}</b>,</p>

      <p>Your booking has been <b>successfully confirmed</b>.</p>

      <hr />

      <p><b>Booking ID:</b> ${bookingId}</p>
      <p><b>Room:</b> ${roomName}</p>
      <p><b>Amount Paid:</b> LKR ${amount}</p>

      <br/>
      <p>Thank you for choosing our hotel 💙</p>
      <p><b>Have a pleasant stay!</b></p>
    `
  };

  await transporter.sendMail(mailOptions);
};
