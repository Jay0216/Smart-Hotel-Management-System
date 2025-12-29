import nodemailer from "nodemailer";

export const sendEmail = async ({
  to,
  firstName,
  bookingId,
  amount,
  roomName,
  type = "booking" // "booking" or "checkout"
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // App Password
    }
  });

  let subject = "";
  let html = "";

  if (type === "booking") {
    subject = "✅ Booking Confirmed!";
    html = `
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
    `;
  } else if (type === "checkout") {
    subject = "🏁 Checkout Completed!";
    html = `
      <h2>Checkout Completed</h2>
      <p>Hi <b>${firstName}</b>,</p>
      <p>Your checkout for <b>${roomName}</b> is now <b>complete</b>.</p>
      <hr />
      <p><b>Booking ID:</b> ${bookingId}</p>
      <p><b>Total Amount Paid:</b> LKR ${amount}</p>
      <br/>
      <p>We hope you enjoyed your stay 💙</p>
      <p><b>Looking forward to seeing you again!</b></p>
    `;
  }

  const mailOptions = {
    from: `"Hotel Booking" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
};

