/**
 * App.jsx — Penuel Empire · Global App Shell (v4)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * CHANGES FROM v3:
 *
 * 1. BusinessProvider now wraps the entire tree
 *    AppShell (inner component) can call useBusinessContext() freely because
 *    it renders inside <BusinessProvider>. Every page and component in the
 *    tree shares the same context instance — no prop drilling needed.
 *
 * 2. Global Aura Controller (FloatingSwitcher) lives here
 *    Removed from Catalogue.jsx. Rendered once, outside <Routes>, so it
 *    persists across every page transition.
 *    - Desktop  → vertically-centred pill fixed to the right edge
 *    - Mobile   → full-width bottom bar, safe-area-inset-bottom aware
 *    - Appears after user scrolls 100px (scroll sentinel)
 *    - All .floater styles live in App.css (§ FLOATER)
 *
 * 3. Phoenix Glass Navbar replaces the external <Navbar> import
 *    Inlined here so it can read activeBranch directly from context and
 *    sync aura colours to active links without any prop threading.
 *    - Glass backdrop: blur(20px) saturate(180%)
 *    - Hamburger opens full-screen glass overlay on mobile
 *    - Active link colour changes per branch (orange / gold / electric-blue)
 *    - In-menu branch switcher for one-tap switching without closing menu
 *
 * 4. Navbar import removed — the external component is now dead code;
 *    keep the file but stop importing it so there's no double-render.
 *
 * SECURITY NOTE (unchanged):
 *   All route guards are UI-layer only.  Enforce server-side via JWT claims.
 */

import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, NavLink } from 'react-router-dom';

import { BusinessProvider, useBusinessContext } from './context/BusinessContext';
import ProtectedRoute  from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome   from './pages/DashboardHome';
import Home            from './pages/Home';
import About           from './pages/About';
import Catalogue       from './pages/Catalogue';
import Login           from './pages/Login';
import { Flame, Globe, Zap, Menu, X, ChevronRight } from 'lucide-react';

import './styles/App.css';
import './styles/Dashboard.css';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const NAVBAR_HIDDEN_PREFIXES = ['/gate', '/dashboard'];

