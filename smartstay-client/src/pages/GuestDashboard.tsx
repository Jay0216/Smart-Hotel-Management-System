import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, Bed, Settings, ClipboardList, Box, MapPin } from 'lucide-react';
import type { RootState, AppDispatch } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './GuestDashboard.css';
import { fetchRoomsAsync } from '../redux/roomSlice';
import { addBooking } from '../redux/bookingSlice'; // replace with actual path


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

  const services = [
    { id: '1', name: 'Spa Service', icon: '💆', description: 'Relaxing massage' },
    { id: '2', name: 'Fine Dining', icon: '🍽️', description: 'Gourmet meals' },
    { id: '3', name: 'Airport Shuttle', icon: '🚐', description: '24/7 transport' },
    { id: '4', name: 'Concierge', icon: '🛎️', description: 'Personal assistance' }
  ];

  const billingSummary = {
    roomCharges: 450.00,
    serviceCharges: 120.00,
    tax: 57.00,
    total: 627.00
  };

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



  useEffect(() => {
   dispatch(fetchRoomsAsync());
  }, [dispatch]);

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
      
      
      closeBookingModal();
    } else {
      alert('Failed to create booking: ' + resultAction.error.message);
    }
  } catch (error) {
    console.error('Booking error 👉', error);
    alert('Something went wrong while creating the booking.');
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

        <div className="billing-item">
          <span>Room Charges</span>
          <span>${billingSummary.roomCharges}</span>
        </div>
        <div className="billing-item">
          <span>Service Charges</span>
          <span>${billingSummary.serviceCharges}</span>
        </div>
        <div className="billing-item">
          <span>Tax</span>
          <span>${billingSummary.tax}</span>
        </div>

        <div className="billing-divider"></div>

        <div className="billing-total">
          <span>Total</span>
          <span>${billingSummary.total}</span>
        </div>

        <button className="pay-btn">Pay Now</button>
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
            LKR {room.price.split(' ')[0]} <small>/ night</small>
          </span>
          <button className="view-btn" onClick={() => openBookingModal(room)}>View</button>
        </div>
      </div>
    </div>
  ))}
      </div>
    </div>

    {/* Services */}
    <div className="services-grid">
      {services.map(s => (
        <div key={s.id} className="service-card">
          <div className="service-icon">{s.icon}</div>
          <h4 className="service-name">{s.name}</h4>
          <p className="service-desc">{s.description}</p>
          <button className="request-btn">Request</button>
        </div>
      ))}
    </div>

  </div>
          )}

          {activeTab==='bookings' && (
            <div className="bookings-section">
              <h2>Manage Your Bookings</h2>
              {bookings.map(b => (
                <div key={b.id} className="booking-card">
                  <strong>{b.room}</strong>
                  <p>Status: {b.status}</p>
                  <p>{b.checkIn} - {b.checkOut}</p>
                  <div className="booking-actions">
                    <button>Edit</button>
                    <button>Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab==='services' && (
            <div className="services-section">
              <h2>Request Services</h2>
              <div className="service-buttons">
                <button>Room Service</button>
                <button>Dining</button>
                <button>Housekeeping</button>
                <button>Transport</button>
                <button>Maintenance</button>
              </div>
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





    </div>
  );
};

export default GuestDashboard;
