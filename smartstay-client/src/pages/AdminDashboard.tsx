import React, { useState, useRef } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bell, User, Settings, ClipboardList, Box, Bed, Eye, Download } from 'lucide-react';
import './AdminDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Notification {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'resources' | 'services' | 'tasks' | 'profile'>('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', text: 'New booking received', type: 'info', timestamp: '2025-12-16 09:00' },
    { id: '2', text: 'Staff task assigned', type: 'success', timestamp: '2025-12-16 10:30' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [chartModal, setChartModal] = useState<{ show: boolean, type: 'line' | 'bar', title: string, data: any }>({ show: false, type: 'line', title: '', data: null });
  const chartRef = useRef<any>(null);

  // Dummy chart data
  const occupancyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ label: 'Occupancy (%)', data: [60, 70, 80, 75, 90, 85, 70], borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.2)' }]
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{ label: 'Revenue ($)', data: [1200, 1500, 1100, 1800, 2000], backgroundColor: '#4f46e5' }]
  };

  const bookingTrendsData = {
    labels: ['Standard', 'Deluxe', 'Suite'],
    datasets: [{ label: 'Bookings', data: [25, 40, 15], backgroundColor: ['#2563eb', '#4f46e5', '#1d4ed8'] }]
  };

  const openChartModal = (type: 'line' | 'bar', title: string, data: any) => {
    setChartModal({ show: true, type, title, data });
  };

  const downloadChart = () => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image();
      const link = document.createElement('a');
      link.href = url;
      link.download = `${chartModal.title}.png`;
      link.click();
    }
  };

  return (
    <div className="admin-dashboard-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="avatar" onClick={() => fileInputRef.current?.click()}>
            {profileImage ? <img src={profileImage} alt="avatar" /> : <User />}
          </div>
          <h2>Admin Name</h2>
          <p>Administrator</p>
        </div>
        <nav className="sidebar-nav">
          <button className={activeTab==='dashboard'?'active':''} onClick={()=>setActiveTab('dashboard')}><ClipboardList /><span className="nav-label">Dashboard</span></button>
          <button className={activeTab==='resources'?'active':''} onClick={()=>setActiveTab('resources')}><Bed /><span className="nav-label">Resources</span></button>
          <button className={activeTab==='services'?'active':''} onClick={()=>setActiveTab('services')}><Box /><span className="nav-label">Services</span></button>
          <button className={activeTab==='tasks'?'active':''} onClick={()=>setActiveTab('tasks')}><Settings /><span className="nav-label">Tasks</span></button>
          <button className={activeTab==='profile'?'active':''} onClick={()=>setActiveTab('profile')}><User /><span className="nav-label">Profile</span></button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Welcome, Admin</h1>
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
                        <div key={n.id} className="notification-item">{n.text}<div className="timestamp">{n.timestamp}</div></div>
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
          <button className={activeTab==='resources'?'active':''} onClick={()=>setActiveTab('resources')}>Resources</button>
          <button className={activeTab==='services'?'active':''} onClick={()=>setActiveTab('services')}>Services</button>
          <button className={activeTab==='tasks'?'active':''} onClick={()=>setActiveTab('tasks')}>Tasks</button>
          <button className={activeTab==='profile'?'active':''} onClick={()=>setActiveTab('profile')}>Profile</button>
        </div>

        {/* Dashboard Body */}
        <div className="dashboard-body">
          {activeTab==='dashboard' && (
            <div className="cards-grid">
              <div className="card">
                <h3>Occupancy</h3>
                <Line data={occupancyData} options={{ responsive: true }} />
                <button className="chart-view-btn" onClick={() => openChartModal('line', 'Occupancy', occupancyData)}><Eye /> View</button>
              </div>
              <div className="card">
                <h3>Revenue</h3>
                <Bar data={revenueData} options={{ responsive: true }} />
                <button className="chart-view-btn" onClick={() => openChartModal('bar', 'Revenue', revenueData)}><Eye /> View</button>
              </div>
              <div className="card">
                <h3>Booking Trends</h3>
                <Bar data={bookingTrendsData} options={{ responsive: true }} />
                <button className="chart-view-btn" onClick={() => openChartModal('bar', 'Booking Trends', bookingTrendsData)}><Eye /> View</button>
              </div>
            </div>
          )}

          {activeTab==='resources' && (
            <div className="resources-section">
              <h2>Manage Rooms, Halls & Facilities</h2>
              <p>Here you can add, edit, or remove rooms, halls, and other resources.</p>
            </div>
          )}

          {activeTab==='services' && (
            <div className="services-section">
              <h2>Manage Services Offered</h2>
              <p>Add, edit, or remove services offered to guests.</p>
            </div>
          )}

          {activeTab==='tasks' && (
            <div className="tasks-section">
              <h2>Assign Tasks to Staff</h2>
              <p>Assign housekeeping, maintenance, or other tasks to staff members.</p>
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
                    onChange={(e) => { const f = e.target.files?.[0]; if(f) setProfileImage(URL.createObjectURL(f)); }}
                  />
                </div>
                <div className="profile-form">
                  <label>First Name</label>
                  <input type="text" placeholder="Admin" />
                  <label>Last Name</label>
                  <input type="text" placeholder="Name" />
                  <label>Email</label>
                  <input type="email" placeholder="admin@example.com" />
                  <label>Password</label>
                  <input type="password" placeholder="********" />
                  <button>Update Profile</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Chart Modal */}
      {chartModal.show && (
        <div className="chart-modal">
          <div className="chart-modal-content">
            <h2>{chartModal.title}</h2>
            {chartModal.type === 'line' ? (
              <Line ref={chartRef} data={chartModal.data} options={{ responsive:true }} />
            ) : (
              <Bar ref={chartRef} data={chartModal.data} options={{ responsive:true }} />
            )}
            <div className="chart-modal-actions">
              <button onClick={downloadChart}><Download /> Download</button>
              <button onClick={() => setChartModal({ ...chartModal, show: false })}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
