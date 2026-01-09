import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, Bed, Settings, ClipboardList, Box, MapPin } from 'lucide-react';
import type { RootState, AppDispatch } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './GuestDashboard.css';
import { fetchRoomsAsync } from '../redux/roomSlice';
import { addBooking, fetchGuestBookings } from '../redux/bookingSlice'; // replace with actual path
import { createServiceRequest, fetchGuestServiceRequests } from '../redux/serviceRequestSlice';
import { fetchServicesAsync } from '../redux/serviceSlice';
import { checkActionThunk } from '../redux/checkincheckoutSlice';
import { fetchBillingSummaryThunk } from '../redux/billingSlice';
import { guestLogout } from '../redux/guestSlice';





interface Booking {
  id: string;
  room: string;
  status: 'Booked' | 'Checked-in' | 'Checked-out';
  checkIn: string;
  checkOut: string;
}

interface Notification {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
}

export interface LocalRoom {
  id: string;
  branch_name: string;
  country: string;
  room_name: string;
  room_type: string;
  price: string;      // API sends string
  capacity: number;
  status: 'Available' | 'Booked' | 'Unavailable';
  images: string[];
}

const GuestDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();


  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'services' | 'profile'>('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', text: 'Your room booking is confirmed.', type: 'success', timestamp: '2025-12-15 10:00' },
    { id: '2', text: 'New housekeeping service available.', type: 'info', timestamp: '2025-12-15 12:30' }
  ]);
  const { currentGuest } = useSelector((state: RootState) => state.guest);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([
    { id: 'b1', room: 'Deluxe Room 101', status: 'Booked', checkIn: '2025-12-20', checkOut: '2025-12-22' },
    { id: 'b2', room: 'Suite 301', status: 'Checked-in', checkIn: '2025-12-10', checkOut: '2025-12-15' }
  ]);


  //const featuredRoom = {
    //name: 'Presidential Suite',
    //image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
    //location: 'Kandy, Sri Lanka',
    //description: 'Luxury suite with panoramic city views',
    //price: '$450/night',
    //amenities: ['King Bed', 'Ocean View', 'Private Balcony', 'Spa Bath']
  //};

  //const localrooms: LocalRoom[] = [
    //{ id: '1', name: 'Deluxe Room', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400', price: '$180/night', location: 'Kandy' },
   // { id: '2', name: 'Executive Suite', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400', price: '$320/night', location: 'Kandy' },
    //{ id: '3', name: 'Garden Villa', image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400', price: '$280/night', location: 'Kandy' },
   // { id: '4', name: 'Pool View Room', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400', price: '$220/night', location: 'Kandy' }
  //];

  

  

  //const [currentSlide, setCurrentSlide] = useState(0);

  //const nextSlide = () => {
    //setCurrentSlide((prev) => (prev + 1) % Math.ceil(localrooms.length / getItemsPerSlide()));
  //};

  //const prevSlide = () => {
    //setCurrentSlide((prev) => (prev - 1 + Math.ceil(localrooms.length / getItemsPerSlide())) % Math.ceil(localrooms.length / getItemsPerSlide()));
 // };

  const getItemsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }
    return 3;
  };

  const { rooms, loading } = useSelector((state: RootState) => state.rooms);

  const { services: allServices, loading: servicesLoading } = useSelector(
   (state: RootState) => state.services
  );

  useEffect(() => {
   dispatch(fetchServicesAsync());
  }, [dispatch]);




  useEffect(() => {
   dispatch(fetchRoomsAsync());
  }, [dispatch]);

  

useEffect(() => {
  if (currentGuest?.id) {
    dispatch(fetchGuestServiceRequests(currentGuest.id));
  }
}, [dispatch, currentGuest]);


