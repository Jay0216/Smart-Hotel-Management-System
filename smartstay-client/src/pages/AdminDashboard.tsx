import React, { useState, useRef, useEffect } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { addRoomAsync, fetchRoomsAsync } from '../redux/roomSlice';
import { addServiceAsync, fetchServicesAsync } from '../redux/serviceSlice';
import { staffRegisterThunk } from '../redux/staffSlice';
import { receptionistRegisterThunk } from '../redux/receptionSlice';
import { fetchAllStaffUsersThunk } from '../redux/allStaffUsersSlice';
import {
  fetchAllServiceRequests,
  fetchBranchServiceRequests,
  updateServiceRequestStatus
} from '../redux/serviceRequestSlice';

import { fetchAssignableStaffThunk } from '../redux/staffSlice';
import { assignTaskThunk, fetchAssignedTasksThunk } from '../redux/staffTasksSlice';
import { fetchOccupancy, fetchRevenue, fetchBookingTrends } from "../redux/dashboardSlice";
import { adminLogout } from '../redux/adminSlice';
import { useNavigate } from 'react-router-dom';





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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'resources' | 'services' | 'tasks' | 'staff' | 'profile'>('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', text: 'New booking received', type: 'info', timestamp: '2025-12-16 09:00' },
    { id: '2', text: 'Staff task assigned', type: 'success', timestamp: '2025-12-16 10:30' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { rooms = [], loading, error } = useSelector((state: RootState) => state.rooms);
  const { services = [], loading: serviceLoading, error: serviceError } = useSelector((state: RootState) => state.services);
  
  const chartRef = useRef<any>(null);
  const navigate = useNavigate()

  // Dummy chart data
  const { occupancy, revenue, bookingTrends, loading: dashboardLoading, error: dashboardError } = useSelector(
    (state: RootState) => state.dashboard
  );

  const [chartModal, setChartModal] = useState<{ show: boolean; type: "line" | "bar"; title: string; data: any }>({
    show: false,
    type: "line",
    title: "",
    data: null
  });

  useEffect(() => {
    dispatch(fetchOccupancy());
    dispatch(fetchRevenue());
    dispatch(fetchBookingTrends());
  }, [dispatch]);

  const openChartModal = (type: "line" | "bar", title: string, data: any) => {
    setChartModal({ show: true, type, title, data });
  };

  // Transform slice data into Chart.js format
  const occupancyData = {
    labels: occupancy.labels,
    datasets: [
      {
        label: "Occupancy (%)",
        data: occupancy.data,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.2)",
        fill: true,
      },
    ],
  };

  const revenueData = {
    labels: revenue.labels,
    datasets: [
      {
        label: "Revenue (LKR)",
        data: revenue.data,
        backgroundColor: "#4f46e5",
      },
    ],
  };

  const bookingTrendsData = {
    labels: bookingTrends.labels,
    datasets: [
      {
        label: "Bookings",
        data: bookingTrends.data,
        backgroundColor: ["#2563eb", "#4f46e5", "#1d4ed8"],
      },
    ],
  };


  useEffect(() => {
    dispatch(fetchRoomsAsync());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchServicesAsync());
  }, [dispatch]);

  // Resources






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

// Room form state
const [roomForm, setRoomForm] = useState({
  branchName: '',
  country: '',
  roomName: '',
  roomType: '',
  price: '',
  capacity: '',
});

const [selectedImages, setSelectedImages] = useState<File[]>([]);


const handleRoomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setRoomForm(prev => ({ ...prev, [name]: value }));
};

const handleRoomImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const newFiles = Array.from(e.target.files);
    setSelectedImages(prev => [
      ...prev,
      ...newFiles.filter(nf => !prev.some(f => f.name === nf.name))
    ]);
  }
};


const handleAddRoom = async () => {
  const { branchName, country, roomName, roomType, price, capacity } = roomForm;

  if (!branchName || !country || !roomName || !roomType || !price || !capacity) {
    alert('Please fill all fields');
    return;
  }

  const formData = new FormData();
  formData.append('branchName', branchName);
  formData.append('country', country);
  formData.append('roomName', roomName);
  formData.append('roomType', roomType);
  formData.append('price', price);
  formData.append('capacity', capacity);

  selectedImages.forEach(img => formData.append('images', img));

  try {
    await dispatch(addRoomAsync(formData)).unwrap();
    setShowRoomModal(false);
    setRoomForm({
      branchName: '',
      country: '',
      roomName: '',
      roomType: '',
      price: '',
      capacity: '',
    });
    setSelectedImages([]);
    alert('Room added successfully!');
  } catch (err: any) {
    alert(err.message || 'Failed to add room');
  }
};



