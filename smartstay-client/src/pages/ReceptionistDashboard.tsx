import React, { useEffect, useRef, useState } from 'react';
import {
  ClipboardList,
  LogIn,
  LogOut,
  User,
  Printer
} from 'lucide-react';
import './ReceptionistDashboard.css';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { fetchAllBookings } from '../redux/bookingSlice';
import { checkActionThunk } from '../redux/checkincheckoutSlice';
import type { BookingResponse } from '../API/bookingAPI';
import { fetchGuestServiceRequests } from '../redux/serviceRequestSlice';
import { fetchBillingSummaryThunk } from '../redux/billingSlice';
import { useNavigate } from 'react-router-dom';
import { receptionistLogout } from '../redux/receptionSlice';

type Tab = 'dashboard' | 'checkin-checkout' | 'profile';

const ReceptionistDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [receiptBooking, setReceiptBooking] =
    useState<BookingResponse | null>(null);

  const receiptRef = useRef<HTMLDivElement>(null);

  const [alert, setAlert] = useState<{
  type: 'success' | 'error';
  message: string;
} | null>(null);

  const { currentReceptionist } = useSelector(
    (state: RootState) => state.receptionist
  );

  const { allBookings, status } = useSelector(
    (state: RootState) => state.booking
  );

  const loading = status === 'loading';

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCheckAction = async (
  booking: BookingResponse,
  actionType: 'checkin' | 'checkout'
) => {
  try {
    await dispatch(
      checkActionThunk({
        bookingId: booking.booking_id,
        actionBy: 'reception',
        receptionistId: Number(currentReceptionist?.id), // must NOT be null
        actionType
      })
    ).unwrap();

    // ✅ Success alert
    window.alert(
      actionType === 'checkin'
        ? 'Guest checked in successfully'
        : 'Guest checked out successfully'
    );

    // 🧾 Show receipt only after checkout
    if (actionType === 'checkout') {
      setReceiptBooking(booking);
    }

    // 🔄 Refresh bookings list
    dispatch(fetchAllBookings());
  } catch (err: any) {
    // ❌ Error alert
    window.alert(err?.message || 'Operation failed. Please try again.');
  }
};

const [showCheckoutModal, setShowCheckoutModal] = useState(false);
const [selectedBooking, setSelectedBooking] =
  useState<BookingResponse | null>(null);


const { requests: serviceRequests } = useSelector(
  (state: RootState) => state.serviceRequests
);

useEffect(() => {
  if (selectedBooking?.guest_id) {
    dispatch(fetchGuestServiceRequests(selectedBooking.guest_id));
  }
}, [selectedBooking, dispatch]);

useEffect(() => {
  if (selectedBooking?.guest_id) {
    dispatch(fetchBillingSummaryThunk(selectedBooking.guest_id));
  }
}, [selectedBooking, dispatch]);


const {
  data: billingSummary,
  loading: billingLoading,
  error: billingError
} = useSelector((state: RootState) => state.billing);

const handleGuestCheckout = async (booking: any) => {
  try {
    // Fetch completed services for this guest
    const completedServices = serviceRequests.filter(
      (r) => r.status?.toLowerCase() === 'completed'
    );

    const roomAmount = Number(booking.paid_amount || 0);
    const servicesAmount = completedServices
      .map(s => Number(s.service_price || 0))
      .reduce((a, b) => a + b, 0);
    const taxRate = billingSummary?.taxRate || 0;

    const subtotal = roomAmount + servicesAmount;
    const totalWithTax = subtotal + (subtotal * (taxRate / 100));

    // Prepare data to pass to payment page
    

    // Redirect to payment page
    navigate('/receptionistpayment', {
        state: {
          bookingId: booking.booking_id,
          receptionistId: Number(currentReceptionist?.id),
          amount: totalWithTax
        }
      });

  } catch (error: any) {
    console.error('Checkout error:', error);
    window.alert(error?.message || 'Checkout failed');
  }
};

useEffect(() => {
  if (selectedBooking?.guest_id) {
    dispatch(fetchGuestServiceRequests(selectedBooking.guest_id));
  }
}, [dispatch, selectedBooking]);


