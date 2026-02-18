import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';
import '../styles/Login.css';

/**
 * Login.jsx - The Auth Gate / Entry Vault (Section 1)
 * 
 * Path: /gate
 * Philosophy: "High-End Entry Vault" - Minimal, Professional, Secure
 * 
 * Features:
 * - Glassmorphism card design (backdrop-filter: blur(40px))
 * - Deep Charcoal background with soft gradient glow
 * - Gold/Blue accent for button (uses --secondary-color)
 * - Large, elegant PENUEL branding above form
 * - Role-based authentication
 * - localStorage persistence
 * - Redirect to /dashboard on success
 * - Fade-in and slide-up animation (1.2s)
 * - Tech-empire footer: "Secure Server: Penuel-HQ-01"
 * 
 * Role Logic:
 * - owner@penuel.com → userRole: 'owner'
 * - secretary@penuel.com → userRole: 'secretary'
 * - Others → error message
 */

const VALID_CREDENTIALS = {
  'owner@penuel.com': 'owner',
  'secretary@penuel.com': 'secretary',
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Validate email exists in our system
    if (!VALID_CREDENTIALS[email]) {
      setError('Invalid email. Please use owner@penuel.com or secretary@penuel.com');
      setLoading(false);
      return;
    }

    // Simple password validation (minimum 6 characters)
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Get user role
    const userRole = VALID_CREDENTIALS[email];

    // Store in localStorage
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('isAuthenticated', 'true');

    console.log(`✨ Login successful: ${email} (${userRole})`);

    // Redirect to dashboard
    navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div className="login-container">
      {/* Soft gradient background glow */}
      <div className="login-background-glow"></div>

      {/* Main login vault */}
      <div className="login-vault">
        {/* Branding: Large PENUEL heading */}
        <div className="login-branding">
          <h1>PENUEL</h1>
          <p>Empire Gateway</p>
        </div>

        {/* Login Card with glassmorphism */}
        <div className="login-card">
          {/* Card Header */}
          <div className="login-header">
            <div className="login-icon">
              <ShieldCheck size={32} />
            </div>
            <h2>Access the Portal</h2>
            <p className="login-subtitle">Secure entry for authorized personnel</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="login-form">
            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="owner@penuel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Enter Portal'}
            </button>
          </form>

          {/* Card Footer */}
          <div className="login-footer">
            <p className="demo-note">
              Demo Credentials:<br />
              <code>owner@penuel.com</code> or <code>secretary@penuel.com</code><br />
              Password: any 6+ characters
            </p>
          </div>
        </div>
      </div>

      {/* Tech-Empire Footer */}
      <div className="login-tech-footer">
        <code>Secure Server: Penuel-HQ-01</code>
      </div>
    </div>
  );
};

export default Login;