// Service form state
const [serviceForm, setServiceForm] = useState({
  branchName: '',
  country: '',
  name: '',
  category: '',
  price: '',
  pricingType: 'Fixed',
});
const [serviceImages, setServiceImages] = useState<File[]>([]);


const handleServiceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setServiceForm(prev => ({ ...prev, [name]: value }));
};

const handleServiceImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const newFiles = Array.from(e.target.files);
    setServiceImages(prev => [
      ...prev,
      ...newFiles.filter(nf => !prev.some(f => f.name === nf.name))
    ]);
  }
};

const handleAddService = async () => {
  const { branchName, country, name, category, price, pricingType } = serviceForm;

  if (!branchName || !country || !name || !price) {
    alert('Please fill all required fields');
    return;
  }

  const formData = new FormData();
  formData.append('branchName', branchName);
  formData.append('country', country);
  formData.append('name', name);
  formData.append('category', category);
  formData.append('price', price);
  formData.append('pricingType', pricingType);

  serviceImages.forEach(img => formData.append('images', img));

  try {
    await dispatch(addServiceAsync(formData)).unwrap();

    setServiceForm({
      branchName: '',
      country: '',
      name: '',
      category: '',
      price: '',
      pricingType: 'Fixed',
    });

    setServiceImages([]);
    setShowServiceModal(false);
    alert('Service added successfully!');
  } catch (err: any) {
    alert(err.message || 'Failed to add service');
  }
};

const [staffList, setStaffList] = useState([
  { id: '1', name: 'Alice Johnson', role: 'Staff', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', role: 'Receptionist', email: 'bob@example.com' },
]);

const [showStaffModal, setShowStaffModal] = useState(false);
const [editingStaff, setEditingStaff] = useState<any>(null);
const [staffForm, setStaffForm] = useState({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'Staff',
  branch: ''
});

const handleStaffInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setStaffForm(prev => ({ ...prev, [name]: value }));
};

const handleAddStaff = async () => {
  const { firstName, lastName, email, password, role, branch } = staffForm;

  if (!firstName || !lastName || !email || !password || !role || !branch) {
    alert('Please fill all required fields');
    return;
  }

  const payload = {
    firstName,
    lastName,
    email,
    password,
    branch,
  };

  console.log('Registering staff with payload:', payload);

  try {
    if (role === 'Staff') {
      await dispatch(staffRegisterThunk(payload)).unwrap();
    } else if (role === 'Receptionist') {
      await dispatch(receptionistRegisterThunk(payload)).unwrap();
    }

    alert(`${role} added successfully!`);
    setShowStaffModal(false);

    // Reset form
    setStaffForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'Staff',
      branch: ''
    });

    dispatch(fetchAllStaffUsersThunk());

    // Optionally refresh staff list
    // fetchStaffByRole(role);
  } catch (err: any) {
    alert(err.message || `Failed to add ${role}`);
  }
};



const {
  users: allStaff,
  loading: loadingStaff,
  error: staffError
} = useSelector((state: RootState) => state.allstaff);

useEffect(() => {
  dispatch(fetchAllStaffUsersThunk());
}, [dispatch]);



  const downloadChart = () => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image();
      const link = document.createElement('a');
      link.href = url;
      link.download = `${chartModal.title}.png`;
      link.click();
    }
  };

  const {
  requests: serviceRequests, loading: requestsLoading, error: requestsError
} = useSelector((state: RootState) => state.serviceRequests);



useEffect(() => {
  if (activeTab === 'tasks') {
    dispatch(fetchAllServiceRequests());
  }
}, [dispatch, activeTab]);


  const { assignableStaff } = useSelector((state: RootState) => state.staff);

  useEffect(() => {
   if (showAssignModal && currentTask) {
    dispatch(fetchAssignableStaffThunk(currentTask.branch_id));
   }
}, [dispatch, showAssignModal, currentTask]);

