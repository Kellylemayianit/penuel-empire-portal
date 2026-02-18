import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useBusinessContext } from './context/BusinessContext';

// ============================================================================
// PAGES & COMPONENTS
// ============================================================================

import Navbar from './components/Navbar';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';

// Import other pages
import Home from './pages/Home';
import About from './pages/About';
import Catalogue from './pages/Catalogue';
import Login from './pages/Login';

// ============================================================================
// STYLES
// ============================================================================

import './styles/Dashboard.css';

/**
 * App.jsx - CLEAN VERSION (No Router)
 * 
 * Philosophy: "The Empire Pulse Control Center"
 * 
 * CRITICAL NOTES:
 * - NO <Router> or <BrowserRouter> tags in this file
 * - The Router is provided by index.jsx
 * - This component only handles routing logic via <Routes>
 * - Uses useLocation to manage Navbar visibility
 * - Manages Aura Sync at app root level
 * 
 * Key Features:
 * - Conditional Navbar rendering
 * - Complete routing structure
 * - Aura Sync master synchronizer
 * - DashboardHome integration (LIVE)
 * - All placeholder routes ready
 * 
 * STATUS: PRODUCTION READY (No Router nesting errors)
 */

// ============================================================================
// ROUTE CONFIGURATION
// ============================================================================

const NAVBAR_HIDDEN_ROUTES = ['/gate', '/dashboard'];

// ============================================================================
// APP COMPONENT
// ============================================================================

const App = () => {
  const { activeBranch } = useBusinessContext();
  const location = useLocation();

  // =========================================================================
  // AURA SYNC MASTER EFFECT
  // =========================================================================
  // Root-level theme synchronization
  // Updates body classes and CSS variables for instant color changes
  // =========================================================================

  useEffect(() => {
    if (activeBranch) {
      // Step 1: Update document.body.classList for CSS cascading
      document.body.classList.remove('theme-plaza', 'theme-stopover');
      document.body.classList.add(`theme-${activeBranch}`);

      // Step 2: Update CSS variables for instant color updates
      const root = document.documentElement;

      if (activeBranch === 'plaza') {
        root.style.setProperty('--secondary-color', '#d4af37');
      } else if (activeBranch === 'stopover') {
        root.style.setProperty('--secondary-color', '#0077b6');
      }

      // Step 3: Logging for debugging
      console.log(`🎨 [App] AURA SYNC: Theme set to ${activeBranch}`);
      console.log(`📍 [App] Body class: theme-${activeBranch}`);
      console.log(
        `🌈 [App] CSS variable: --secondary-color = ${
          activeBranch === 'plaza' ? '#d4af37' : '#0077b6'
        }`
      );
    }
  }, [activeBranch]);

  // =========================================================================
  // NAVBAR VISIBILITY LOGIC
  // =========================================================================
  // Hide navbar on auth pages (/gate) and dashboard pages (/dashboard)
  // =========================================================================

  const shouldShowNavbar = !NAVBAR_HIDDEN_ROUTES.includes(location.pathname);

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <div className="app">
      {/* ===== CONDITIONAL NAVBAR ===== */}
      {shouldShowNavbar && <Navbar />}

      {/* ===== MAIN ROUTING ===== */}
      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/catalogue" element={<Catalogue />} />

        {/* ===== AUTH GATE ===== */}
        <Route path="/gate" element={<Login />} />

        {/* ===== DASHBOARD ROUTES ===== */}
        {/* Main Dashboard Home - LIVE (DashboardHome.jsx) */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <DashboardHome />
            </DashboardLayout>
          }
        />

        {/* Dashboard Operations - Placeholder */}
        <Route
          path="/dashboard/operations"
          element={
            <DashboardLayout>
              <div className="dashboard-page-header">
                <div className="dashboard-page-title">
                  <h1>Operations Feed</h1>
                  <p>Real-time operational updates and monitoring</p>
                </div>
              </div>
              <div className="dashboard-content">
                <div className="dashboard-card">
                  <h3>Operations Dashboard</h3>
                  <p>
                    This page is a placeholder. Import the real Operations
                    component here when ready.
                  </p>
                </div>
              </div>
            </DashboardLayout>
          }
        />

        {/* Dashboard Staff - Placeholder */}
        <Route
          path="/dashboard/staff"
          element={
            <DashboardLayout>
              <div className="dashboard-page-header">
                <div className="dashboard-page-title">
                  <h1>Staff Management</h1>
                  <p>Manage team members and assignments</p>
                </div>
              </div>
              <div className="dashboard-content">
                <div className="dashboard-card">
                  <h3>Staff Dashboard</h3>
                  <p>
                    This page is a placeholder. Import the real Staff Management
                    component here when ready.
                  </p>
                </div>
              </div>
            </DashboardLayout>
          }
        />

        {/* Dashboard Financials - Placeholder */}
        <Route
          path="/dashboard/financials"
          element={
            <DashboardLayout>
              <div className="dashboard-page-header">
                <div className="dashboard-page-title">
                  <h1>Financial Reports</h1>
                  <p>Revenue, expenses, and financial analysis (Owner only)</p>
                </div>
              </div>
              <div className="dashboard-content">
                <div className="dashboard-card">
                  <h3>Financial Dashboard</h3>
                  <p>
                    This page is a placeholder. Import the real Financial
                    Reports component here when ready.
                  </p>
                </div>
              </div>
            </DashboardLayout>
          }
        />

        {/* Dashboard Settings - Placeholder */}
        <Route
          path="/dashboard/settings"
          element={
            <DashboardLayout>
              <div className="dashboard-page-header">
                <div className="dashboard-page-title">
                  <h1>Global Settings</h1>
                  <p>System configuration and preferences (Owner only)</p>
                </div>
              </div>
              <div className="dashboard-content">
                <div className="dashboard-card">
                  <h3>Settings Dashboard</h3>
                  <p>
                    This page is a placeholder. Import the real Settings
                    component here when ready.
                  </p>
                </div>
              </div>
            </DashboardLayout>
          }
        />

        {/* Dashboard Aura - Placeholder */}
        <Route
          path="/dashboard/aura"
          element={
            <DashboardLayout>
              <div className="dashboard-page-header">
                <div className="dashboard-page-title">
                  <h1>Aura Analytics</h1>
                  <p>Advanced analytics and insights (Owner only)</p>
                </div>
              </div>
              <div className="dashboard-content">
                <div className="dashboard-card">
                  <h3>Aura Analytics Dashboard</h3>
                  <p>
                    This page is a placeholder. Import the real Aura Analytics
                    component here when ready.
                  </p>
                </div>
              </div>
            </DashboardLayout>
          }
        />

        {/* ===== 404 FALLBACK ===== */}
        <Route
          path="*"
          element={
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                color: 'white',
                minHeight: '100vh',
              }}
            >
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