const { requests: guestServiceRequests, loading: serviceRequestsLoading, error: serviceRequestsError } =
  useSelector((state: RootState) => state.serviceRequests);

  




  const servicesToDisplay = allServices.map(s => ({
   id: s.id.toString(),
   name: s.name,
   branch_name: s.branch_name,
   prices: s.price
  }));

  const featuredRoom = rooms.length > 0 ? rooms[0] : null;
  const otherRooms = rooms.slice(1);

  const rawImage = featuredRoom?.images?.[0];

  const getRoomImageUrl = (room: typeof featuredRoom, index = 0) => {
    if (!room?.images || !room.images[index]) return 'https://via.placeholder.com/800';
    return `http://localhost:3000${room.images[index]}`;
  };

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<LocalRoom | typeof featuredRoom | null>(null);

// Booking form state
const [bookingForm, setBookingForm] = useState({
  firstName: '',
  lastName: '',
  email: '',
  contact: '',
  idNumber: '',
  additionalNote: '',
  guests: '',      // new field
  nights: ''
});

// Handlers
const openBookingModal = (room: LocalRoom | typeof featuredRoom) => {
  setSelectedRoom(room);
  setShowBookingModal(true);
};

const closeBookingModal = () => {
  setShowBookingModal(false);
  setSelectedRoom(null);
  setBookingForm({
    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    idNumber: '',
    additionalNote: '',
    guests: '',      // new field
    nights: ''       
    
  });
};

const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  setBookingForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
};



const [fullImage, setFullImage] = useState<string | null>(null);

// inside GuestDashboard component, replace handleBookingSubmit
const handleBookingSubmit = async () => {
  if (!selectedRoom) return;

  // Validate required fields
  const { firstName, lastName, email, contact, guests, nights } = bookingForm;
  if (!firstName || !lastName || !email || !contact || !guests || !nights) {
    alert('Please fill all required fields.');
    return;
  }

  // ✅ Guest capacity check
  if (Number(guests) > selectedRoom.capacity) {
    alert(`The selected room has a maximum capacity of ${selectedRoom.capacity} guests.`);
    return;
  }

  // Prepare booking payload
  const bookingData = {
    room_id: selectedRoom.id,
    branch_name: selectedRoom.branch_name,
    guest_id: currentGuest?.id, // use current logged-in guest
    first_name: firstName,
    last_name: lastName,
    email,
    contact,
    id_number: bookingForm.idNumber || null,
    guests: Number(guests),
    nights: Number(nights),
    additional_note: bookingForm.additionalNote || null
  };

  try {
    // Dispatch Redux action to add booking
    const resultAction = await dispatch(addBooking(bookingData));
    
    if (addBooking.fulfilled.match(resultAction)) {
      alert('Booking created successfully!');

      const booking = resultAction.payload; // ✅ the payload *is* the booking
      const bookingId = booking.booking_id;   // here is the booking ID



      // 💰 calculate amount
      const amount =
        Number(selectedRoom.price) * Number(bookingForm.nights);

      // 👉 go to payment page with real data
      navigate('/payment', {
        state: {
          bookingId: bookingId,
          amount,
          currency: 'LKR',
          paymentType: 'booking'
        }
      });
      
      
      closeBookingModal();
    } else {
      alert('Failed to create booking: ' + resultAction.error.message);
    }
  } catch (error) {
    console.error('Booking error 👉', error);
    alert('Something went wrong while creating the booking.');
  }
};

const { guestBookings, status: bookingStatus } = useSelector(
  (state: RootState) => state.booking
);

useEffect(() => {
  if (currentGuest?.id) {
    dispatch(fetchGuestBookings(currentGuest.id));
  }
}, [dispatch, currentGuest]);

const [showServiceModal, setShowServiceModal] = useState(false);

const [serviceForm, setServiceForm] = useState({
  branch_name: '',
  service_id: '',
  request_service_name: '',
  request_note: ''
});