const [taskName, setTaskName] = useState('');
const [taskNotes, setTaskNotes] = useState('');


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
          <button className={activeTab==='staff'?'active':''} onClick={()=>setActiveTab('staff')}><User /><span className="nav-label">Staff</span></button>
          <button className={activeTab==='tasks'?'active':''} onClick={()=>setActiveTab('tasks')}><Settings /><span className="nav-label">Tasks</span></button>
          <button className={activeTab==='profile'?'active':''} onClick={()=>setActiveTab('profile')}><User /><span className="nav-label">Profile</span></button>

          <button
              className="logout-tab"
              onClick={() => {
              dispatch(adminLogout());  // Clear guest state
              navigate('/adminauth');        // Redirect to login page
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
          <button className={activeTab==='staff'?'active':''} onClick={()=>setActiveTab('staff')}>Staff</button>

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
              <td>{r.branch_name}</td>
              <td>{r.room_name}</td>
              <td>{r.room_type}</td>
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {services.map(s => (
            <tr key={s.id}>
              <td>{s.branch_name}</td>
              <td>{s.name}</td>
              <td>{s.category}</td>
              <td>${s.price}</td>
              <td>{s.pricing_type || 'Fixed'}</td>
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

{activeTab === 'tasks' && (
  <div className="card">
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <h2>Guest Service Requests</h2>
    </div>

    <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Guest</th>
            <th>Service</th>
            <th>Note</th>
            <th>Branch</th> {/* Show branch name instead of ID */}
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {requestsLoading ? (
            <tr>
              <td colSpan={6}>Loading requests...</td>
            </tr>
          ) : requestsError ? (
            <tr>
              <td colSpan={6}>{requestsError}</td>
            </tr>
          ) : serviceRequests.length === 0 ? (
            <tr>
              <td colSpan={6}>No service requests</td>
            </tr>
          ) : (
            serviceRequests.map((req) => (
              <tr key={req.request_id}>
                {/* Guest */}
                <td>
                  {req.guest_first_name} {req.guest_last_name}
                </td>

                {/* Service */}
                <td>{req.service_name}</td>

                {/* Note */}
                <td>{req.request_note || '—'}</td>

                {/* Branch */}
                <td>{req.branch_name || '—'}</td>

                {/* Status */}
                <td style={{ textTransform: 'capitalize' }}>{req.status}</td>

                {/* Action */}
                <td>
                  {req.status === 'pending' && (
                    <button
                      onClick={() => {
        setCurrentTask(req);             // store the current task
        setShowAssignModal(true);        // open modal
        dispatch(fetchAssignableStaffThunk(req.branch_id)); // fetch staff for this branch
      }}
                    >
                      Assign
                    </button>
                  )}
                  {req.status === 'in_progress' && <span>Assigned</span>}
                  {req.status === 'completed' && <span>Completed</span>}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)}



         

{activeTab==='staff' && (
  <div className="card">
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <h2>Manage Staff & Receptionists</h2>
      <button onClick={() => { setEditingStaff(null); setShowStaffModal(true); }}>+ Add Staff</button>
    </div>

    <div style={{ overflowX:'auto', marginTop:'1rem' }}>
      <table style={{ width:'100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Branch ID</th>
            <th>Action</th>
          </tr>
        </thead>
        
<tbody>
{loadingStaff ? (
  <tr><td colSpan={4}>Loading...</td></tr>
) : staffError ? (
  <tr><td colSpan={4}>{staffError}</td></tr>
) : (!allStaff || allStaff.length === 0) ? ( // ✅ guard added
  <tr><td colSpan={4}>No staff found</td></tr>
) : (
  allStaff.map(s => (
    <tr key={s.id}>
      <td>{s.first_name}</td>
      <td>{s.email}</td>
      <td>{s.role}</td>
      <td>{s.branch}</td>
      <td>
        <button onClick={() => setShowStaffModal(true)}>Edit</button>
      </td>
    </tr>
  ))
)}
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

{showRoomModal && (
  <div className="chart-modal">
    <div className="chart-modal-content">
      <h2>{editingRoom ? 'Edit Room' : 'Add Room'}</h2>

      <input
        name="branchName"
        placeholder="Hotel / Branch Name"
        value={roomForm.branchName}
        onChange={handleRoomInputChange}
      />

      <input
        name="country"
        placeholder="Country"
        value={roomForm.country}
        onChange={handleRoomInputChange}
      />

      <input
        name="roomName"
        placeholder="Room Name"
        value={roomForm.roomName}
        onChange={handleRoomInputChange}
      />

      <input
        name="roomType"
        placeholder="Room Type"
        value={roomForm.roomType}
        onChange={handleRoomInputChange}
      />

      <input
        name="price"
        type="number"
        placeholder="Price"
        value={roomForm.price}
        onChange={handleRoomInputChange}
      />

      <input
        name="capacity"
        type="number"
        placeholder="Capacity"
        value={roomForm.capacity}
        onChange={handleRoomInputChange}
      />

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleRoomImagesChange}
      />

      {/* Show selected images */}
      {selectedImages.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          {selectedImages.map((img, idx) => (
            <img
              key={idx}
              src={URL.createObjectURL(img)}
              alt={`Selected ${idx}`}
              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 5 }}
            />
          ))}
        </div>
      )}

      <div className="chart-modal-actions">
        <button onClick={() => setShowRoomModal(false)}>Cancel</button>
        <button onClick={handleAddRoom}>
          {editingRoom ? 'Update Room' : 'Save Room'}
        </button>
      </div>
    </div>
  </div>
)}



{showServiceModal && (
  <div className="chart-modal">
    <div className="chart-modal-content">
      <h2>{editingService ? 'Edit Service' : 'Add Service'}</h2>

      {/* Branch / Hotel */}
      <input
        name="branchName"
        placeholder="Hotel / Branch"
        value={serviceForm.branchName}
        onChange={handleServiceInputChange}
      />

      {/* Country */}
      <input
        name="country"
        placeholder="Country"
        value={serviceForm.country}
        onChange={handleServiceInputChange}
      />

      {/* Service Name */}
      <input
        name="name"
        placeholder="Service Name"
        value={serviceForm.name}
        onChange={handleServiceInputChange}
      />

      {/* Category */}
      <input
        name="category"
        placeholder="Category"
        value={serviceForm.category}
        onChange={handleServiceInputChange}
      />

      {/* Price */}
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={serviceForm.price}
        onChange={handleServiceInputChange}
      />

      {/* Pricing Type (Fixed / Variable) */}
      <div className="pricing-type-group">
        <label>Pricing Type</label>
        <div className="pricing-options">
          <button
            type="button"
            className={serviceForm.pricingType === 'Fixed' ? 'active' : ''}
            onClick={() => setServiceForm(p => ({ ...p, pricingType: 'Fixed' }))}
          >
            Fixed
          </button>
          <button
            type="button"
            className={serviceForm.pricingType === 'Variable' ? 'active' : ''}
            onClick={() => setServiceForm(p => ({ ...p, pricingType: 'Variable' }))}
          >
            Variable
          </button>
        </div>
      </div>

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleServiceImagesChange}
      />

      {/* Selected Images Preview */}
      {serviceImages.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          {serviceImages.map((img, idx) => (
            <img
              key={idx}
              src={URL.createObjectURL(img)}
              alt={`Selected ${idx}`}
              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 5 }}
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="chart-modal-actions">
        <button onClick={() => setShowServiceModal(false)}>Cancel</button>
        <button onClick={handleAddService}>
          {editingService ? 'Update Service' : 'Save Service'}
        </button>
      </div>
    </div>
  </div>
)}

{showStaffModal && (
  <div className="chart-modal">
    <div className="chart-modal-content">
      <h2>{editingStaff ? 'Edit Staff / Receptionist' : 'Add Staff / Receptionist'}</h2>

      <input
        name="firstName"
        placeholder="First Name"
        value={staffForm.firstName}
        onChange={handleStaffInputChange}
      />

      <input
        name="lastName"
        placeholder="Last Name"
        value={staffForm.lastName}
        onChange={handleStaffInputChange}
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={staffForm.email}
        onChange={handleStaffInputChange}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={staffForm.password}
        onChange={handleStaffInputChange}
      />

      <select name="role" value={staffForm.role} onChange={handleStaffInputChange}>
        <option value="Staff">Staff</option>
        <option value="Receptionist">Receptionist</option>
      </select>

      <select name="branch" value={staffForm.branch} onChange={handleStaffInputChange}>
        <option value="">-- Select Branch --</option>
        <option value="Colombo Grand">Colombo Grand</option>
        <option value="Hilltop Retreat">Hilltop Retreat</option>
        <option value="Ocean Pearl Resort">Ocean Pearl Resort</option>
        <option value="Royal Heritage">Royal Heritage</option>
      </select>

      <div className="chart-modal-actions">
        <button onClick={() => setShowStaffModal(false)}>Cancel</button>
        <button onClick={handleAddStaff}>{editingStaff ? 'Update' : 'Add'}</button>
      </div>
    </div>
  </div>
)}




{showAssignModal && currentTask && (
  <div className="chart-modal">
    <div className="chart-modal-content">
      <h2>Assign Task: {currentTask.service_name}</h2>

      
      <select
        value={selectedStaff}
        onChange={(e) => setSelectedStaff(e.target.value)}
      >
        <option value="">-- Select Staff --</option>
        {assignableStaff.map(s => (
          <option key={s.staff_id} value={s.staff_id}>
            {s.first_name} {s.last_name} ({s.branch_name})
          </option>
        ))}
      </select>

      
      <input
        type="text"
        placeholder="Enter task name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />

      
      <textarea
        placeholder="Enter notes"
        value={taskNotes}
        onChange={(e) => setTaskNotes(e.target.value)}
      />

      <div className="chart-modal-actions">
        <button onClick={() => setShowAssignModal(false)}>Cancel</button>
        <button
          onClick={async () => {
            if (!selectedStaff) {
              alert('Please select a staff member');
              return;
            }

            try {
              await dispatch(assignTaskThunk({
                requestId: currentTask.request_id,
                staffId: Number(selectedStaff),
                taskName: taskName || undefined,
                notes: taskNotes || undefined,
              })).unwrap();

              alert('Task assigned successfully!');
              setShowAssignModal(false);
              setSelectedStaff('');
              setCurrentTask(null);

              // Optionally refetch tasks
              dispatch(fetchAssignedTasksThunk());

            } catch (err: any) {
              alert(err.message || 'Failed to assign task');
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