const NAV_LINKS = [
  { to: '/',          label: 'Home'     },
  { to: '/about',     label: 'About'    },
  { to: '/catalogue', label: 'Services' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SESSION HELPER (unchanged from v3)
// ─────────────────────────────────────────────────────────────────────────────
const getSession = () => ({
  userRole: (localStorage.getItem('userRole') || '').toLowerCase(),
  userDept: (localStorage.getItem('userDept') || '').toLowerCase(),
});

const Layout = ({ children }) => {
  const { userRole, userDept } = getSession();
  return (
    <DashboardLayout userRole={userRole} userDept={userDept}>
      {children}
    </DashboardLayout>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL AURA CONTROLLER
// ─────────────────────────────────────────────────────────────────────────────
const FloatingSwitcher = () => {
  const { activeBranch, toggleBranch } = useBusinessContext();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const BTNS = [
    { key: 'empire',   Icon: Flame, label: 'Empire'   },
    { key: 'plaza',    Icon: Globe, label: 'Plaza'    },
    { key: 'stopover', Icon: Zap,   label: 'Stopover' },
  ];

  return (
    <nav
      className={`floater${visible ? ' floater--visible' : ''}`}
      aria-label="Global branch switcher"
    >
      {BTNS.map(({ key, Icon, label }) => (
        <button
          key={key}
          className={`floater__btn floater__btn--${key}${activeBranch === key ? ' is-active' : ''}`}
          onClick={() => toggleBranch(key)}
          aria-pressed={activeBranch === key}
          title={label}
        >
          <Icon size={18} aria-hidden="true" />
          <span className="floater__label">{label}</span>
        </button>
      ))}
    </nav>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PHOENIX GLASS NAVBAR
//
// Reads activeBranch from context — no props needed.
// Desktop: sticky bar with horizontal links.
// Mobile:  hamburger → full-screen blurred glass overlay with staggered links.
// Aura-sync: .navbar--{branch} drives active-link colour via CSS.
// ─────────────────────────────────────────────────────────────────────────────
const Navbar = () => {
  const { activeBranch, toggleBranch } = useBusinessContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Lock body scroll while overlay is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const brandIcon =
    activeBranch === 'stopover' ? '⛽' :
    activeBranch === 'plaza'    ? '🏨' : '🔥';

  return (
    <header className={`navbar navbar--${activeBranch}`} role="banner">
      <div className="navbar__inner">

        {/* ── Wordmark ── */}
        <NavLink to="/" className="navbar__brand" aria-label="Penuel Empire — home">
          <span className="navbar__brand-icon" aria-hidden="true">{brandIcon}</span>
          <span className="navbar__brand-text">
            Penuel <em>Empire</em>
          </span>
        </NavLink>

        {/* ── Desktop links ── */}
        <nav className="navbar__links" aria-label="Primary navigation">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `navbar__link${isActive ? ' navbar__link--active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
          <NavLink to="/gate" className="navbar__cta">
            Staff Login <ChevronRight size={13} aria-hidden="true" />
          </NavLink>
        </nav>

        {/* ── Hamburger ── */}
        <button
          className={`navbar__burger${menuOpen ? ' is-open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Phoenix Glass Overlay ── */}
      <div
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? ' mobile-menu--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-menu__noise" aria-hidden="true" />

        <nav className="mobile-menu__nav" aria-label="Mobile navigation">
          {NAV_LINKS.map(({ to, label }, i) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={{ '--i': i }}
              className={({ isActive }) =>
                `mobile-menu__link${isActive ? ' mobile-menu__link--active' : ''}`
              }
            >
              <span>{label}</span>
              <ChevronRight size={16} className="mobile-menu__chevron" aria-hidden="true" />
            </NavLink>
          ))}
          <NavLink
            to="/gate"
            className="mobile-menu__cta"
            style={{ '--i': NAV_LINKS.length }}
          >
            Staff Login
          </NavLink>
        </nav>

        {/* Branch switcher inside overlay — convenience shortcut */}
        <div className="mobile-menu__switcher">
          {[
            { key: 'empire',   Icon: Flame, label: 'Empire'   },
            { key: 'plaza',    Icon: Globe, label: 'Plaza'    },
            { key: 'stopover', Icon: Zap,   label: 'Stopover' },
          ].map(({ key, Icon, label }) => (
            <button
              key={key}
              className={`mob-sw-btn mob-sw-btn--${key}${activeBranch === key ? ' is-active' : ''}`}
              onClick={() => { toggleBranch(key); setMenuOpen(false); }}
              aria-pressed={activeBranch === key}
            >
              <Icon size={15} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        <p className="mobile-menu__tagline">One Empire · Two Worlds</p>
      </div>
    </header>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// APP SHELL — inner component, safe to call useBusinessContext()
// ─────────────────────────────────────────────────────────────────────────────
const AppShell = () => {
  const location = useLocation();
  const shouldShowNavbar = !NAVBAR_HIDDEN_PREFIXES.some(p =>
    location.pathname.startsWith(p)
  );

  return (
    <div className="app">
      {shouldShowNavbar && <Navbar />}

      {/* Global Aura Controller — outside Routes, visible on every page */}
      <FloatingSwitcher />

      <Routes>

        {/* ═══════════════════════════════════════════════════════════════
            PUBLIC ROUTES
        ═══════════════════════════════════════════════════════════════ */}
        <Route path="/"          element={<Home />} />
        <Route path="/about"     element={<About />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/gate"      element={<Login />} />

        {/* ═══════════════════════════════════════════════════════════════
            TIER 1 — OWNER-ONLY
        ═══════════════════════════════════════════════════════════════ */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="owner" redirectTo="/dashboard/operations">
              <Layout><DashboardHome /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/financials"
          element={
            <ProtectedRoute requiredRole="owner" redirectTo="/dashboard/operations">
              <Layout>
                <div className="dashboard-page-header">
                  <div className="dashboard-page-title">
                    <h1>Financial Reports</h1>
                    <p>Revenue, expenses, and financial analysis — Owner only</p>
                  </div>
                </div>
                <div className="dashboard-content">
                  <div className="dashboard-card">
                    <h3>Financial Dashboard</h3>
                    <p>Placeholder — import the real Financial Reports component here.</p>
                  </div>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute requiredRole="owner" redirectTo="/dashboard/operations">
              <Layout>
                <div className="dashboard-page-header">
                  <div className="dashboard-page-title">
                    <h1>Global Settings</h1>
                    <p>System configuration and preferences — Owner only</p>
                  </div>
                </div>
                <div className="dashboard-content">
                  <div className="dashboard-card">
                    <h3>Settings Dashboard</h3>
                    <p>Placeholder — import the real Settings component here.</p>
                  </div>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/aura"
          element={
            <ProtectedRoute requiredRole="owner" redirectTo="/dashboard/operations">
              <Layout>
                <div className="dashboard-page-header">
                  <div className="dashboard-page-title">
                    <h1>Aura Analytics</h1>
                    <p>Advanced analytics and insights — Owner only</p>
                  </div>
                </div>
                <div className="dashboard-content">
                  <div className="dashboard-card">
                    <h3>Aura Analytics Dashboard</h3>
                    <p>Placeholder — import the real Aura Analytics component here.</p>
                  </div>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ═══════════════════════════════════════════════════════════════
            TIER 2 — ANY AUTHENTICATED STAFF
        ═══════════════════════════════════════════════════════════════ */}
        <Route
          path="/dashboard/operations"
          element={
            <ProtectedRoute requiredRole="staff" redirectTo="/gate">
              <Layout>
                <div className="dashboard-page-header">
                  <div className="dashboard-page-title">
                    <h1>Operations Feed</h1>
                    <p>Real-time tasks for your department</p>
                  </div>
                </div>
                <div className="dashboard-content">
                  <div className="dashboard-card">
                    <h3>Operations Dashboard</h3>
                    <p>Placeholder — import OperationsFeed here.</p>
                  </div>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/staff"
          element={
            <ProtectedRoute requiredRole="staff" redirectTo="/gate">
              <Layout>
                <div className="dashboard-page-header">
                  <div className="dashboard-page-title">
                    <h1>Staff Management</h1>
                    <p>Team members and shift assignments</p>
                  </div>
                </div>
                <div className="dashboard-content">
                  <div className="dashboard-card">
                    <h3>Staff Dashboard</h3>
                    <p>Placeholder — import the real Staff Management component here.</p>
                  </div>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ═══════════════════════════════════════════════════════════════
            TIER 3 — DEPT-SCOPED
        ═══════════════════════════════════════════════════════════════ */}
        <Route
          path="/dashboard/dept/carwash"
          element={
            <ProtectedRoute requiredRole="staff" requiredDept="carwash" redirectTo="/dashboard/operations">
              <Layout>
                <div className="dashboard-page-header">
                  <div className="dashboard-page-title">
                    <h1>Car Wash Management</h1>
                    <p>Bay queue, wash packages, and service logs</p>
                  </div>
                </div>
                <div className="dashboard-content">
                  <div className="dashboard-card">
                    <h3>Car Wash Dashboard</h3>
                    <p>Placeholder — import CarWashManagement component here.</p>
                  </div>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/dept/service"
          element={
            <ProtectedRoute requiredRole="staff" requiredDept="service" redirectTo="/dashboard/operations">
              <Layout>
                <div className="dashboard-page-header">
                  <div className="dashboard-page-title">
                    <h1>Service Bay Management</h1>
                    <p>Mechanical jobs, parts inventory, and bay scheduling</p>
                  </div>
                </div>
                <div className="dashboard-content">
                  <div className="dashboard-card">
                    <h3>Service Bay Dashboard</h3>
                    <p>Placeholder — import ServiceBayManagement component here.</p>
                  </div>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/dept/restaurant"
          element={
            <ProtectedRoute requiredRole="staff" requiredDept="restaurant" redirectTo="/dashboard/operations">
              <Layout>
                <div className="dashboard-page-header">
                  <div className="dashboard-page-title">
                    <h1>Restaurant Management</h1>
                    <p>Table orders, menu updates, and kitchen queue</p>
                  </div>
                </div>
                <div className="dashboard-content">
                  <div className="dashboard-card">
                    <h3>Restaurant Dashboard</h3>
                    <p>Placeholder — import RestaurantManagement component here.</p>
                  </div>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/dept/supermarket"
          element={
            <ProtectedRoute requiredRole="staff" requiredDept="supermarket" redirectTo="/dashboard/operations">
              <Layout>
                <div className="dashboard-page-header">
                  <div className="dashboard-page-title">
                    <h1>Supermarket Management</h1>
                    <p>Stock levels, product listings, and sales log</p>
                  </div>
                </div>
                <div className="dashboard-content">
                  <div className="dashboard-card">
                    <h3>Supermarket Dashboard</h3>
                    <p>Placeholder — import SupermarketManagement component here.</p>
                  </div>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ═══════════════════════════════════════════════════════════════
            404 CATCH-ALL
        ═══════════════════════════════════════════════════════════════ */}
        <Route
          path="*"
          element={
            <div style={{ textAlign:'center', padding:'4rem 2rem', color:'white', minHeight:'100vh' }}>
              <h1>404 — Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
            </div>
          }
        />

      </Routes>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// APP — root export
// BusinessProvider wraps AppShell so every component in the tree can call
// useBusinessContext() — including Navbar and FloatingSwitcher.
// ─────────────────────────────────────────────────────────────────────────────
const App = () => (
  <BusinessProvider>
    <AppShell />
  </BusinessProvider>
);

export default App;
