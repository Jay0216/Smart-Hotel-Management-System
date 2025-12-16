// ReceptionistDashboard.tsx
import React, { useState, useRef } from 'react';
import {
  ClipboardList,
  LogIn,
  LogOut,
  Bed,
  User,
  Search,
  CreditCard
} from 'lucide-react';
import './ReceptionistDashboard.css';

interface Reservation {
  id: string;
  guestName: string;
  email: string;
  roomType: string;
  nights: number;
  amount: number;
  status: 'reserved' | 'checked-in' | 'checked-out';
}

interface Room {
  id: string;
  type: string;
  status: 'available' | 'occupied';
}

const ReceptionistDashboard: React.FC = () => {
  const [activeTab, setActiveTab] =
    useState<'dashboard' | 'walk-in' | 'reservations' | 'rooms' | 'billing' | 'profile'>('dashboard');

  const reservations: Reservation[] = [
    { id: 'R001', guestName: 'John Doe', email: 'john@mail.com', roomType: 'Deluxe', nights: 2, amount: 300, status: 'checked-in' },
    { id: 'R002', guestName: 'Jane Smith', email: 'jane@mail.com', roomType: 'Suite', nights: 3, amount: 600, status: 'reserved' },
  ];

  const rooms: Room[] = [
    { id: '101', type: 'Standard', status: 'available' },
    { id: '102', type: 'Deluxe', status: 'occupied' },
    { id: '103', type: 'Suite', status: 'available' },
  ];

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="reception-dashboard-page">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="avatar"><User /></div>
          <h2>Receptionist</h2>
          <p>Front Desk</p>
        </div>

        <nav className="sidebar-nav">
          {['dashboard','walk-in','reservations','rooms','billing','profile'].map(tab=>(
            <button
              key={tab}
              className={activeTab===tab?'active':''}
              onClick={()=>setActiveTab(tab as any)}
            >
              {tab==='dashboard' && <ClipboardList />}
              {tab==='walk-in' && <LogIn />}
              {tab==='reservations' && <Search />}
              {tab==='rooms' && <Bed />}
              {tab==='billing' && <CreditCard />}
              {tab==='profile' && <User />}
              <span>{tab.charAt(0).toUpperCase()+tab.slice(1)}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <h1>Receptionist Dashboard</h1>
        </header>

        <div className="tab-bar">
          {['dashboard','walk-in','reservations','rooms','billing','profile'].map(tab=>(
            <button
              key={tab}
              className={activeTab===tab?'active':''}
              onClick={()=>setActiveTab(tab as any)}
            >
              {tab.charAt(0).toUpperCase()+tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="dashboard-body">
          {activeTab==='dashboard' && (
            <div className="cards-grid">
              <div className="card"><h3>Total Reservations</h3><p>{reservations.length}</p></div>
              <div className="card"><h3>Available Rooms</h3><p>{rooms.filter(r=>r.status==='available').length}</p></div>
              <div className="card"><h3>Occupied Rooms</h3><p>{rooms.filter(r=>r.status==='occupied').length}</p></div>
            </div>
          )}

          {activeTab==='walk-in' && (
            <div className="walkin-wrapper">
              <div className="form-card wide">
                <h2>Manual Walk-In Check-In</h2>
                <input placeholder="Guest Name" />
                <input type="email" placeholder="Guest Email" />
                <input placeholder="NIC / Passport" />
                <select>
                  <option>Select Room Type</option>
                  <option>Standard</option>
                  <option>Deluxe</option>
                  <option>Suite</option>
                </select>
                <button><LogIn /> Check-In</button>
              </div>
            </div>
          )}

          {activeTab==='reservations' && (
            <div>
              <h2>Reservation Verification</h2>
              {reservations.map(r=>(
                <div key={r.id} className="booking-card">
                  <strong>{r.guestName}</strong>
                  <p>{r.email}</p>
                  <p>Room: {r.roomType}</p>
                  <p>Status: {r.status}</p>
                  <div className="booking-actions">
                    <button><LogIn /> Check-In</button>
                    <button className="checkout"><LogOut /> Check-Out</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab==='rooms' && (
            <div className="rooms-grid">
              {rooms.map(room=>(
                <div key={room.id} className={`room-card ${room.status}`}>
                  <strong>Room {room.id}</strong>
                  <p>{room.type}</p>
                  <p>{room.status}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab==='billing' && (
  <div className="billing-section">
    {reservations.filter(r=>r.status!=='checked-out').map(r=>(
      <div key={r.id} className="bill-card">
        <div className="bill-info">
          <strong>{r.guestName}</strong>
          <p>{r.email}</p>
          <p>{r.roomType} • {r.nights} Nights</p>
          <p className="total">Total: ${r.amount}</p>
        </div>

        <div className="bill-actions">
          <select>
            <option>Select Payment Method</option>
            <option>Cash</option>
            <option>Card</option>
            <option>Bank Transfer</option>
          </select>

          <button>
            <CreditCard /> Mark Paid & Check-Out
          </button>
        </div>
      </div>
    ))}
  </div>
)}


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
        </div>
      </main>
    </div>
  );
};

export default ReceptionistDashboard;
