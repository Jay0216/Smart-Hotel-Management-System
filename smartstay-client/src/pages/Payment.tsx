import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaCreditCard, FaLock, FaCheckCircle } from 'react-icons/fa';
import './Payment.css';
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { simulatePayment } from "../redux/paymentSlice";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, amount, paymentType } = location.state || {};

  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    idNumber: ''
  });

  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const isFormValid = () => {
    return (
      guestInfo.firstName.trim() &&
      guestInfo.lastName.trim() &&
      guestInfo.email.trim() &&
      guestInfo.contact.trim() &&
      cardInfo.number.trim() &&
      cardInfo.expiry.trim() &&
      cardInfo.cvv.trim()
    );
  };

  const dispatch = useDispatch<any>();
  const { currentGuest } = useSelector((state: RootState) => state.guest);
  const { loading } = useSelector((state: RootState) => state.payment);

  const handlePayment = async () => {
    if (!isFormValid()) {
      setError("Please fill all required fields");
      return;
    }

    try {
      const action = await dispatch(
        simulatePayment({
          guest_id: Number(currentGuest?.id),
          booking_id: Number(bookingId),
          amount,
          payment_method: "CARD",
          paymentType // pass booking or checkout type
        })
      );

      setShowSuccess(true);

      if (simulatePayment.fulfilled.match(action)) {
        setTimeout(() => {
          navigate("/guestdashboard");
        }, 1500);
      } else {
        setError("Payment failed");
      }
    } catch (err: any) {
      setError(err.message || "Payment failed");
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
            <div className="amount-value">LKR {amount?.toLocaleString()}</div>
            <div className="amount-info">
              <FaCheckCircle className="check-icon" />
              <span>Booking ID: {bookingId}</span>
            </div>
          </div>

          <form className="payment-form" onSubmit={(e) => e.preventDefault()}>
            {/* Guest Info */}
            {/* Guest Info */}
<section className="form-section">
  <h3 className="section-title">Guest Information</h3>
  <div className="form-row">
    <div className="input-group">
      <label>First Name *</label>
      <div className="input-wrapper">
        <FaUser className="input-icon" />
        <input type="text" name="firstName" value={guestInfo.firstName} onChange={handleGuestChange} placeholder="First Name"/>
      </div>
    </div>
    <div className="input-group">
      <label>Last Name *</label>
      <div className="input-wrapper">
        <FaUser className="input-icon" />
        <input type="text" name="lastName" value={guestInfo.lastName} onChange={handleGuestChange} placeholder="Last Name"/>
      </div>
    </div>
  </div>

  <div className="input-group">
    <label>Email *</label>
    <div className="input-wrapper">
      <FaEnvelope className="input-icon" />
      <input type="email" name="email" value={guestInfo.email} onChange={handleGuestChange} placeholder="Email"/>
    </div>
  </div>

  <div className="input-group">
    <label>Contact *</label>
    <div className="input-wrapper">
      <FaPhone className="input-icon" />
      <input type="tel" name="contact" value={guestInfo.contact} onChange={handleGuestChange} placeholder="Contact"/>
    </div>
  </div>

  <div className="input-group">
    <label>ID Number</label>
    <div className="input-wrapper">
      <FaIdCard className="input-icon" />
      <input type="text" name="idNumber" value={guestInfo.idNumber} onChange={handleGuestChange} placeholder="Passport / NIC"/>
    </div>
  </div>
</section>


            {/* Card Info */}
            {/* Card Info */}
<section className="form-section">
  <h3 className="section-title">
    <FaCreditCard className="section-icon" /> Payment Details
  </h3>

  <div className="input-group">
    <label>Card Number *</label>
    <div className="input-wrapper">
      <FaCreditCard className="input-icon" />
      <input type="text" name="number" value={cardInfo.number} onChange={handleCardChange} placeholder="4242 4242 4242 4242"/>
    </div>
  </div>

  <div className="form-row">
    <div className="input-group">
      <label>Expiry Date *</label>
      <div className="input-wrapper">
        <FaLock className="input-icon" />
        <input type="text" name="expiry" value={cardInfo.expiry} onChange={handleCardChange} placeholder="MM/YY"/>
      </div>
    </div>
    <div className="input-group">
      <label>CVV *</label>
      <div className="input-wrapper">
        <FaLock className="input-icon" />
        <input type="text" name="cvv" value={cardInfo.cvv} onChange={handleCardChange} placeholder="123"/>
      </div>
    </div>
  </div>
</section>


            {error && <div className="error-message">{error}</div>}

            <button className={`pay-button ${!isFormValid() || loading ? 'disabled' : ''}`} onClick={handlePayment} disabled={!isFormValid() || loading}>
              {loading ? "Processing Payment..." : `Pay LKR ${amount?.toLocaleString()}`}
            </button>
          </form>
        </div>

        <div className="payment-footer">
          <p>🔒 Powered by Stripe • SSL Encrypted</p>
        </div>
      </div>

      {showSuccess && (
        <div className="payment-success-overlay">
          <div className="checkmark-wrapper">
            <div className="checkmark">✓</div>
            <p>Payment Successful!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
