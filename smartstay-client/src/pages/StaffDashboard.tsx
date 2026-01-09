import React, { useState, useRef, useEffect } from 'react';
import { ClipboardList, CalendarCheck, User } from 'lucide-react';
import './StaffDashboard.css';
import type { RootState, AppDispatch } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasksByStaffThunk, updateTaskStatusThunk } from '../redux/staffTasksSlice';
import { useNavigate, useNavigation } from 'react-router-dom';
import { staffLogout } from '../redux/staffSlice';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  schedule: string;
}

const StaffDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const { currentStaff } = useSelector((state: RootState) => state.staff);
  const assignedTasks = useSelector((state: RootState) => state.staffTasks.tasks);

  const [activeTab, setActiveTab] =
    useState<'dashboard' | 'tasks' | 'profile'>('dashboard');

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch tasks for the logged-in staff
  useEffect(() => {
    if (currentStaff?.id) {
      dispatch(fetchTasksByStaffThunk(Number(currentStaff.id)));
    }
  }, [dispatch, currentStaff]);

  // Map backend tasks to local UI type
  const tasks: Task[] = assignedTasks.map(t => ({
    id: t.id.toString(),
    title: t.task_name,
    status:
      t.status === 'in_progress'
        ? 'in-progress'
        : t.status === 'completed'
        ? 'completed'
        : 'pending',
    schedule: new Date(t.assigned_at).toLocaleString(),
  }));

  // New function to handle task updates
  const updateTaskStatus = async (taskId: number, newStatus: 'in_progress' | 'completed') => {
  try {
    setLoadingTaskId(taskId);
    await dispatch(updateTaskStatusThunk({ taskId, status: newStatus })).unwrap();
    alert(`Task marked as ${newStatus === 'in_progress' ? 'in-progress' : 'completed'}`);
  } catch (err: any) {
    alert(`Failed to update task: ${err}`);
  } finally {
    setLoadingTaskId(null);
  }
};


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
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            <ClipboardList /><span>Dashboard</span>
          </button>
          <button className={activeTab === 'tasks' ? 'active' : ''} onClick={() => setActiveTab('tasks')}>
            <CalendarCheck /><span>My Tasks</span>
          </button>
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
            <User /><span>Profile</span>
          </button>

          <button
                className="logout-tab"
                onClick={() => {
                  dispatch(staffLogout());  // Clear guest state
                  navigate('/stafflogin');        // Redirect to login page
                }}
              >
                <User /> {/* You can replace this with a logout icon if you have one */}
                <span className="nav-label">Logout</span>
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
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Overview</button>
          <button className={activeTab === 'tasks' ? 'active' : ''} onClick={() => setActiveTab('tasks')}>Tasks</button>
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>Profile</button>
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
                <p>{tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length}</p>
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

                  <div className="task-buttons">
                    {task.status === 'pending' && (
  <>
    <button
      disabled={loadingTaskId === Number(task.id)}
      onClick={() => updateTaskStatus(Number(task.id), 'in_progress')}
    >
      {loadingTaskId === Number(task.id) ? 'Updating...' : 'Mark as In-Progress'}
    </button>
    <button
      disabled={loadingTaskId === Number(task.id)}
      onClick={() => updateTaskStatus(Number(task.id), 'completed')}
    >
      {loadingTaskId === Number(task.id) ? 'Updating...' : 'Mark as Completed'}
    </button>
  </>
)}

{task.status === 'in-progress' && (
  <button
    disabled={loadingTaskId === Number(task.id)}
    onClick={() => updateTaskStatus(Number(task.id), 'completed')}
  >
    {loadingTaskId === Number(task.id) ? 'Updating...' : 'Mark as Completed'}
  </button>
)}

                    {task.status === 'completed' && (
                      <button disabled>Completed</button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'profile' && ( <div className="profile-section"> <h2>Profile Settings</h2> <div className="profile-grid"> {/* Avatar */} <div className="avatar-section"> <div className="profile-avatar" onClick={() => fileInputRef.current?.click()} > {profileImage ? ( <img src={profileImage} alt="avatar" /> ) : ( <User /> )} </div> <div className="upload-hint">Tap avatar to upload</div> <input ref={fileInputRef} type="file" accept="image/*" className="file-input-hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setProfileImage(URL.createObjectURL(file)); } }} /> </div> {/* Form */} <div className="profile-form"> <label>First Name</label> <input type="text" placeholder="Staff" /> <label>Last Name</label> <input type="text" placeholder="Member" /> <label>Email</label> <input type="email" placeholder="staff@hotel.com" /> <label>Department</label> <input type="text" placeholder="Housekeeping / Maintenance" /> <button>Update Profile</button> </div> </div> </div> )}
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
