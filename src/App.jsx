/**
 * App.jsx — Multi-Department Route Architecture (v3)
 *
 * CHANGES FROM v2:
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. SESSION READS:
 *      userRole and userDept are read from localStorage once at the App level
 *      and threaded as props into DashboardLayout on every route that needs
 *      them. This means any page nested inside DashboardLayout always knows
 *      the current user's full identity without re-reading localStorage itself.
 *
 * 2. DashboardLayout RECEIVES userDept:
 *      DashboardLayout now accepts a `userDept` prop alongside `userRole`.
 *      It should forward that value to:
 *        • Sidebar    — to show only the nav items relevant to the dept
 *        • Page pages — so OperationsFeed can filter its task list by dept
 *
 * 3. PROTECTED ROUTE TIERS (using ProtectedRoute v2):
 *
 *      TIER 0 — Unauthenticated:
 *        DashboardLayout's own useEffect already handles the isAuthenticated
 *        check and redirects to /gate. ProtectedRoute layers on TOP of that.
 *
 *      TIER 1 — Owner-only routes (financials, settings, aura):
 *        <ProtectedRoute requiredRole="owner" redirectTo="/dashboard/operations">
 *        Staff of any dept who navigate here are sent to /dashboard/operations
 *        (their natural landing page) instead of /dashboard, which is the
 *        owner overview they shouldn't see either.
 *
 *      TIER 2 — Any authenticated staff (operations, staff management):
 *        <ProtectedRoute requiredRole="staff">
 *        Owner passes automatically via the master-key bypass in ProtectedRoute.
 *        Unauthenticated users never reach this — DashboardLayout gates first.
 *
 *      TIER 3 — Dept-scoped routes (one per department):
 *        <ProtectedRoute requiredRole="staff" requiredDept="carwash">
 *        Only the matching dept (+ owner) can enter.  Other staff are
 *        redirected to /dashboard/operations.
 *
 * 4. /dashboard ITSELF (owner overview) is now wrapped with:
 *        <ProtectedRoute requiredRole="owner" redirectTo="/dashboard/operations">
 *      so staff who navigate to "/" or "/" programmatically land correctly.
 *
 * SECURITY NOTE:
 * ─────────────────────────────────────────────────────────────────────────────
 * All route guards are UI-layer only. Milestone 2 must enforce the same rules
 * server-side via JWT claims on every API call.
 */

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar          from './components/Navbar';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute  from './components/ProtectedRoute';
import DashboardHome   from './pages/DashboardHome';
import Home            from './pages/Home';
import About           from './pages/About';
import Catalogue       from './pages/Catalogue';
import Login           from './pages/Login';

import './styles/Dashboard.css';

const NAVBAR_HIDDEN_PREFIXES = ['/gate', '/dashboard'];

