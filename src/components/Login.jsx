import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';
import '../styles/Login.css';

/**
 * Login.jsx — Multi-Department Credential Version
 *
 * ARCHITECTURE:
 * ─────────────────────────────────────────────────────────────────────────────
 * Each entry in CREDENTIAL_MAP carries three fields:
 *
 *   password  — exact-match string (case-sensitive). No length-only bypass.
 *   role      — 'owner' | 'staff'. Controls which routes ProtectedRoute grants
 *               access to. Owner has master access. Staff access is scoped by
 *               dept (enforced in ProtectedRoute via requiredDept).
 *   dept      — 'executive' | 'carwash' | 'service' | 'restaurant' |
 *               'supermarket'. Stored in localStorage as 'userDept'. Used by:
 *                 • DashboardLayout  → passes dept to child pages as a prop
 *                 • OperationsFeed   → filters task list to this dept only
 *                 • Sidebar          → hides irrelevant nav items
 *                 • ProtectedRoute   → dept-gated routes (requiredDept prop)
 *
 * REDIRECT LOGIC:
 * ─────────────────────────────────────────────────────────────────────────────
 *   owner  → /dashboard          (full executive overview)
 *   staff  → /dashboard/operations  (dept-filtered task feed, no overview)
 *
 * SECURITY NOTES (unchanged from previous version):
 * ─────────────────────────────────────────────────────────────────────────────
 *   • Both unknown-email and wrong-password return the SAME error string.
 *     This prevents user enumeration — an attacker cannot tell which field
 *     was wrong.
 *   • Credentials are still client-side. Acceptable for local/demo only.
 *   • MILESTONE 2: Replace with POST /api/auth/login → JWT in HttpOnly cookie.
 */

// ─────────────────────────────────────────────────────────────────────────────
// CREDENTIAL MAP
// key    : normalised email (lowercase)
// value  : { password, role, dept }
//
// To add a new department: add one entry here + define its route access in
// ProtectedRoute.jsx and its task filter in OperationsFeed.jsx.
// ─────────────────────────────────────────────────────────────────────────────
const CREDENTIAL_MAP = {
  'owner@penuel.com': {
    password: 'PenuelOwner2026',
    role:     'owner',
    dept:     'executive',
  },
  'carwash@penuel.com': {
    password: 'WashStaff2026',
    role:     'staff',
    dept:     'carwash',
  },
  'service@penuel.com': {
    password: 'ServiceStaff2026',
    role:     'staff',
    dept:     'service',
  },
  'food@penuel.com': {
    password: 'RestoStaff2026',
    role:     'staff',
    dept:     'restaurant',
  },
  'market@penuel.com': {
    password: 'MarketStaff2026',
    role:     'staff',
    dept:     'supermarket',
  },
};

// Shared by both failure branches — prevents enumeration.
const AUTH_ERROR_MSG = 'Invalid credentials. Please check your email and password.';

// Where each role lands after a successful login.
const POST_LOGIN_ROUTE = {
  owner: '/dashboard',
  staff: '/dashboard/operations',
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const Login = () => {
  const navigate = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  /**
   * handleLogin
   *
   * Step 1 — Email lookup (case-insensitive via normalisation at map-key level).
   * Step 2 — Exact password match (case-sensitive).
   * Step 3 — Write session data to localStorage:
   *             'isAuthenticated' = 'true'
   *             'userRole'        = entry.role   ('owner' | 'staff')
   *             'userDept'        = entry.dept   ('executive' | 'carwash' | ...)
   *             'userEmail'       = normalised email
   * Step 4 — Navigate to the role-specific landing route.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate async latency; swap for real fetch in Milestone 2.
    await new Promise((resolve) => setTimeout(resolve, 600));

    const normalisedEmail = email.trim().toLowerCase();
    const entry           = CREDENTIAL_MAP[normalisedEmail];

    // Steps 1 & 2 — identical error message for both failure modes.
    if (!entry || password !== entry.password) {
      setError(AUTH_ERROR_MSG);
      setLoading(false);
      return;
    }

    // Step 3 — persist the minimum session payload.
    // MILESTONE 2: replace with JWT in HttpOnly cookie + remove localStorage.
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole',        entry.role);
    localStorage.setItem('userDept',        entry.dept);
    localStorage.setItem('userEmail',       normalisedEmail);

    if (import.meta.env.DEV) {
      console.log(
        `[Login] Auth success → role: ${entry.role} | dept: ${entry.dept}`
      );
    }

    // Step 4 — role-differentiated redirect.
    navigate(POST_LOGIN_ROUTE[entry.role] ?? '/dashboard');
    setLoading(false);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="login-container">
      <div className="login-background-glow"></div>

      <div className="login-vault">
        <div className="login-branding">
          <h1>PENUEL</h1>
          <p>Empire Gateway</p>
        </div>

        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <ShieldCheck size={32} />
            </div>
            <h2>Access the Portal</h2>
            <p className="login-subtitle">Secure entry for authorized personnel</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">

            {/* ── Email ── */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* ── Password ── */}
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
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {/* ── Error ── */}
            {error && (
              <div className="error-message" role="alert" aria-live="polite">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* ── Submit ── */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Enter Portal'}
            </button>
          </form>

          {/* DEV-ONLY credential cheatsheet — tree-shaken from production build */}
          {import.meta.env.DEV && (
            <div className="login-footer">
              <p className="demo-note">
                <strong>Dev credentials</strong><br />
                <code>owner@penuel.com</code>   / <code>PenuelOwner2026</code>  — Owner (executive)<br />
                <code>carwash@penuel.com</code>  / <code>WashStaff2026</code>   — Staff (carwash)<br />
                <code>service@penuel.com</code>  / <code>ServiceStaff2026</code>— Staff (service)<br />
                <code>food@penuel.com</code>     / <code>RestoStaff2026</code>  — Staff (restaurant)<br />
                <code>market@penuel.com</code>   / <code>MarketStaff2026</code> — Staff (supermarket)
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="login-tech-footer">
        <code>Secure Server: Penuel-HQ-01</code>
      </div>
    </div>
  );
};

export default Login;