const openServiceModal = (serviceId?: string) => {
  const selectedService = servicesToDisplay.find(s => s.id === serviceId);

  setServiceForm({
    branch_name: featuredRoom?.branch_name || '',
    service_id: serviceId || '',
    request_service_name: selectedService?.name || '',
    request_note: ''
  });

  setShowServiceModal(true);
};


const closeServiceModal = () => {
  setShowServiceModal(false);
};

const handleServiceChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  setServiceForm(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));
};

const handleServiceSubmit = async () => {
  if (!serviceForm.branch_name || !serviceForm.service_id) {
    alert('Please select a service');
    return;
  }

  const payload = {
    guest_id: currentGuest?.id || '',
    branch_name: serviceForm.branch_name,
    service_id: Number(serviceForm.service_id),
    request_service_name: serviceForm.request_service_name,
    request_note: serviceForm.request_note || null
  };

  try {
    const result = await dispatch(createServiceRequest(payload));

    if (createServiceRequest.fulfilled.match(result)) {
      
      alert('Service request sent successfully!');
      if (currentGuest?.id) {
       dispatch(fetchGuestServiceRequests(currentGuest.id));
      }
      closeServiceModal();
    } else {
      alert(result.payload || 'Failed to send request');
    }
  } catch (err) {
    console.error('Service request error 👉', err);
    alert('Something went wrong');
  }
};


const handleGuestCheckIn = async (bookingId: number) => {
  try {
    const result = await dispatch(
      checkActionThunk({
        bookingId,
        actionBy: 'guest',
        actionType: 'checkin'
      })
    ).unwrap();

    alert('Check-in successful ✅');

    // Refresh bookings to get updated status
    if (currentGuest?.id) {
      dispatch(fetchGuestBookings(currentGuest.id));
    }

  } catch (error: any) {
    alert(error || 'Check-in failed');
  }
};


  


// After successful booking

useEffect(() => {
  if (currentGuest?.id) {
    dispatch(fetchBillingSummaryThunk(currentGuest.id)); // pass guestId
  }
}, [currentGuest, dispatch]);


const { data: billingSummary, loading: billingLoading, error: billingError } = useSelector(
  (state: RootState) => state.billing
);



const handleGuestCheckout = async (booking: any) => {
  try {
    const completedServices = guestServiceRequests.filter(
      (r) => r.status.toLowerCase() === 'completed'
    );

    const roomAmount = Number(booking.paid_amount || 0);
    const servicesAmount = completedServices
      .map(s => Number(s.service_price || 0))
      .reduce((a, b) => a + b, 0);
    const taxRate = billingSummary?.taxRate || 0;
    const totalAmount = roomAmount + servicesAmount;
    const totalWithTax = totalAmount + (totalAmount * (taxRate / 100));

    // Redirect to Payment page with total and specify paymentType = "checkout"
    navigate('/payment', {
      state: {
        bookingId: booking.booking_id,
        amount: Number(totalWithTax.toFixed(2)),
        paymentType: 'checkout' // pass checkout type to server
      }
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    alert(error?.message || 'Checkout failed');
  }
};





  

  return (
    <div className="guest-dashboard-page">
      {/* Sidebar for desktop, top bar for mobile */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="avatar" onClick={() => fileInputRef.current?.click()}>
            {profileImage ? <img src={profileImage} alt="avatar" /> : <User />}
          </div>
          <h2>{currentGuest?.firstName} {currentGuest?.lastName}</h2>
          <p>Guest</p>
        </div>
        <nav className="sidebar-nav">
          <button className={activeTab==='dashboard'?'active':''} onClick={()=>setActiveTab('dashboard')}>
            <ClipboardList /><span className="nav-label">Dashboard</span>
          </button>
          <button className={activeTab==='bookings'?'active':''} onClick={()=>setActiveTab('bookings')}>
            <Bed /><span className="nav-label">Bookings</span>
          </button>
          <button className={activeTab==='services'?'active':''} onClick={()=>setActiveTab('services')}>
            <Box /><span className="nav-label">Services</span>
          </button>
          <button className={activeTab==='profile'?'active':''} onClick={()=>setActiveTab('profile')}>
            <Settings /><span className="nav-label">Profile</span>
          </button>

          <button
      className="logout-tab"
      onClick={() => {
        dispatch(guestLogout());  // Clear guest state
        navigate('/guestauth')       // Redirect to login page
      }}
    >
      <User /> {/* You can replace this with a logout icon if you have one */}
      <span className="nav-label">Logout</span>
    </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Welcome, {currentGuest?.firstName}</h1>
          <div className="notifications-wrapper">
            <div className="notifications" onClick={() => setShowNotifications(s => !s)}>
              <Bell />
              {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
              {showNotifications && (
                <div className="notification-panel">
                  {notifications.length === 0 ? (
                    <div className="notification-empty">No notifications</div>
                  ) : (
                    <>
                      {notifications.map(n => (
                        <div key={n.id} className="notification-item">
                          {n.text}
                          <div className="timestamp">{n.timestamp}</div>
                        </div>
                      ))}
                      <div className="notification-actions">
                        <button onClick={() => { setNotifications([]); setShowNotifications(false); }}>Clear All</button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="tab-bar">
          <button className={activeTab==='dashboard'?'active':''} onClick={()=>setActiveTab('dashboard')}>Overview</button>
          <button className={activeTab==='bookings'?'active':''} onClick={()=>setActiveTab('bookings')}>Bookings</button>
          <button className={activeTab==='services'?'active':''} onClick={()=>setActiveTab('services')}>Services</button>
          <button className={activeTab==='profile'?'active':''} onClick={()=>setActiveTab('profile')}>Profile</button>
        </div>

        {/* Dashboard Body */}
        <div className="dashboard-body">
          {activeTab==='dashboard' && (
            <div className="dashboard-enhanced">

    {/* Featured + Billing */}
    <div className="featured-section">

      {/* Featured Room */}
      {/* LOADING STATE */}
  {loading && (
    <div className="featured-card">
      <div className="featured-image-wrapper">
        <div className="featured-skeleton" />
      </div>
    </div>
  )}

  {/* EMPTY STATE */}
  {!loading && !featuredRoom && (
    <div className="featured-card">
      <div className="featured-image-wrapper">
        <p style={{ padding: '2rem', textAlign: 'center' }}>
          No rooms available
        </p>
      </div>
    </div>
  )}

  {/* SUCCESS STATE */}
  {!loading && featuredRoom && (
    <div className="featured-card">
      <div className="featured-image-wrapper">
        <img
          src={getRoomImageUrl(featuredRoom)}
          className="featured-image"
          alt={featuredRoom.room_name}
        />

        <div className="featured-overlay">
          {/* Location */}
          <div className="featured-location">
            <MapPin size={18} />
            <span>
              {featuredRoom.branch_name}, {featuredRoom.country}
            </span>
          </div>

          {/* Room Name */}
          <h2 className="featured-title">
            {featuredRoom.room_name}
          </h2>

          {/* Description */}
          <p className="featured-desc">
            {featuredRoom.room_type} room designed for premium comfort
          </p>

          {/* TAGS */}
          <div className="featured-amenities">
            <span className="amenity-tag">
              Capacity: {featuredRoom.capacity} Guests
            </span>

            <span className="amenity-tag">
              Type: {featuredRoom.room_type}
            </span>

            <span
              className="amenity-tag"
              style={{
                background:
                  featuredRoom.status === 'Available'
                    ? 'rgba(16,185,129,0.3)'
                    : 'rgba(239,68,68,0.3)'
              }}
            >
              {featuredRoom.status}
            </span>
          </div>

          {/* Footer */}
          <div className="featured-footer">
            <span className="featured-price">
              LKR {Number(featuredRoom.price).toLocaleString()} / night
            </span>

            <button
              className="book-now-btn"
              disabled={featuredRoom.status !== 'Available'}
              onClick={() => openBookingModal(featuredRoom)}
              
            >
              {featuredRoom.status === 'Available'
                ? 'Book Now'
                : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

      {/* Billing */}
      <div className="billing-card">
  <h3 className="billing-title">Billing Summary</h3>

  {billingLoading && <p>Loading billing summary...</p>}
  {billingError && <p style={{ color: 'red' }}>Not Currently Having Bookings or Services.</p>}

  {!billingLoading && !billingError && billingSummary && (
  <>
    {/* Determine if all bookings are checked out */}
    {guestBookings.some(b => b.booking_status !== 'checked_out') ? 
      (() => {
        // Normal billing values
        const roomCharges = Number(billingSummary.roomCharges);
        const serviceCharges = guestServiceRequests
          .map(r => Number(r.service_price) || 0)
          .reduce((a, b) => a + b, 0);
        const taxRate = Number(billingSummary.taxRate);
        const total =
          roomCharges + serviceCharges + (roomCharges + serviceCharges) * (taxRate / 100);

        return (
          <>
            <div className="billing-item">
              <span>Room Charges</span>
              <span>LKR {roomCharges.toLocaleString()}</span>
            </div>
            <div className="billing-item">
              <span>Service Requests</span>
              <span>LKR {serviceCharges.toLocaleString()}</span>
            </div>
            <div className="billing-item">
              <span>Tax</span>
              <span>{taxRate.toLocaleString()} %</span>
            </div>

            <div className="billing-divider"></div>

            <div className="billing-total">
              <span>Total</span>
              <span>LKR {total.toLocaleString()}</span>
            </div>

            <button className="pay-btn">Pay Now</button>
          </>
        );
      })()
      :
      (() => {
        // All checked out → same structure but zero values
        return (
          <>
            <div className="billing-item">
              <span>Room Charges</span>
              <span>LKR 0</span>
            </div>
            <div className="billing-item">
              <span>Service Requests</span>
              <span>LKR 0</span>
            </div>
            <div className="billing-item">
              <span>Tax</span>
              <span>0 %</span>
            </div>

            <div className="billing-divider"></div>

            <div className="billing-total">
              <span>Total</span>
              <span>LKR 0</span>
            </div>

            <button className="pay-btn" disabled>
              ✅ All payments completed
            </button>
          </>
        );
      })()
    }
  </>
)}

</div>

    </div>

    {/* Rooms Slider */}
    <div className="slider-section">
      <h3 className="section-title">Other Rooms & Suites</h3>

      <div className="slider-track">
        {otherRooms.map(room => (
    <div key={room.id} className="room-card">
      <img src={getRoomImageUrl(room)} className="room-image" alt={room.room_name} />
      <div className="room-info">
        <h4 className="room-name">{room.room_name}</h4>
        <div className="room-location">
          <MapPin size={14} />
          <span>{room.branch_name}, {room.country}</span>
        </div>
        <div className="room-footer">
          <span className="room-price">
            LKR {room.price.split(' ')[0]} <small>/ night </small>
          </span>
          <button 
            className="view-btn"
              onClick={() => openBookingModal(room)}
              disabled={room.status.toLowerCase() === "booked"} // disable if booked
              style={{
                cursor: room.status.toLowerCase() === "booked" ? "not-allowed" : "pointer",
                opacity: room.status.toLowerCase() === "booked" ? 0.5 : 1
              }}
          >View</button>
        </div>
      </div>
    </div>
  ))}
      </div>
    </div>

    {/* Services */}
    <div className="services-grid">
  {servicesLoading ? (
    <p>Loading services...</p>
  ) : (
    servicesToDisplay.map(s => (
      <div key={s.id} className="service-card">
        
        <h4 className="service-name">{s.name}</h4>
        <p className="service-desc">{s.branch_name}</p>
        <p className="service-desc">LKR {s.prices}</p>
        <button className="request-btn" onClick={() => openServiceModal(s.id)}>Request</button>
      </div>
    ))
  )}
</div>

  </div>
          )}

          {activeTab==='bookings' && (
            <div className="bookings-section">
              <h2>Manage Your Bookings</h2>
{bookingStatus === 'loading' && <p>Loading bookings...</p>}
{bookingStatus === 'failed' && <p>Failed to load bookings.</p>}
{bookingStatus === 'succeeded' && guestBookings.length === 0 && (
  <p>No bookings found.</p>
)}
{bookingStatus === 'succeeded' && guestBookings.map((b) => (
  <div key={b.booking_id} className="booking-card">
    <strong className='book-id'>{b.room_id}</strong> {/* replace with room name if available */}
    <strong className='book-id'>Hotel {b.branch_name}</strong> {/* replace with room name if available */}
    <p>Status: {b.booking_status}</p>
    <p>Guests: {b.guests} | Nights: {b.nights}</p>
    <p>Amount: {b.paid_amount}</p>
    <p>Check-In: {new Date(b.created_at).toLocaleDateString()}</p>
    <div className="booking-actions">
  {b.booking_status === 'SUCCESS' && (
    <button
      className="checkin-btn"
      onClick={() => handleGuestCheckIn(b.booking_id)}
    >
      Online Check-in
    </button>
  )}

  {b.booking_status === 'checked_in' && (
  <button
    className="checkout-btn"
    onClick={() => handleGuestCheckout(b)}
  >
    Checkout
  </button>
)}

{b.booking_status === 'checked_out' && (
  <button className="checkedout-btn" disabled>
    Checked Out ✔
  </button>
)}

  <button className="cancel-btn">Cancel</button>
</div>
  </div>
))}
            </div>
          )}

          {activeTab==='services' && (
  <div className="services-section">
    <h2>Requested Services</h2>

    {serviceRequestsLoading && <p>Loading service requests...</p>}
{serviceRequestsError && <p>Failed to load service requests.</p>}
{!serviceRequestsLoading && !serviceRequestsError && guestServiceRequests.length === 0 && (
  <p>No service requests found.</p>
)}
{!serviceRequestsLoading && !serviceRequestsError && guestServiceRequests.length > 0 &&
  guestServiceRequests.map((req) => (
    <div key={req?.request_id} className="booking-card">
      <strong className='service-id'>Service name : {req?.service_name || 'Unknown'}</strong>
      <p>Note: {req?.request_note || 'N/A'}</p>
      <p>Status: {req?.status || 'Pending'}</p>
      <p>Price: {req?.service_price || 'N/A'}</p>
    </div>
))}
  </div>
)}




          {activeTab==='profile' && (
            <div className="profile-section">
              <h2>Profile Settings</h2>
              <div className="profile-grid">
                <div className="avatar-section">
                  <div className="profile-avatar" onClick={() => fileInputRef.current?.click()}>
                    {profileImage ? <img src={profileImage} alt="avatar" /> : <User />}
                  </div>
                  <div className="upload-hint">Tap avatar to upload</div>
                  <input ref={fileInputRef} className="file-input-hidden" type="file" accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setProfileImage(URL.createObjectURL(f));
                    }}
                  />
                </div>
                <div className="profile-form">
                  <label>First Name</label>
                  <input type="text" placeholder="John" />
                  <label>Last Name</label>
                  <input type="text" placeholder="Doe" />
                  <label>Email</label>
                  <input type="email" placeholder="your.email@example.com" />
                  <label>Password</label>
                  <input type="password" placeholder="********" />
                  <button>Update Profile</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
{/* Full Image Popup */}
{fullImage && (
  <div
    className="full-image-popup"
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000, // higher than booking modal
    }}
  >
    {/* Close Icon */}
    <button
      onClick={() => setFullImage(null)}
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.5)',
        color: '#fff',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        cursor: 'pointer',
        fontSize: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10001,
      }}
    >
      &times;
    </button>

    {/* Full Image */}
    <img
      src={fullImage}
      alt="Full Room"
      style={{
        maxWidth: '90%',
        maxHeight: '90%',
        borderRadius: '8px',
        boxShadow: '0 0 10px #000',
        zIndex: 10000,
      }}
    />
  </div>
)}

{/* Booking Modal */}
{showBookingModal && selectedRoom && (
  <div
    className="booking-modal"
  >
    <div className="booking-modal-content">
      <h2>Book: {selectedRoom.room_name}</h2>
      <p>
        Location: {selectedRoom.branch_name}, {selectedRoom.country}<br />
        Price: LKR {Number(selectedRoom.price).toLocaleString()} / night
      </p>

      {/* Display all images of the room (max 5) */}
      {selectedRoom.images && selectedRoom.images.length > 0 && (
        <div className="modal-room-images">
          {selectedRoom.images.slice(0, 5).map((img, idx) => (
            <img
              key={idx}
              src={`http://localhost:3000${img}`}
              alt={`${selectedRoom.room_name} ${idx + 1}`}
              onClick={() => setFullImage(`http://localhost:3000${img}`)}
            />
          ))}
        </div>
      )}

      {/* Booking Form */}
<div className="booking-form">
  <input
    type="text"
    name="firstName"
    placeholder="First Name"
    value={bookingForm.firstName}
    onChange={handleFormChange}
  />
  
  <input
    type="text"
    name="lastName"
    placeholder="Last Name"
    value={bookingForm.lastName}
    onChange={handleFormChange}
  />
  
  <input
    type="email"
    name="email"
    placeholder="Email"
    value={bookingForm.email}
    onChange={handleFormChange}
  />
  
  <input
    type="text"
    name="contact"
    placeholder="Contact Number"
    value={bookingForm.contact}
    onChange={handleFormChange}
  />
  
  <input
    type="text"
    name="idNumber"
    placeholder="Passport / NIC Number"
    value={bookingForm.idNumber}
    onChange={handleFormChange}
  />

  <input
    type="number"
    name="guests"
    placeholder="Number of Guests"
    min={1}
    value={bookingForm.guests}
    onChange={handleFormChange}
  />

  <input
    type="number"
    name="nights"
    placeholder="Number of Nights"
    min={1}
    value={bookingForm.nights}
    onChange={handleFormChange}
  />
  
  <textarea
    name="additionalNote"
    placeholder="Additional Note"
    value={bookingForm.additionalNote}
    onChange={handleFormChange}
  />
</div>


      <div className="booking-modal-actions">
        <button onClick={handleBookingSubmit}>Confirm Booking</button>
        <button onClick={closeBookingModal}>Cancel</button>
      </div>
    </div>
  </div>
)}


{showServiceModal && (
  <div className="booking-modal">
    <div className="booking-modal-content">
      <h2>Request a Service</h2>

      <div className="booking-form">
        {/* Branch Name */}
        <input
          type="text"
          name="branch_name"
          placeholder="Branch Name"
          value={serviceForm.branch_name}
          onChange={handleServiceChange}
        />

        {/* Service Select */}
        <select
          name="service_id"
          value={serviceForm.service_id}
          onChange={handleServiceChange}
        >
          <option value="">Select Service</option>
          {servicesToDisplay.map(service => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>

        {/* Request Note */}
        <textarea
          name="request_note"
          placeholder="Request note (optional)"
          value={serviceForm.request_note}
          onChange={handleServiceChange}
        />
      </div>

      <div className="booking-modal-actions">
        <button onClick={handleServiceSubmit}>
          Send Request
        </button>
        <button onClick={closeServiceModal}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}






    </div>
  );
};

export default GuestDashboard;
