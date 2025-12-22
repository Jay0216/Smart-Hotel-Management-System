import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { registerGuestThunk, loginGuestThunk } from '../redux/guestSlice';
import './GuestAuth.css';
import { useNavigate } from 'react-router-dom';

const GuestAuthSystem: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentGuest, loading, error } = useSelector((state: RootState) => state.guest);

  const navigate = useNavigate();

  const [view, setView] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  useEffect(() => {
    if (error) setMessage({ type: 'error', text: error });
  }, [error]);

  useEffect(() => {
    if (currentGuest) {
      setMessage({ type: 'success', text: `Welcome, ${currentGuest.firstName}!` });
    }
  }, [currentGuest]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.length >= 8;

const handleRegister = async () => {
  setMessage(null);

  // --- Frontend validation ---
  if (!regFirstName.trim() || !regLastName.trim()) {
    setMessage({ type: 'error', text: 'Please enter your first and last name' });
    return;
  }
  if (!validateEmail(regEmail)) {
    setMessage({ type: 'error', text: 'Please enter a valid email address' });
    return;
  }
  if (!validatePassword(regPassword)) {
    setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
    return;
  }
  if (regPassword !== regConfirmPassword) {
    setMessage({ type: 'error', text: 'Passwords do not match' });
    return;
  }

  try {
    // Dispatch the thunk
    const resultAction = await dispatch(
      registerGuestThunk({
        firstName: regFirstName,
        lastName: regLastName,
        email: regEmail,
        password: regPassword,
      })
    );

    // Check if thunk fulfilled
    if (registerGuestThunk.fulfilled.match(resultAction)) {
      const successMessage = resultAction.payload.message || 'Account created successfully! Please login.';

      setMessage({ type: 'success', text: successMessage });

      // Clear form fields
      setRegFirstName('');
      setRegLastName('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');

      // Switch to login tab after short delay
      setTimeout(() => {
        setView('login');
        setMessage(null);
      }, 2000);

    } else {
      // Rejected case: extract message from payload or error
      const errorText =
        (resultAction.payload as string) ||
        resultAction.error?.message ||
        'Registration failed. Try again.';

      setMessage({ type: 'error', text: errorText });
    }
  } catch (err) {
    setMessage({ type: 'error', text: 'Registration failed. Try again.' });
  }
};


  const handleLogin = async () => {
    setMessage(null);

    if (!loginEmail || !loginPassword) return setMessage({ type: 'error', text: 'Enter email and password' });

    dispatch(loginGuestThunk({ email: loginEmail, password: loginPassword }));
    setLoginPassword('');
  };

  

  useEffect(() => {
    console.log('Current Guest:', currentGuest?.role);
    if (currentGuest) {
      setMessage({ type: 'success', text: `Welcome, ${currentGuest.firstName}! Redirecting...` });


      const timer = setTimeout(() => {
        navigate('/guestdashboard');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [currentGuest, navigate]);

  if (currentGuest) {
    return (
      <div className="auth-page">
        <div className="logged-in-card">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '5rem',
                height: '5rem',
                borderRadius: '50%',
                background: '#dcfce7',
                margin: '0 auto 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle style={{ width: '2.5rem', height: '2.5rem', color: '#166534' }} />
            </div>
            <h1>Welcome, {currentGuest.firstName}!</h1>
            <p>Redirecting you to the Guest Dashboard...</p>
            <div className="loader"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Guest Portal</h1>
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

          {view === 'login' ? (
            <>
              <div>
                <label>Email Address</label>
                <div className="input-group">
                  <Mail />
                  <input type="email" value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)} className="auth-input" placeholder="your.email@example.com" />
                </div>
              </div>
              <div>
                <label>Password</label>
                <div className="input-group">
                  <Lock />
                  <input type={showPassword?'text':'password'} value={loginPassword} onChange={(e)=>setLoginPassword(e.target.value)} className="auth-input" placeholder="Enter your password" />
                  <button className="toggle-password" onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff />:<Eye />}</button>
                </div>
              </div>
              <button className="auth-btn" onClick={handleLogin} disabled={loading}>{loading?'Logging in...':'Login'}</button>
            </>
          ) : (
            <>
              <div className="grid-2">
                <div>
                  <label>First Name</label>
                  <div className="input-group">
                    <User />
                    <input type="text" value={regFirstName} onChange={(e)=>setRegFirstName(e.target.value)} className="auth-input" placeholder="John"/>
                  </div>
                </div>
                <div>
                  <label>Last Name</label>
                  <div className="input-group">
                    <User />
                    <input type="text" value={regLastName} onChange={(e)=>setRegLastName(e.target.value)} className="auth-input" placeholder="Doe"/>
                  </div>
                </div>
              </div>
              <div>
                <label>Email Address</label>
                <div className="input-group">
                  <Mail />
                  <input type="email" value={regEmail} onChange={(e)=>setRegEmail(e.target.value)} className="auth-input" placeholder="your.email@example.com"/>
                </div>
              </div>
              <div>
                <label>Password</label>
                <div className="input-group">
                  <Lock />
                  <input type={showPassword?'text':'password'} value={regPassword} onChange={(e)=>setRegPassword(e.target.value)} className="auth-input" placeholder="Min. 8 characters"/>
                  <button className="toggle-password" onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff />:<Eye />}</button>
                </div>
              </div>
              <div>
                <label>Confirm Password</label>
                <div className="input-group">
                  <Lock />
                  <input type={showConfirmPassword?'text':'password'} value={regConfirmPassword} onChange={(e)=>setRegConfirmPassword(e.target.value)} className="auth-input" placeholder="Re-enter password"/>
                  <button className="toggle-password" onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword?<EyeOff />:<Eye />}</button>
                </div>
              </div>
              <button className="auth-btn" onClick={handleRegister} disabled={loading}>{loading?'Creating Account...':'Create Account'}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestAuthSystem;
