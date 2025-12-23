import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, Bed, Settings, ClipboardList, Box, MapPin } from 'lucide-react';
import type { RootState, AppDispatch } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './GuestDashboard.css';

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

interface Room {
  id: string;
  name: string;
  image: string;
  price: string;
  location: string;
}

const GuestDashboard: React.FC = () => {
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


  const featuredRoom = {
    name: 'Presidential Suite',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
    location: 'Kandy, Sri Lanka',
    description: 'Luxury suite with panoramic city views',
    price: '$450/night',
    amenities: ['King Bed', 'Ocean View', 'Private Balcony', 'Spa Bath']
  };

  const rooms: Room[] = [
    { id: '1', name: 'Deluxe Room', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400', price: '$180/night', location: 'Kandy' },
    { id: '2', name: 'Executive Suite', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400', price: '$320/night', location: 'Kandy' },
    { id: '3', name: 'Garden Villa', image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400', price: '$280/night', location: 'Kandy' },
    { id: '4', name: 'Pool View Room', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400', price: '$220/night', location: 'Kandy' }
  ];

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

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(rooms.length / getItemsPerSlide()));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(rooms.length / getItemsPerSlide())) % Math.ceil(rooms.length / getItemsPerSlide()));
  };

  const getItemsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }
    return 3;
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
      <div className="featured-card">
        <div className="featured-image-wrapper">
          <img src={featuredRoom.image} className="featured-image" />
          <div className="featured-overlay">
            <div className="featured-location">
              <MapPin size={18} />
              <span>{featuredRoom.location}</span>
            </div>
            <h2 className="featured-title">{featuredRoom.name}</h2>
            <p className="featured-desc">{featuredRoom.description}</p>

            <div className="featured-amenities">
              {featuredRoom.amenities.map((a, i) => (
                <span key={i} className="amenity-tag">{a}</span>
              ))}
            </div>

            <div className="featured-footer">
              <span className="featured-price">{featuredRoom.price}</span>
              <button className="book-now-btn">Book Now</button>
            </div>
          </div>
        </div>
      </div>

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
        {rooms.map(room => (
          <div key={room.id} className="room-card">
            <img src={room.image} className="room-image" />
            <div className="room-info">
              <h4 className="room-name">{room.name}</h4>
              <div className="room-location">
                <MapPin size={14} />
                <span>{room.location}</span>
              </div>
              <div className="room-footer">
                <span className="room-price">{room.price}</span>
                <button className="view-btn">View</button>
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
    </div>
  );
};

export default GuestDashboard;
