import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, UserStar, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { adminRegisterThunk, adminLoginThunk } from '../redux/adminSlice';
import { receptionistRegisterThunk, receptionistLoginThunk } from '../redux/receptionSlice';
import { staffRegisterThunk, staffLoginThunk } from '../redux/staffSlice';
import './AdminAuth.css';
import { useNavigate } from 'react-router-dom';

type UserRole = 'admin' | 'receptionist' | 'staff';

const AdminAuthSystem: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const adminState = useSelector((state: RootState) => state.admin);
  const receptionistState = useSelector((state: RootState) => state.receptionist);
  const staffState = useSelector((state: RootState) => state.staff);

  const navigate = useNavigate();

  const [view, setView] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Login/Register fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<UserRole>('admin');

  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('receptionist');

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.length >= 8;

  // === Registration handler ===
  const handleRegister = async () => {
    setMessage(null);

    if (!regFirstName || !regLastName) return setMessage({ type: 'error', text: 'Enter first and last name' });
    if (!validateEmail(regEmail)) return setMessage({ type: 'error', text: 'Invalid email' });
    if (!validatePassword(regPassword)) return setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
    if (regPassword !== regConfirmPassword) return setMessage({ type: 'error', text: 'Passwords do not match' });

    try {
      let resultAction;
      if (regRole === 'admin') {
        resultAction = await dispatch(adminRegisterThunk({ firstName: regFirstName, lastName: regLastName, email: regEmail, password: regPassword }));
      } else if (regRole === 'receptionist') {
        resultAction = await dispatch(receptionistRegisterThunk({ firstName: regFirstName, lastName: regLastName, email: regEmail, password: regPassword }));
      } else {
        resultAction = await dispatch(staffRegisterThunk({ firstName: regFirstName, lastName: regLastName, email: regEmail, password: regPassword }));
      }

      if ((resultAction as any).type.endsWith('fulfilled')) {
        setMessage({ type: 'success', text: 'Account created successfully! Please login.' });
        setRegFirstName(''); setRegLastName(''); setRegEmail(''); setRegPassword(''); setRegConfirmPassword(''); setRegRole('receptionist');
        
        setTimeout(() => {
         setView('login');
         setMessage(null);
        }, 2000);
      } else {
        const errorMsg = (resultAction as any).payload || 'Registration failed';
        setMessage({ type: 'error', text: errorMsg });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Registration failed' });
    }
  };

  // === Login handler ===
  const handleLogin = async () => {
    setMessage(null);
    if (!loginEmail || !loginPassword) return setMessage({ type: 'error', text: 'Enter email and password' });

    try {
      let resultAction;
      if (loginRole === 'admin') {
        resultAction = await dispatch(adminLoginThunk({ email: loginEmail, password: loginPassword }));
      } else if (loginRole === 'receptionist') {
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

  // Determine current logged in user for display
  const currentUser = adminState.currentAdmin || receptionistState.user || staffState.currentStaff;

  useEffect(() => {
  if (currentUser) {
    setMessage({ type: 'success', text: `Welcome, ${currentUser.firstName}! Redirecting...` });

    const timer = setTimeout(() => {
      // Redirect based on role
      switch (currentUser.role) {
        case 'admin':
          navigate('/admindashboard');
          break;
        case 'receptionist':
          navigate('/receptionistdashboard');
          break;
        case 'staff':
          navigate('/staffdashboard');
          break;
        default:
          navigate('/'); // fallback
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

        <div className="auth-tabs">
          <div className={`auth-tab ${view==='login'?'active':'inactive'}`} onClick={()=>{setView('login'); setMessage(null);}}>Login</div>
          <div className={`auth-tab ${view==='register'?'active':'inactive'}`} onClick={()=>{setView('register'); setMessage(null);}}>Register</div>
        </div>

        <div className="auth-form">
          {message && (
            <div className={`message ${message.type}`}>
              {message.type==='success'?<CheckCircle style={{width:'1.25rem', height:'1.25rem'}} />:<AlertCircle style={{width:'1.25rem', height:'1.25rem'}} />}
              <span>{message.text}</span>
            </div>
          )}

          {view==='login' ? (
            <>
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
                    <option value="admin">Admin</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
              </div>

              <button className="auth-btn" onClick={handleLogin} disabled={!loginEmail || !loginPassword}>{'Login'}</button>
            </>
          ) : (
            <>
              {/* Registration fields remain the same, including role selection */}
              <div className="grid-2">
                <div>
                  <label>First Name</label>
                  <div className="input-group">
                    <User />
                    <input className="auth-input" type="text" value={regFirstName} onChange={(e)=>setRegFirstName(e.target.value)} placeholder="John"/>
                  </div>
                </div>
                <div>
                  <label>Last Name</label>
                  <div className="input-group">
                    <User />
                    <input className="auth-input" type="text" value={regLastName} onChange={(e)=>setRegLastName(e.target.value)} placeholder="Doe"/>
                  </div>
                </div>
              </div>

              <div>
                <label>Email Address</label>
                <div className="input-group">
                  <Mail />
                  <input className="auth-input" type="email" value={regEmail} onChange={(e)=>setRegEmail(e.target.value)} placeholder="your.email@example.com"/>
                </div>
              </div>

              <div>
                <label>Role</label>
                <div className="input-group">
                  <UserStar />
                  <select className="auth-input" value={regRole} onChange={(e) => setRegRole(e.target.value as UserRole)}>
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label>Password</label>
                <div className="input-group">
                  <Lock />
                  <input className="auth-input" type={showPassword?'text':'password'} value={regPassword} onChange={(e)=>setRegPassword(e.target.value)} placeholder="Min. 8 characters"/>
                  <button className="toggle-password" onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff />:<Eye />}</button>
                </div>
              </div>

              <div>
                <label>Confirm Password</label>
                <div className="input-group">
                  <Lock />
                  <input className="auth-input" type={showConfirmPassword?'text':'password'} value={regConfirmPassword} onChange={(e)=>setRegConfirmPassword(e.target.value)} placeholder="Re-enter password"/>
                  <button className="toggle-password" onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword?<EyeOff />:<Eye />}</button>
                </div>
              </div>

              <button className="auth-btn" onClick={handleRegister} disabled={!regFirstName || !regLastName || !regEmail || !regPassword || !regConfirmPassword}>{'Create Account'}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAuthSystem;
