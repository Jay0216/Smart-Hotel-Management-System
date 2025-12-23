import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaCreditCard, FaLock, FaCheckCircle } from 'react-icons/fa';
import './Payment.css';

interface PaymentPageProps {
  bookingId: string;
  amount: number;
  onSuccess: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ bookingId, amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    idNumber: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleCardChange = (event: any) => {
    setCardComplete(event.complete);
    if (error) setError(null);
  };

  const isFormValid = () => {
    return (
      guestInfo.firstName.trim() &&
      guestInfo.lastName.trim() &&
      guestInfo.email.trim() &&
      guestInfo.contact.trim() &&
      cardComplete
    );
  };

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.contact) {
      setError('Please fill all required fields');
      return;
    }

    if (!cardComplete) {
      setError('Please complete card details');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, booking_id: bookingId })
      });
      const { clientSecret } = await res.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: guestInfo.firstName + ' ' + guestInfo.lastName,
            email: guestInfo.email,
            phone: guestInfo.contact
          }
        }
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
      } else if (result.paymentIntent?.status === 'succeeded') {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-wrapper">
        <div className="payment-header">
          <div className="lock-badge">
            <FaLock className="lock-icon" />
            <span>Secure Payment</span>
          </div>
          <h1 className="payment-title">Complete Your Booking</h1>
          <p className="payment-subtitle">Enter your details to finalize your reservation</p>
        </div>

        <div className="payment-container">
          <div className="amount-card">
            <div className="amount-label">Total Amount</div>
            <div className="amount-value">LKR {amount.toLocaleString()}</div>
            <div className="amount-info">
              <FaCheckCircle className="check-icon" />
              <span>Booking ID: {bookingId}</span>
            </div>
          </div>

          <form className="payment-form" onSubmit={(e) => e.preventDefault()}>
            <section className="form-section">
              <h3 className="section-title">Guest Information</h3>
              
              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="firstName">First Name *</label>
                  <div className="input-wrapper">
                    <FaUser className="input-icon" />
                    <input
                      id="firstName"
                      type="text"
                      placeholder="Enter first name"
                      name="firstName"
                      value={guestInfo.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <div className="input-wrapper">
                    <FaUser className="input-icon" />
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Enter last name"
                      name="lastName"
                      value={guestInfo.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="email">Email Address *</label>
                <div className="input-wrapper">
                  <FaEnvelope className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    name="email"
                    value={guestInfo.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="contact">Contact Number *</label>
                <div className="input-wrapper">
                  <FaPhone className="input-icon" />
                  <input
                    id="contact"
                    type="tel"
                    placeholder="+94 XX XXX XXXX"
                    name="contact"
                    value={guestInfo.contact}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="idNumber">Passport / NIC Number</label>
                <div className="input-wrapper">
                  <FaIdCard className="input-icon" />
                  <input
                    id="idNumber"
                    type="text"
                    placeholder="Enter ID number (optional)"
                    name="idNumber"
                    value={guestInfo.idNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            <section className="form-section">
              <h3 className="section-title">
                <FaCreditCard className="section-icon" />
                Payment Details
              </h3>
              
              <div className="card-input-group">
                <label>Card Information *</label>
                <div className="card-element-wrapper">
                  <CardElement 
                    options={{ 
                      hidePostalCode: true,
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#1f2937',
                          '::placeholder': {
                            color: '#9ca3af',
                          },
                        },
                      },
                    }} 
                    onChange={handleCardChange}
                  />
                </div>
              </div>

              <div className="security-note">
                <FaLock className="note-icon" />
                <span>Your payment information is encrypted and secure</span>
              </div>
            </section>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <button 
              className={`pay-button ${!isFormValid() || loading ? 'disabled' : ''}`}
              onClick={handlePayment} 
              disabled={!isFormValid() || loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Processing Payment...
                </>
              ) : (
                <>
                  <FaLock className="btn-icon" />
                  Pay LKR {amount.toLocaleString()}
                </>
              )}
            </button>
          </form>
        </div>

        <div className="payment-footer">
          <p>🔒 Powered by Stripe • SSL Encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;