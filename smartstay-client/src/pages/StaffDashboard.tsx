import React, { useState, useRef, useEffect } from 'react';
import { ClipboardList, CalendarCheck, Wrench, User } from 'lucide-react';
import './StaffDashboard.css';
import type { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  schedule: string;
}

const StaffDashboard: React.FC = () => {

  
  const [activeTab, setActiveTab] =
    useState<'dashboard' | 'tasks' | 'services' | 'profile'>('dashboard');

  const tasks: Task[] = [
    { id: '1', title: 'Clean Room 204', status: 'pending', schedule: 'Today 10:00 AM' },
    { id: '2', title: 'Maintenance – AC Check', status: 'in-progress', schedule: 'Today 1:00 PM' },
    { id: '3', title: 'Prepare Hall A', status: 'completed', schedule: 'Yesterday' },
  ];

  const { currentStaff } = useSelector((state: RootState) => state.staff);
  

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  



  return (
    <div className="staff-dashboard-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="avatar"><User /></div>
          <h2>{currentStaff?.firstName} {currentStaff?.lastName}</h2>
          <p>Hotel Staff</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            <ClipboardList /><span>Dashboard</span>
          </button>

          <button
            className={activeTab === 'tasks' ? 'active' : ''}
            onClick={() => setActiveTab('tasks')}
          >
            <CalendarCheck /><span>My Tasks</span>
          </button>

          <button
            className={activeTab === 'services' ? 'active' : ''}
            onClick={() => setActiveTab('services')}
          >
            <Wrench /><span>Service Requests</span>
          </button>

          <button
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            <User /><span>Profile</span>
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Staff Dashboard</h1>
        </header>

        {/* Tabs */}
        <div className="tab-bar">
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            Overview
          </button>
          <button className={activeTab === 'tasks' ? 'active' : ''} onClick={() => setActiveTab('tasks')}>
            Tasks
          </button>
          <button className={activeTab === 'services' ? 'active' : ''} onClick={() => setActiveTab('services')}>
            Services
          </button>
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
            Profile
          </button>
        </div>

        {/* Content */}
        <div className="dashboard-body">
          {activeTab === 'dashboard' && (
            <div className="cards-grid">
              <div className="card">
                <h3>Tasks Assigned</h3>
                <p>{tasks.length}</p>
              </div>
              <div className="card">
                <h3>Pending Tasks</h3>
                <p>{tasks.filter(t => t.status === 'pending').length}</p>
              </div>
              <div className="card">
                <h3>Completed</h3>
                <p>{tasks.filter(t => t.status === 'completed').length}</p>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <>
              <h2>My Tasks</h2>
              {tasks.map(task => (
                <div key={task.id} className="booking-card">
                  <strong>{task.title}</strong>
                  <p>Status: {task.status}</p>
                  <small>{task.schedule}</small>
                </div>
              ))}
            </>
          )}

          {activeTab === 'services' && (
            <>
              <h2>Service Requests</h2>
              <div className="service-buttons">
                <button>Housekeeping</button>
                <button>Maintenance</button>
                <button>Room Service</button>
              </div>
            </>
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

export default StaffDashboard;
