// controllers/payment.controller.js
import { stripe } from '../stripe.config.js';

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, booking_id } = req.body;

    if (!amount || !booking_id) {
      return res.status(400).json({ message: 'Amount and booking_id required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses cents
      currency: 'lkr',      // or 'usd'
      metadata: { booking_id }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });

  } catch (err) {
    console.error('STRIPE ERROR:', err);
    res.status(500).json({ message: 'Payment intent creation failed' });
  }
};
