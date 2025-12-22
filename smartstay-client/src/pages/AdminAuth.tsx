import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { adminRegisterThunk, adminLoginThunk } from '../redux/adminSlice';
import './AdminAuth.css';
import { useNavigate } from 'react-router-dom';

const AdminAuthSystem: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const adminState = useSelector((state: RootState) => state.admin);
  const navigate = useNavigate();

  const [view, setView] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration fields
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

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
      const resultAction = await dispatch(
        adminRegisterThunk({ firstName: regFirstName, lastName: regLastName, email: regEmail, password: regPassword })
      );

      if ((resultAction as any).type.endsWith('fulfilled')) {
        setMessage({ type: 'success', text: 'Admin account created! Please login.' });
        setRegFirstName(''); setRegLastName(''); setRegEmail(''); setRegPassword(''); setRegConfirmPassword('');
        
        setTimeout(() => {
          setView('login');
          setMessage(null);
        }, 1000);
      } else {
        const errorMsg = (resultAction as any).payload || 'Registration failed';
        setMessage({ type: 'error', text: errorMsg });
      }
    } catch {
      setMessage({ type: 'error', text: 'Registration failed' });
    }
  };

  // === Login handler ===
  const handleLogin = async () => {
    setMessage(null);
    if (!loginEmail || !loginPassword) return setMessage({ type: 'error', text: 'Enter email and password' });

    try {
      const resultAction = await dispatch(adminLoginThunk({ email: loginEmail, password: loginPassword }));

      if ((resultAction as any).type.endsWith('fulfilled')) {
        setMessage({ type: 'success', text: `Welcome back!` });
        setLoginEmail(''); setLoginPassword('');
      } else {
        const errorMsg = (resultAction as any).payload || 'Login failed';
        setMessage({ type: 'error', text: errorMsg });
      }
    } catch {
      setMessage({ type: 'error', text: 'Login failed' });
    }
  };

  const currentAdmin = adminState.currentAdmin;

  useEffect(() => {
    if (currentAdmin) {
      setMessage({ type: 'success', text: `Welcome, ${currentAdmin.firstName}! Redirecting...` });

      const timer = setTimeout(() => {
        navigate('/admindashboard');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [currentAdmin, navigate]);

  if (currentAdmin) {
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
            <h1>Welcome, {currentAdmin.firstName}!</h1>
            <p>Redirecting to your dashboard...</p>
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
          <h1>Admin Portal</h1>
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
                  <input className="auth-input" type="email" value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)} placeholder="admin@example.com" />
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

              <button className="auth-btn" onClick={handleLogin} disabled={!loginEmail || !loginPassword}>{'Login'}</button>
            </>
          ) : (
            <>
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
                  <input className="auth-input" type="email" value={regEmail} onChange={(e)=>setRegEmail(e.target.value)} placeholder="admin@example.com"/>
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

              <button className="auth-btn" onClick={handleRegister} disabled={!regFirstName || !regLastName || !regEmail || !regPassword || !regConfirmPassword}>{'Create Admin Account'}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAuthSystem;