// ─────────────────────────────────────────────────────────────────────────────
// SESSION HELPER
// Read userRole and userDept once at App level so every route can pass them
// as props. Normalised to lowercase to match ProtectedRoute comparisons.
// ─────────────────────────────────────────────────────────────────────────────
const getSession = () => ({
  userRole: (localStorage.getItem('userRole') || '').toLowerCase(),
  userDept: (localStorage.getItem('userDept') || '').toLowerCase(),
});

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT FACTORY
// Returns a DashboardLayout with userRole and userDept already threaded in,
// wrapping whatever page content is passed as `children`.
// Using a factory keeps the route JSX readable and avoids repeating the
// localStorage reads on every route definition.
// ─────────────────────────────────────────────────────────────────────────────
const Layout = ({ children }) => {
  const { userRole, userDept } = getSession();
  return (
    <DashboardLayout userRole={userRole} userDept={userDept}>
      {children}
    </DashboardLayout>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────────────────────
const App = () => {
  const location = useLocation();

  const shouldShowNavbar = !NAVBAR_HIDDEN_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix)
  );

  return (
    <div className="app">
      {shouldShowNavbar && <Navbar />}

      <Routes>

        {/* ═══════════════════════════════════════════════════════════════
            PUBLIC ROUTES
            No auth required.
        ═══════════════════════════════════════════════════════════════ */}
        <Route path="/"          element={<Home />} />
        <Route path="/about"     element={<About />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/gate"      element={<Login />} />


        {/* ═══════════════════════════════════════════════════════════════
            TIER 1 — OWNER-ONLY ROUTES
            requiredRole="owner"   → master key in ProtectedRoute passes owner.
            redirectTo="/dashboard/operations" → staff land on their own page,
            not the owner overview, if they try to access these URLs directly.
        ═══════════════════════════════════════════════════════════════ */}

        {/* Executive overview — owner only */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              requiredRole="owner"
              redirectTo="/dashboard/operations"
            >
              <Layout>
                <DashboardHome />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Financial reports — owner only */}
        <Route
          path="/dashboard/financials"
          element={
            <ProtectedRoute
              requiredRole="owner"
              redirectTo="/dashboard/operations"
            >
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

        {/* Global settings — owner only */}
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute
              requiredRole="owner"
              redirectTo="/dashboard/operations"
            >
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

        {/* Aura analytics — owner only */}
        <Route
          path="/dashboard/aura"
          element={
            <ProtectedRoute
              requiredRole="owner"
              redirectTo="/dashboard/operations"
            >
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
            TIER 2 — ANY AUTHENTICATED STAFF (+ owner via master key)
            requiredRole="staff"   No dept restriction — all staff enter.
            redirectTo="/gate"     Unauthenticated users bounce to login.
            Note: DashboardLayout's own auth guard fires first, but keeping
            the redirectTo="/gate" here provides a belt-and-suspenders
            fallback in case DashboardLayout changes in future.
        ═══════════════════════════════════════════════════════════════ */}

        {/* Operations feed — staff landing page, dept-filtered inside the page */}
        <Route
          path="/dashboard/operations"
          element={
            <ProtectedRoute
              requiredRole="staff"
              redirectTo="/gate"
            >
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
                    <p>
                      Placeholder — import OperationsFeed here. It receives
                      <code> userDept</code> from DashboardLayout and filters
                      tasks to the current department automatically.
                    </p>
                  </div>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Staff management — available to all staff (owner manages via this too) */}
        <Route
          path="/dashboard/staff"
          element={
            <ProtectedRoute
              requiredRole="staff"
              redirectTo="/gate"
            >
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
            TIER 3 — DEPT-SCOPED ROUTES
            requiredRole="staff" + requiredDept="<dept>"
            Only the matching department staff (and owner) can enter.
            All other staff are sent back to /dashboard/operations.

            These routes give each department a dedicated space for
            deep-dive tools (e.g. wash queue management, bay scheduling,
            menu editing, stock control) without cross-dept visibility.
        ═══════════════════════════════════════════════════════════════ */}

        {/* Car Wash department workspace */}
        <Route
          path="/dashboard/dept/carwash"
          element={
            <ProtectedRoute
              requiredRole="staff"
              requiredDept="carwash"
              redirectTo="/dashboard/operations"
            >
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

        {/* Service Bay department workspace */}
        <Route
          path="/dashboard/dept/service"
          element={
            <ProtectedRoute
              requiredRole="staff"
              requiredDept="service"
              redirectTo="/dashboard/operations"
            >
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

        {/* Restaurant department workspace */}
        <Route
          path="/dashboard/dept/restaurant"
          element={
            <ProtectedRoute
              requiredRole="staff"
              requiredDept="restaurant"
              redirectTo="/dashboard/operations"
            >
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

        {/* Supermarket department workspace */}
        <Route
          path="/dashboard/dept/supermarket"
          element={
            <ProtectedRoute
              requiredRole="staff"
              requiredDept="supermarket"
              redirectTo="/dashboard/operations"
            >
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
            <div style={{
              textAlign:  'center',
              padding:    '4rem 2rem',
              color:      'white',
              minHeight:  '100vh',
            }}>
              <h1>404 — Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
            </div>
          }
        />

      </Routes>
    </div>
  );
};

export default App;
