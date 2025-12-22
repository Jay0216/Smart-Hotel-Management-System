import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, UserStar } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { receptionistLoginThunk } from '../redux/receptionSlice';
import { staffLoginThunk } from '../redux/staffSlice';
import { useNavigate } from 'react-router-dom';
import './StaffLogin.css';

type UserRole = 'receptionist' | 'staff';

const StaffLogin: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const receptionistState = useSelector((state: RootState) => state.receptionist);
  const staffState = useSelector((state: RootState) => state.staff);

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<UserRole>('receptionist');

  // === Login handler ===
  const handleLogin = async () => {
    setMessage(null);
    if (!loginEmail || !loginPassword) return setMessage({ type: 'error', text: 'Enter email and password' });

    try {
      let resultAction;
      if (loginRole === 'receptionist') {
        resultAction = await dispatch(receptionistLoginThunk({ email: loginEmail, password: loginPassword }));
      } else {
        resultAction = await dispatch(staffLoginThunk({ email: loginEmail, password: loginPassword }));
      }

      if ((resultAction as any).type.endsWith('fulfilled')) {
        setMessage({ type: 'success', text: `Welcome back!` });
        setLoginEmail(''); setLoginPassword('');
      } else {
        const errorMsg = (resultAction as any).payload || 'Login failed';
        setMessage({ type: 'error', text: errorMsg });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Login failed' });
    }
  };

  const currentUser = receptionistState.currentReceptionist || staffState.currentStaff;

  useEffect(() => {
    if (currentUser) {
      setMessage({ type: 'success', text: `Welcome, ${currentUser.firstName}! Redirecting...` });

      const timer = setTimeout(() => {
        // Redirect based on role
        switch (currentUser.role) {
          case 'receptionist':
            navigate('/receptionistdashboard');
            break;
          case 'staff':
            navigate('/staffdashboard');
            break;
          default:
            navigate('/');
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [currentUser, navigate]);

  if (currentUser) {
    return (
      <div className="auth-page">
        <div className="logged-in-card" style={{ background: '#f0f9ff' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '5rem',
                height: '5rem',
                borderRadius: '50%',
                background: '#dbeafe',
                margin: '0 auto 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle style={{ width: '2.5rem', height: '2.5rem', color: '#2563eb' }} />
            </div>
            <h1>Welcome, {currentUser.firstName}!</h1>
            <p>Role: {currentUser.role}. Redirecting to your dashboard...</p>
            <div className="loader"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ background: '#f9fafb' }}>
        <div className="auth-header" style={{ background: 'linear-gradient(to right, #4f46e5, #2563eb)' }}>
          <h1>Staff Portal</h1>
          <p>Hotel Management System</p>
        </div>

        <div className="auth-form">
          {message && (
            <div className={`message ${message.type}`}>
              {message.type==='success'?<CheckCircle style={{width:'1.25rem', height:'1.25rem'}} />:<AlertCircle style={{width:'1.25rem', height:'1.25rem'}} />}
              <span>{message.text}</span>
            </div>
          )}

          <div>
            <label>Email Address</label>
            <div className="input-group">
              <Mail />
              <input className="auth-input" type="email" value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)} placeholder="your.email@example.com" />
            </div>
          </div>

          <div>
            <label>Password</label>
            <div className="input-group">
              <Lock />
              <input className="auth-input" type={showPassword?'text':'password'} value={loginPassword} onChange={(e)=>setLoginPassword(e.target.value)} placeholder="Enter your password"/>
              <button className="toggle-password" onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff />:<Eye />}</button>
            </div>
          </div>

          <div>
            <label>Role</label>
            <div className="input-group">
              <UserStar />
              <select className="auth-input" value={loginRole} onChange={(e)=>setLoginRole(e.target.value as UserRole)}>
                <option value="receptionist">Receptionist</option>
                <option value="staff">Staff</option>
              </select>
            </div>
          </div>

          <button className="auth-btn" onClick={handleLogin} disabled={!loginEmail || !loginPassword}>{'Login'}</button>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;

