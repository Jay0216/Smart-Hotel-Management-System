import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, Bed, Settings, ClipboardList, Box } from 'lucide-react';
import type { RootState, AppDispatch } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/guestSlice';
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

const GuestDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'services' | 'profile'>('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', text: 'Your room booking is confirmed.', type: 'success', timestamp: '2025-12-15 10:00' },
    { id: '2', text: 'New housekeeping service available.', type: 'info', timestamp: '2025-12-15 12:30' }
  ]);
  const { currentGuest, token } = useSelector((state: RootState) => state.guest);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([
    { id: 'b1', room: 'Deluxe Room 101', status: 'Booked', checkIn: '2025-12-20', checkOut: '2025-12-22' },
    { id: 'b2', room: 'Suite 301', status: 'Checked-in', checkIn: '2025-12-10', checkOut: '2025-12-15' }
  ]);

  useEffect(() => {
    if (!token) {
      navigate('/guestauth'); // redirect if no token
    }
  }, [token, navigate]);

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
            <div className="cards-grid">
              <div className="card">
                <h3>Upcoming Bookings</h3>
                {bookings.filter(b => b.status === 'Booked').map(b => (
                  <div key={b.id} className="booking-card">
                    <strong>{b.room}</strong>
                    <p>{b.checkIn} - {b.checkOut}</p>
                  </div>
                ))}
                {bookings.filter(b => b.status === 'Booked').length === 0 && <p>No upcoming bookings</p>}
              </div>
              <div className="card">
                <h3>Checked-in Rooms</h3>
                {bookings.filter(b => b.status === 'Checked-in').map(b => (
                  <div key={b.id} className="booking-card">
                    <strong>{b.room}</strong>
                    <p>{b.checkIn} - {b.checkOut}</p>
                  </div>
                ))}
                {bookings.filter(b => b.status === 'Checked-in').length === 0 && <p>No active stays</p>}
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
