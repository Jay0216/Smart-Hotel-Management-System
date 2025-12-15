import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import './GuestAuth.css';

type UserRole = 'guest' | 'receptionist' | 'housekeeping' | 'admin';

interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  createdAt: string;
}

interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  users: User[];
  loginAttempts: Array<{
    email: string;
    timestamp: string;
    success: boolean;
  }>;
}

const GuestAuthSystem: React.FC = () => {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    currentUser: null,
    users: [],
    loginAttempts: []
  });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const checkDuplicateEmail = (email: string): boolean => {
    return authState.users.some(user => user.email.toLowerCase() === email.toLowerCase());
  };

  const handleRegister = () => {
    setLoading(true);
    setMessage(null);

    setTimeout(() => {
      if (!regFirstName.trim() || !regLastName.trim()) {
        setMessage({ type: 'error', text: 'Please enter your first and last name' });
        setLoading(false);
        return;
      }

      if (!validateEmail(regEmail)) {
        setMessage({ type: 'error', text: 'Please enter a valid email address' });
        setLoading(false);
        return;
      }

      if (checkDuplicateEmail(regEmail)) {
        setMessage({ type: 'error', text: 'An account with this email already exists' });
        setLoading(false);
        return;
      }

      if (!validatePassword(regPassword)) {
        setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
        setLoading(false);
        return;
      }

      if (regPassword !== regConfirmPassword) {
        setMessage({ type: 'error', text: 'Passwords do not match' });
        setLoading(false);
        return;
      }

      const newUser: User = {
        id: `guest_${Date.now()}`,
        email: regEmail.toLowerCase(),
        password: regPassword,
        role: 'guest',
        firstName: regFirstName,
        lastName: regLastName,
        createdAt: new Date().toISOString()
      };

      setAuthState(prev => ({
        ...prev,
        users: [...prev.users, newUser]
      }));

      setMessage({ 
        type: 'success', 
        text: 'Account created successfully! Please login to continue.' 
      });

      setRegFirstName('');
      setRegLastName('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
      setLoading(false);

      setTimeout(() => {
        setView('login');
        setMessage(null);
      }, 2000);
    }, 500);
  };

  const handleLogin = () => {
    setLoading(true);
    setMessage(null);

    setTimeout(() => {
      const user = authState.users.find(
        u => u.email.toLowerCase() === loginEmail.toLowerCase() && u.password === loginPassword
      );

      const loginAttempt = {
        email: loginEmail,
        timestamp: new Date().toISOString(),
        success: !!user
      };

      setAuthState(prev => ({
        ...prev,
        loginAttempts: [...prev.loginAttempts, loginAttempt]
      }));

      if (user) {
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          currentUser: user
        }));
        setMessage({ type: 'success', text: `Welcome back, ${user.firstName}!` });
      } else {
        setMessage({ type: 'error', text: 'Invalid email or password' });
      }

      setLoading(false);
    }, 500);
  };

  const handleLogout = () => {
    setAuthState(prev => ({
      ...prev,
      isAuthenticated: false,
      currentUser: null
    }));
    setLoginEmail('');
    setLoginPassword('');
    setMessage(null);
  };

  const handleLoginKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && loginEmail && loginPassword) {
      handleLogin();
    }
  };

  const handleRegisterKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && regFirstName && regLastName && regEmail && regPassword && regConfirmPassword) {
      handleRegister();
    }
  };

  if (authState.isAuthenticated && authState.currentUser) {
    return (
      <div className="auth-page">
        <div className="logged-in-card">
          <div style={{textAlign: 'center', marginBottom: '2rem'}}>
            <div style={{width: '5rem', height: '5rem', borderRadius: '50%', background: '#dcfce7', margin: '0 auto 1rem', display:'flex', alignItems:'center', justifyContent:'center'}}>
              <CheckCircle style={{width: '2.5rem', height:'2.5rem', color:'#166534'}} />
            </div>
            <h1>Welcome, {authState.currentUser.firstName}!</h1>
            <p>You are logged in as a Guest</p>
          </div>
          {/* Permissions & Account details can be converted similarly using divs and classes */}
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
              <button className="auth-btn" onClick={handleLogin} disabled={!loginEmail || !loginPassword || loading}>{loading?'Logging in...':'Login'}</button>
            </>
          ) : (
            <>
              {/* Register form: Name, email, password, confirm password */}
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
              <button className="auth-btn" onClick={handleRegister} disabled={loading || !regFirstName || !regLastName || !regEmail || !regPassword || !regConfirmPassword}>{loading?'Creating Account...':'Create Account'}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestAuthSystem;