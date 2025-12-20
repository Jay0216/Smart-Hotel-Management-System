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

  // Resources
const [rooms, setRooms] = useState([
  { id: '1', hotel: 'Main Branch', name: 'Deluxe 101', type: 'Deluxe', price: 150, capacity: 2, status: 'Available' }
]);

// Services
const [services, setServices] = useState([
  { 
    id: '1', 
    hotel: 'Main Branch', 
    name: 'Spa', 
    category: 'Wellness', 
    price: 100, 
    availability: 'Available',
    pricingType: 'Fixed'   // Add this
  }
]);



// Packages
const [packages, setPackages] = useState([
  { id: '1', hotel: 'Main Branch', name: 'Romantic Getaway', room: 'Suite 201', discount: 15 }
]);

// Room modal state
const [showRoomModal, setShowRoomModal] = useState(false);
const [editingRoom, setEditingRoom] = useState<any>(null);

// Service modal state
const [showServiceModal, setShowServiceModal] = useState(false);
const [editingService, setEditingService] = useState<any>(null);


// Add this state near your other states
const [tasks, setTasks] = useState([
  { id: '1', guest: 'John Doe', request: 'Room Cleaning', hotel: 'Main Branch', status: 'Pending' },
  { id: '2', guest: 'Jane Smith', request: 'Extra Towels', hotel: 'Main Branch', status: 'Pending' }
]);


// Add near your other states
const [staffMembers, setStaffMembers] = useState([
  { id: '1', name: 'Alice Johnson' },
  { id: '2', name: 'Bob Smith' },
  { id: '3', name: 'Charlie Lee' }
]);

const [showAssignModal, setShowAssignModal] = useState(false);
const [currentTask, setCurrentTask] = useState<any>(null);
const [selectedStaff, setSelectedStaff] = useState<string>('');





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
  <div className="card">
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <h2>Manage Rooms & Facilities, Packages</h2>
      <button
        onClick={() => {
          setEditingRoom(null);
          setShowRoomModal(true);
        }}
      >
        + Add Room
      </button>
    </div>

    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Hotel</th>
            <th>Room</th>
            <th>Type</th>
            <th>Price</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(r => (
            <tr key={r.id}>
              <td>{r.hotel}</td>
              <td>{r.name}</td>
              <td>{r.type}</td>
              <td>${r.price}</td>
              <td>{r.capacity}</td>
              <td>{r.status}</td>
              <td>
                <button
                  onClick={() => {
                    setEditingRoom(r);
                    setShowRoomModal(true);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

          {activeTab==='services' && (
  <div className="card">
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <h2>Manage Services Offered</h2>
      <button
        onClick={() => {
          setEditingService(null);
          setShowServiceModal(true);
        }}
      >
        + Add Service
      </button>
    </div>

    <div style={{ overflowX: 'auto', marginTop:'1rem' }}>
      <table style={{ width:'100%' }}>
        <thead>
          <tr>
            <th>Hotel / Branch</th>
            <th>Service Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Pricing Type</th>
            <th>Availability</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {services.map(s => (
            <tr key={s.id}>
              <td>{s.hotel}</td>
              <td>{s.name}</td>
              <td>{s.category}</td>
              <td>${s.price}</td>
              <td>{s.pricingType || 'Fixed'}</td>
              <td>{s.availability}</td>
              <td>
                <button
                  onClick={() => {
                    setEditingService(s);
                    setShowServiceModal(true);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


          {activeTab==='tasks' && (
  <div className="card">
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <h2>Guest Requests / Staff Tasks</h2>
    </div>

    <div style={{ overflowX: 'auto', marginTop:'1rem' }}>
      <table style={{ width:'100%' }}>
        <thead>
          <tr>
            <th>Guest</th>
            <th>Request</th>
            <th>Hotel / Branch</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(t => (
            <tr key={t.id}>
              <td>{t.guest}</td>
              <td>{t.request}</td>
              <td>{t.hotel}</td>
              <td>{t.status}</td>
              <td>
                <button
                  onClick={() => {
                    setCurrentTask(t);
                    setSelectedStaff('');
                    setShowAssignModal(true);
                  }}
                >
                  Assign
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

      {/* Room Add / Edit Modal */}
{showRoomModal && (
  <div className="chart-modal">
    <div className="chart-modal-content">
      <h2>{editingRoom ? 'Edit Room' : 'Add Room'}</h2>

      <input
        placeholder="Hotel / Branch"
        defaultValue={editingRoom?.hotel || ''}
      />
      <input
        placeholder="Room Name"
        defaultValue={editingRoom?.name || ''}
      />
      <input
        placeholder="Room Type"
        defaultValue={editingRoom?.type || ''}
      />
      <input
        type="number"
        placeholder="Price"
        defaultValue={editingRoom?.price || ''}
      />
      <input
        type="number"
        placeholder="Capacity"
        defaultValue={editingRoom?.capacity || ''}
      />

      <input
        type="file"
        accept="image/*"
      />

      <div className="chart-modal-actions">
        <button onClick={() => setShowRoomModal(false)}>Cancel</button>
        <button>
          {editingRoom ? 'Update Room' : 'Save Room'}
        </button>
      </div>
    </div>
  </div>
)}

{/* Service Add / Edit Modal */}
{showServiceModal && (
  <div className="chart-modal">
    <div className="chart-modal-content">
      <h2>{editingService ? 'Edit Service' : 'Add Service'}</h2>

      <input
        placeholder="Hotel / Branch"
        defaultValue={editingService?.hotel || ''}
      />
      <input
        placeholder="Service Name"
        defaultValue={editingService?.name || ''}
      />
      <input
        placeholder="Category"
        defaultValue={editingService?.category || ''}
      />
      <input
        type="number"
        placeholder="Price"
        defaultValue={editingService?.price || ''}
      />
      <select defaultValue={editingService?.pricingType || 'Fixed'}>
        <option value="Fixed">Fixed</option>
        <option value="Variable">Variable</option>
      </select>
      <select defaultValue={editingService?.availability || 'Available'}>
        <option value="Available">Available</option>
        <option value="Unavailable">Unavailable</option>
      </select>
      <input
        type="file"
        accept="image/*"
      />

      <div className="chart-modal-actions">
        <button onClick={() => setShowServiceModal(false)}>Cancel</button>
        <button>{editingService ? 'Update Service' : 'Save Service'}</button>
      </div>
    </div>
  </div>
)}

{showAssignModal && (
  <div className="chart-modal">
    <div className="chart-modal-content">
      <h2>Assign Task: {currentTask?.request}</h2>
      
      <label>Select Staff Member</label>
      <select
        value={selectedStaff}
        onChange={(e) => setSelectedStaff(e.target.value)}
      >
        <option value="">-- Select Staff --</option>
        {staffMembers.map(s => (
          <option key={s.id} value={s.name}>{s.name}</option>
        ))}
      </select>

      <div className="chart-modal-actions">
        <button onClick={() => setShowAssignModal(false)}>Cancel</button>
        <button
          onClick={() => {
            if (selectedStaff) {
              const updatedTasks = tasks.map(task =>
                task.id === currentTask.id
                  ? { ...task, status: `Assigned to ${selectedStaff}` }
                  : task
              );
              setTasks(updatedTasks);
              setShowAssignModal(false);
            } else {
              alert('Please select a staff member');
            }
          }}
        >
          Assign
        </button>
      </div>
    </div>
  </div>
)}




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