const { requests: guestServiceRequests, loading: serviceRequestsLoading, error: serviceRequestsError } =
  useSelector((state: RootState) => state.serviceRequests);

  const serviceCharges = guestServiceRequests
   .filter(r => r.status?.toLowerCase() === 'completed')
   .map(r => Number(r.service_price) || 0)
   .reduce((a, b) => a + b, 0);

   
   const roomCharges = Number(
     billingSummary?.roomCharges || selectedBooking?.paid_amount || 0
   );

   const taxRate = Number(billingSummary?.taxRate || 0);

   const subtotal = roomCharges + serviceCharges;

   const taxAmount = subtotal * (taxRate / 100);

   const totalAmount = subtotal + taxAmount;
  

  return (
    <div className="reception-dashboard-page">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="avatar"><User /></div>
          <h2>
            {currentReceptionist?.firstName}{' '}
            {currentReceptionist?.lastName}
          </h2>
          <p>Receptionist</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            <ClipboardList /> Dashboard
          </button>

          <button
            className={activeTab === 'checkin-checkout' ? 'active' : ''}
            onClick={() => setActiveTab('checkin-checkout')}
          >
            <LogIn /> Check-In / Check-Out
          </button>

          <button
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            <User /> Profile
          </button>

    <button
      className="logout-tab"
      onClick={() => {
        dispatch(receptionistLogout());  // Clear guest state
        navigate('/stafflogin');        // Redirect to login page
      }}
    >
      <User /> {/* You can replace this with a logout icon if you have one */}
      <span className="nav-label">Logout</span>
    </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Receptionist Dashboard</h1>
        </header>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="cards-grid">
            <div className="card">
              <h3>Total Bookings</h3>
              <p>{allBookings.length}</p>
            </div>

            <div className="card">
              <h3>Checked-In</h3>
              <p>
                {allBookings.filter(
                  b => b.booking_status === 'checked_in'
                ).length}
              </p>
            </div>

            <div className="card">
              <h3>Checked-Out</h3>
              <p>
                {allBookings.filter(
                  b => b.booking_status === 'checked_out'
                ).length}
              </p>
            </div>
          </div>
        )}

        {/* CHECK-IN / CHECK-OUT */}
        {activeTab === 'checkin-checkout' && (
          <div className="checkin-wrapper">
            <h2>Guest Check-In / Check-Out</h2>

            {loading && <p>Loading bookings…</p>}

            {!loading && allBookings.map(b => (
              <div key={b.booking_id} className="booking-card">
                <div>
                  <strong>
                    {b.first_name} {b.last_name}
                  </strong>
                  <p>{b.email}</p>
                  <p>Room ID: {b.room_id}</p>
                  <p>Nights: {b.nights}</p>
                  <p>Status: <b>{b.booking_status}</b></p>
                </div>

                <div className="booking-actions">
                  {b.booking_status === 'SUCCESS' && (
                    <button
                      onClick={() => handleCheckAction(b, 'checkin')}
                    >
                      <LogIn /> Check-In
                    </button>
                  )}

                  {b.booking_status === 'checked_in' && (
                    <button
                      className="checkout"
                      onClick={() => {
                        setSelectedBooking(b);
                        setShowCheckoutModal(true);
                       }} 
                    >
                      <LogOut /> Check-Out
                    </button>
                  )}

                  {b.booking_status === 'checked_out' && (
                    <button disabled>✔ Checked Out</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PROFILE */}
        {activeTab === 'profile' && (
            <div className="profile-section">
              <h2>Profile Settings</h2>
          
              <div className="profile-grid">
                {/* Avatar */}
                <div className="avatar-section">
                  <div
                    className="profile-avatar"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {profileImage ? (
                      <img src={profileImage} alt="avatar" />
                    ) : (
                      <User />
                    )}
                  </div>
          
                  <div className="upload-hint">Tap avatar to upload</div>
          
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="file-input-hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setProfileImage(URL.createObjectURL(file));
                      }
                    }}
                  />
                </div>
          
                {/* Form */}
                <div className="profile-form">
                  <label>First Name</label>
                  <input type="text" placeholder="Staff" />
          
                  <label>Last Name</label>
                  <input type="text" placeholder="Member" />
          
                  <label>Email</label>
                  <input type="email" placeholder="staff@hotel.com" />
          
                  <label>Department</label>
                  <input type="text" placeholder="Housekeeping / Maintenance" />
          
                  <button>Update Profile</button>
                </div>
              </div>
            </div>
          )}

        


{showCheckoutModal && selectedBooking && (
  <div className="checkout-modal">
    <div className="checkout-content">
      <h2>Checkout Summary</h2>
      <hr />

      {/* Guest Info */}
      <p><b>Guest:</b> {selectedBooking.first_name} {selectedBooking.last_name}</p>
      <p><b>GuestID:</b> {selectedBooking.guest_id}</p>
      <p><b>Room ID:</b> {selectedBooking.room_id}</p>
      <p><b>Nights:</b> {selectedBooking.nights}</p>

      <hr />

      {/* Billing Summary from backend */}
      {billingLoading && <p>Loading billing summary...</p>}
      {billingError && <p style={{ color: 'red' }}>Failed to load billing summary</p>}

      {!billingLoading && !billingError && (
  <>
    <div className="row">
      <span>Room Charges</span>
      <span>LKR {roomCharges.toLocaleString()}</span>
    </div>

    <div className="row">
      <span>Service Charges</span>
      <span>LKR {serviceCharges.toLocaleString()}</span>
    </div>

    <div className="row">
      <span>Subtotal</span>
      <span>LKR {subtotal.toLocaleString()}</span>
    </div>

    <div className="row">
      <span>Tax ({taxRate}%)</span>
      <span>LKR {taxAmount.toLocaleString()}</span>
    </div>

    <hr />

    <div className="row total">
      <b>Total</b>
      <b>LKR {totalAmount.toLocaleString()}</b>
    </div>
  </>
)}

      <div className="checkout-actions">
        <button
          className="cancel"
          onClick={() => {
            setShowCheckoutModal(false);
            setSelectedBooking(null);
          }}
        >
          Cancel
        </button>

        <button
          className="confirm"
          onClick={async () => {
            setShowCheckoutModal(false);
            await handleGuestCheckout(selectedBooking);
            setSelectedBooking(null);
          }}
        >
          Confirm Checkout
        </button>
      </div>
    </div>
  </div>
)}



      </main>
    </div>
  );
};

export default ReceptionistDashboard;
