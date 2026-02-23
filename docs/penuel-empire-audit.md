# Penuel Empire Portal — Full Codebase Audit Source
> Consolidated for NotebookLM · Architecture & Security Audit
> Generated: 2026-02-18

---

# File: package.json

```json
{
  "name": "penuel-empire-portal",
  "version": "1.0.0",
  "description": "Hub-and-Spoke Portal for Penuel Plaza (Hotel) and Penuel Stopover (Retail/Auto)",
  "type": "module",
  "main": "src/index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .js,.jsx"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "bootstrap": "^5.3.0",
    "lucide-react": "^0.263.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.30.3"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.0",
    "vite": "^5.0.0"
  },
  "keywords": ["penuel", "hotel", "retail", "automotive", "kenya"],
  "author": "Penuel Empire",
  "license": "MIT"
}
```

---

# File: index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#8B4513" />
    <meta
      name="description"
      content="Penuel Empire Portal - Hub-and-Spoke Management System for Penuel Plaza (Luxury Hotel) and Penuel Stopover (Retail/Auto Services)" />
    <meta name="keywords" content="penuel, hotel, retail, automotive, amboseli, kenya, luxury, stopover" />
    <meta name="author" content="Penuel Empire" />

    <link rel="icon" type="image/svg+xml" href="/vite.svg" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet" />

    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Penuel Portal" />

    <meta name="msapplication-TileColor" content="#8B4513" />
    <meta name="msapplication-config" content="/browserconfig.xml" />

    <title>Penuel Empire Portal - Hub-and-Spoke Management System</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.jsx"></script>
    <noscript>
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:linear-gradient(135deg,#f5f5dc 0%,#fafaf8 100%);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;text-align:center;padding:2rem;">
        <div>
          <h1 style="color:#8b4513;margin-bottom:1rem">Penuel Empire Portal</h1>
          <p style="color:#2c2416;font-size:1.1rem">This application requires JavaScript to be enabled in your browser.<br/>Please enable JavaScript and reload the page.</p>
        </div>
      </div>
    </noscript>
  </body>
</html>
```

---

# File: src/index.jsx

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { BusinessProvider } from './context/BusinessContext';
import App from './App';
import './styles/App.css';

/**
 * Main Entry Point for Penuel Empire Portal
 *
 * Architecture:
 * - Router wraps everything (enables useNavigate, useLocation, etc.)
 * - BusinessProvider wraps App (context available to all components)
 * - App contains the Route definitions
 *
 * This order is critical for:
 * 1. useNavigate() to work in Navbar
 * 2. useBusinessContext() to work in Catalogue and other components
 * 3. useLocation() to work in Navbar for active link detection
 */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <BusinessProvider>
        <App />
      </BusinessProvider>
    </Router>
  </React.StrictMode>
);
```

---

# File: src/App.jsx

```jsx
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useBusinessContext } from './context/BusinessContext';

import Navbar from './components/Navbar';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Home from './pages/Home';
import About from './pages/About';
import Catalogue from './pages/Catalogue';
import Login from './pages/Login';

import './styles/Dashboard.css';

const NAVBAR_HIDDEN_ROUTES = ['/gate', '/dashboard'];

const App = () => {
  const { activeBranch } = useBusinessContext();
  const location = useLocation();

  useEffect(() => {
    if (activeBranch) {
      document.body.classList.remove('theme-plaza', 'theme-stopover');
      document.body.classList.add(`theme-${activeBranch}`);

      const root = document.documentElement;
      if (activeBranch === 'plaza') {
        root.style.setProperty('--secondary-color', '#d4af37');
      } else if (activeBranch === 'stopover') {
        root.style.setProperty('--secondary-color', '#0077b6');
      }

      console.log(`🎨 [App] AURA SYNC: Theme set to ${activeBranch}`);
      console.log(`📍 [App] Body class: theme-${activeBranch}`);
      console.log(
        `🌈 [App] CSS variable: --secondary-color = ${
          activeBranch === 'plaza' ? '#d4af37' : '#0077b6'
        }`
      );
    }
  }, [activeBranch]);

  const shouldShowNavbar = !NAVBAR_HIDDEN_ROUTES.includes(location.pathname);

  return (
    <div className="app">
      {shouldShowNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/gate" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <DashboardHome />
            </DashboardLayout>
          }
        />

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
                  <p>This page is a placeholder. Import the real Operations component here when ready.</p>
                </div>
              </div>
            </DashboardLayout>
          }
        />

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
                  <p>This page is a placeholder. Import the real Staff Management component here when ready.</p>
                </div>
              </div>
            </DashboardLayout>
          }
        />

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
                  <p>This page is a placeholder. Import the real Financial Reports component here when ready.</p>
                </div>
              </div>
            </DashboardLayout>
          }
        />

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
                  <p>This page is a placeholder. Import the real Settings component here when ready.</p>
                </div>
              </div>
            </DashboardLayout>
          }
        />

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
                  <p>This page is a placeholder. Import the real Aura Analytics component here when ready.</p>
                </div>
              </div>
            </DashboardLayout>
          }
        />

        <Route
          path="*"
          element={
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'white', minHeight: '100vh' }}>
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
```

---

# File: src/context/BusinessContext.jsx

```jsx
/**
 * BusinessContext - Milestone 1 Refactor
 * Single Source of Truth for Penuel Empire Portal state management
 *
 * Manages:
 * - Branch state (plaza / stopover)
 * - Toast notifications (global state + auto-dismiss)
 * - Dynamic theming
 * - Branch information
 * - Data access
 * - Payment processing (placeholder for Milestone 2)
 */

import React, { createContext, useState, useCallback, useMemo, useEffect } from "react";
import plazaData from "../data/plaza.json";
import stopoverData from "../data/stopover.json";

export const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  const [activeBranch, setActiveBranch] = useState("plaza");

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success"
  });

  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [paymentError, setPaymentError] = useState(null);

  const toggleBranch = useCallback((branch) => {
    if (branch === "plaza" || branch === "stopover") {
      setActiveBranch(branch);
      setPaymentStatus("idle");
      setPaymentError(null);
      setToast((prev) => ({ ...prev, visible: false }));
    } else {
      console.warn(`Invalid branch: ${branch}. Use 'plaza' or 'stopover'.`);
    }
  }, []);

  const showNotification = useCallback((message, type = "success") => {
    setToast({ visible: true, message, type });
  }, []);

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const getActiveBranchData = useCallback(() => {
    return activeBranch === "plaza" ? plazaData : stopoverData;
  }, [activeBranch]);

  const getActiveBranchTheme = useCallback(() => {
    if (activeBranch === "plaza") {
      return {
        name: "Penuel Plaza",
        type: "hotel",
        primary: "#8B4513",
        secondary: "#D4AF37",
        accent: "#E8DCC4",
        dark: "#2C2416",
        success: "#2D5016",
        warning: "#C9302C",
        light: "#F5F5DC",
        fontFamily: "'Playfair Display', serif"
      };
    } else {
      return {
        name: "Penuel Stopover",
        type: "service-hub",
        primary: "#1F5A96",
        secondary: "#FF8C00",
        accent: "#34495E",
        dark: "#1A1A1A",
        success: "#27AE60",
        warning: "#E74C3C",
        light: "#ECF0F1",
        fontFamily: "'Inter', 'Segoe UI', sans-serif"
      };
    }
  }, [activeBranch]);

  const getBranchInfo = useCallback(() => {
    const data = getActiveBranchData();
    const theme = getActiveBranchTheme();
    return {
      branch: data.branch || "Unknown Branch",
      type: data.type || "unknown",
      location: data.location || "Unknown Location",
      currency: data.currency || "KES",
      theme: theme
    };
  }, [activeBranch, getActiveBranchData, getActiveBranchTheme]);

  const processPayment = useCallback(
    async (paymentData) => {
      const {
        amount = 0,
        currency = "KES",
        phone = "",
        description = "Penuel Empire Payment",
        orderId = "",
        gateway = "mpesa"
      } = paymentData;

      if (!amount || amount <= 0) {
        setPaymentError("Invalid payment amount");
        setPaymentStatus("failed");
        showNotification("❌ Invalid payment amount", "error");
        return { success: false, error: "Invalid payment amount" };
      }

      if (!phone) {
        setPaymentError("Phone number is required");
        setPaymentStatus("failed");
        showNotification("❌ Phone number is required", "error");
        return { success: false, error: "Phone number is required" };
      }

      if (!orderId) {
        setPaymentError("Order ID is required");
        setPaymentStatus("failed");
        showNotification("❌ Order ID is required", "error");
        return { success: false, error: "Order ID is required" };
      }

      try {
        setPaymentStatus("processing");
        setPaymentError(null);

        console.log("💳 Payment Processing:", {
          amount, currency, phone, description, orderId, gateway,
          timestamp: new Date().toISOString(),
          branch: activeBranch
        });

        showNotification(`💳 Processing ${gateway.toUpperCase()} payment...`, "info");

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const mpesaConfig = {
          consumerKey: import.meta.env.VITE_MPESA_CONSUMER_KEY || "NOT_SET",
          consumerSecret: import.meta.env.VITE_MPESA_CONSUMER_SECRET || "NOT_SET",
          shortCode: import.meta.env.VITE_MPESA_SHORTCODE || "NOT_SET",
          passkey: import.meta.env.VITE_MPESA_PASSKEY || "NOT_SET",
          callbackUrl: import.meta.env.VITE_MPESA_CALLBACK_URL || "NOT_SET"
        };

        const placeholderResponse = {
          success: false,
          status: "pending",
          message: "M-Pesa integration in Milestone 2.",
          transactionId: orderId,
          amount, currency, phone, gateway,
          timestamp: new Date().toISOString(),
          mpesaConfig
        };

        console.warn("⚠️ DEVELOPMENT MODE: M-Pesa integration not yet active.");
        console.log("Expected M-Pesa Config:", mpesaConfig);

        showNotification("⏳ Payment processing (Milestone 2 pending)", "info");

        setPaymentStatus("idle");
        return placeholderResponse;
      } catch (error) {
        const errorMessage = error.message || "Payment processing failed";
        setPaymentError(errorMessage);
        setPaymentStatus("failed");
        showNotification(`❌ ${errorMessage}`, "error");
        console.error("Payment Error:", error);
        return { success: false, error: errorMessage };
      }
    },
    [activeBranch, showNotification]
  );

  const contextValue = useMemo(
    () => ({
      toast,
      showNotification,
      activeBranch,
      toggleBranch,
      getActiveBranchData,
      getActiveBranchTheme,
      getBranchInfo,
      paymentStatus,
      paymentError,
      processPayment,
      plazaData,
      stopoverData
    }),
    [
      toast, showNotification,
      activeBranch, toggleBranch,
      getActiveBranchData, getActiveBranchTheme, getBranchInfo,
      paymentStatus, paymentError, processPayment
    ]
  );

  return <BusinessContext.Provider value={contextValue}>{children}</BusinessContext.Provider>;
};

export const useBusinessContext = () => {
  const context = React.useContext(BusinessContext);
  if (!context) {
    throw new Error("useBusinessContext must be used within BusinessProvider");
  }
  return context;
};

export const useNotification = () => {
  const { toast, showNotification } = useBusinessContext();
  return { toast, showNotification };
};

export const useBranchState = () => {
  const { activeBranch, toggleBranch } = useBusinessContext();
  return { activeBranch, toggleBranch };
};

export const useTheme = () => {
  const { getActiveBranchTheme, getBranchInfo } = useBusinessContext();
  return { theme: getActiveBranchTheme(), branchInfo: getBranchInfo() };
};

export const withBusinessContext = (WrappedComponent) => {
  return (props) => {
    const businessContext = useBusinessContext();
    return <WrappedComponent {...props} businessContext={businessContext} />;
  };
};

export default BusinessProvider;
```

---

# File: src/context/BusinessContext.js.imports

```js
import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import plazaData from '../data/plaza.json';
import stopoverData from '../data/stopover.json';

// Rest of your BusinessContext.js code continues below...
// (Keep all the existing context logic and exports)
```

---

# File: src/components/Navbar.jsx

```jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBusinessContext } from '../context/BusinessContext';
import { Menu, X } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeBranch } = useBusinessContext();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <button className="navbar-logo" onClick={() => navigate('/')}>
            <span className="logo-text">Penuel</span>
          </button>
        </div>

        <div className="navbar-menu">
          <button className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => navigate('/')}>Home</button>
          <button className={`nav-link ${isActive('/about') ? 'active' : ''}`} onClick={() => navigate('/about')}>About</button>
          <button className={`nav-link ${isActive('/catalogue') ? 'active' : ''}`} onClick={() => navigate('/catalogue')}>Services</button>
        </div>

        <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <button className="mobile-nav-link" onClick={() => { navigate('/'); setMobileMenuOpen(false); }}>Home</button>
          <button className="mobile-nav-link" onClick={() => { navigate('/about'); setMobileMenuOpen(false); }}>About</button>
          <button className="mobile-nav-link" onClick={() => { navigate('/catalogue'); setMobileMenuOpen(false); }}>Services</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
```

---

# File: src/components/DashboardLayout.jsx

```jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusinessContext } from '../context/BusinessContext';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar';
import '../styles/Dashboard.css';

/**
 * DashboardLayout.jsx - MASTER SYNC VERSION
 *
 * This component is the SINGLE SOURCE OF TRUTH for theme synchronization.
 * It watches activeBranch from BusinessContext and:
 * 1. Updates document.body.classList (for CSS cascading)
 * 2. Updates CSS variables on document.documentElement (for instant color updates)
 * 3. Triggers re-renders of all child components via context
 */

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const { activeBranch } = useBusinessContext();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/gate');
    }
  }, [navigate]);

  useEffect(() => {
    if (activeBranch) {
      document.body.classList.remove('theme-plaza', 'theme-stopover');
      document.body.classList.add(`theme-${activeBranch}`);

      const root = document.documentElement;
      if (activeBranch === 'plaza') {
        root.style.setProperty('--secondary-color', '#d4af37');
      } else if (activeBranch === 'stopover') {
        root.style.setProperty('--secondary-color', '#0077b6');
      }

      console.log(`🎨 [DashboardLayout] MASTER SYNC: Theme set to ${activeBranch}`);
      console.log(`📍 [DashboardLayout] Body class: theme-${activeBranch}`);
      console.log(`🌈 [DashboardLayout] CSS variable: --secondary-color = ${activeBranch === 'plaza' ? '#d4af37' : '#0077b6'}`);
    }
  }, [activeBranch]);

  const userRole = localStorage.getItem('userRole') || 'secretary';

  return (
    <div className="dashboard-container">
      <DashboardHeader />
      <div className="dashboard-layout">
        <Sidebar userRole={userRole} />
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
```

---

# File: src/components/DashboardHeader.jsx

```jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useBusinessContext } from '../context/BusinessContext';
import {
  Search, Download, Bell, Sun, Moon, ChevronRight, FileJson, FileText,
} from 'lucide-react';
import '../styles/Dashboard.css';

const ROUTE_LABELS = {
  '/dashboard': 'Dashboard Home',
  '/dashboard/operations': 'Operations Feed',
  '/dashboard/staff': 'Staff Management',
  '/dashboard/financials': 'Financial Reports',
  '/dashboard/settings': 'Global Settings',
  '/dashboard/aura': 'Aura Analytics',
};

const DashboardHeader = () => {
  const location = useLocation();
  const { activeBranch, toggleBranch } = useBusinessContext();
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const currentPage = ROUTE_LABELS[location.pathname] || 'Dashboard';

  const handleBranchToggle = (newBranch) => {
    if (activeBranch !== newBranch) {
      toggleBranch(newBranch);
      document.body.classList.remove('theme-plaza', 'theme-stopover');
      document.body.classList.add(`theme-${newBranch}`);
      console.log(`✨ [Header] Theme switched to: ${newBranch}`);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleExportClick = (format) => {
    console.log(`📥 Exporting as ${format}`);
    setExportOpen(false);
  };

  const handleNotificationClick = (notificationId) => {
    console.log(`✅ Notification read: ${notificationId}`);
    if (unreadCount > 0) setUnreadCount(unreadCount - 1);
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <div className="header-breadcrumb">
          <span className="breadcrumb-root">Dashboard</span>
          <ChevronRight size={16} className="breadcrumb-separator" />
          <span className="breadcrumb-current">{currentPage}</span>
        </div>

        <div className={`header-search ${searchFocus ? 'focused' : ''}`}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Quick search..."
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        <div className="system-heartbeat">
          <div className="heartbeat-dot"></div>
          <span className="heartbeat-label">Live Sync</span>
        </div>

        <div className="context-switcher">
          <div className={`switcher-slider ${activeBranch}`}></div>
          <button
            className={`switcher-segment plaza-segment ${activeBranch === 'plaza' ? 'active' : ''}`}
            onClick={() => handleBranchToggle('plaza')}
            title="Switch to Plaza"
            aria-label="Plaza Context"
          >
            <Sun size={18} />
            <span>Plaza</span>
          </button>
          <button
            className={`switcher-segment stopover-segment ${activeBranch === 'stopover' ? 'active' : ''}`}
            onClick={() => handleBranchToggle('stopover')}
            title="Switch to Stopover"
            aria-label="Stopover Context"
          >
            <Moon size={18} />
            <span>Stopover</span>
          </button>
        </div>

        <div className="header-actions">
          <div className="export-container">
            <button
              className="action-btn export-btn"
              onMouseEnter={() => setExportOpen(true)}
              onMouseLeave={() => setExportOpen(false)}
              title="Export Data"
              aria-label="Export"
            >
              <Download size={20} />
            </button>
            {exportOpen && (
              <div
                className="export-dropdown"
                onMouseEnter={() => setExportOpen(true)}
                onMouseLeave={() => setExportOpen(false)}
              >
                <button className="export-option" onClick={() => handleExportClick('CSV')}>
                  <FileJson size={16} /><span>Export as CSV</span>
                </button>
                <button className="export-option" onClick={() => handleExportClick('PDF')}>
                  <FileText size={16} /><span>Export as PDF</span>
                </button>
              </div>
            )}
          </div>

          <div className="notification-container">
            <button
              className="action-btn notification-btn"
              onClick={() => setNotificationOpen(!notificationOpen)}
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
            {notificationOpen && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h4>Notifications</h4>
                  <button className="close-btn" onClick={() => setNotificationOpen(false)}>×</button>
                </div>
                <div className="notifications-content">
                  <div className="notification-item" onClick={() => handleNotificationClick(1)}>
                    <div className="notification-dot-small"></div>
                    <div className="notification-text">
                      <p className="notification-title">System Update</p>
                      <p className="notification-time">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="notification-item" onClick={() => handleNotificationClick(2)}>
                    <div className="notification-dot-small"></div>
                    <div className="notification-text">
                      <p className="notification-title">New Staff Member Added</p>
                      <p className="notification-time">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="notification-item" onClick={() => handleNotificationClick(3)}>
                    <div className="notification-dot-small"></div>
                    <div className="notification-text">
                      <p className="notification-title">Operations Report Generated</p>
                      <p className="notification-time">1 hour ago</p>
                    </div>
                  </div>
                </div>
                <div className="notifications-footer">
                  <button className="view-all-btn">View All Notifications</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
```

---

# File: src/components/Sidebar.jsx

```jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusinessContext } from '../context/BusinessContext';
import {
  LayoutDashboard, Activity, Users, BarChart3, Settings, LogOut, Sun, Moon, ChevronDown, ChevronUp,
} from 'lucide-react';
import '../styles/Dashboard.css';

const Sidebar = ({ userRole }) => {
  const navigate = useNavigate();
  const { activeBranch, toggleBranch } = useBusinessContext();
  const [currentPage, setCurrentPage] = React.useState('dashboard');
  const [toggleOpen, setToggleOpen] = React.useState(false);

  const baseMenuItems = [
    { id: 'dashboard', label: 'Dashboard Home', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'operations', label: 'Operations Feed', icon: Activity, path: '/dashboard/operations' },
    { id: 'staff', label: 'Staff Management', icon: Users, path: '/dashboard/staff' },
  ];

  const ownerMenuItems = [
    { id: 'financials', label: 'Financial Reports', icon: BarChart3, path: '/dashboard/financials' },
    { id: 'settings', label: 'Global Settings', icon: Settings, path: '/dashboard/settings' },
    { id: 'aura', label: 'Aura Analytics', icon: BarChart3, path: '/dashboard/aura' },
  ];

  const menuItems = userRole === 'owner'
    ? [...baseMenuItems, ...ownerMenuItems]
    : baseMenuItems;

  const handleMenuClick = (item) => {
    setCurrentPage(item.id);
    navigate(item.path);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAuthenticated');
    navigate('/gate');
  };

  const handleBranchToggle = (newBranch) => {
    if (activeBranch !== newBranch) {
      toggleBranch(newBranch);
      document.body.classList.remove('theme-plaza', 'theme-stopover');
      document.body.classList.add(`theme-${newBranch}`);
      console.log(`✨ [Sidebar] Theme switched to: ${newBranch}`);
      setToggleOpen(false);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-branding">
          <h3>PENUEL</h3>
          <p>Command Center</p>
        </div>
      </div>

      <div className="sidebar-role-badge">
        <span className="role-label">{userRole.toUpperCase()}</span>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => handleMenuClick(item)}
              title={item.label}
            >
              <IconComponent size={20} className="menu-icon" />
              <span className="menu-label">{item.label}</span>
              {isActive && <div className="menu-indicator"></div>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-divider"></div>

      <div className="sidebar-business-switch">
        <div className="switch-label">Context</div>
        <div className="switch-dropdown">
          <button className="switch-toggle-btn" onClick={() => setToggleOpen(!toggleOpen)}>
            <span className="switch-current">
              {activeBranch === 'plaza' ? (
                <><Sun size={16} /><span>Plaza</span></>
              ) : (
                <><Moon size={16} /><span>Stopover</span></>
              )}
            </span>
            <span className="switch-chevron">
              {toggleOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </button>
          {toggleOpen && (
            <div className="switch-menu">
              <button
                className={`switch-option ${activeBranch === 'plaza' ? 'active' : ''}`}
                onClick={() => handleBranchToggle('plaza')}
              >
                <Sun size={16} /><span>Plaza</span>
              </button>
              <button
                className={`switch-option ${activeBranch === 'stopover' ? 'active' : ''}`}
                onClick={() => handleBranchToggle('stopover')}
              >
                <Moon size={16} /><span>Stopover</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <button className="sidebar-logout" onClick={handleLogout} title="Exit Portal">
        <LogOut size={18} />
        <span>Exit Portal</span>
      </button>

      <div className="sidebar-footer">
        <p>Penuel Empire</p>
        <span className="footer-version">v1.0</span>
      </div>
    </aside>
  );
};

export default Sidebar;
```

---

# File: src/components/shared/ServiceCard.jsx

```jsx
import React, { useState, useMemo } from 'react';
import { useBusinessContext } from '../../context/BusinessContext';
import {
  Wifi, Wind, Tv, Utensils, Clock, DollarSign, MapPin, Star,
  CheckCircle, AlertCircle, Users, Zap, Package, Wrench,
} from 'lucide-react';
import './ServiceCard.css';

/**
 * ServiceCard Component
 * Versatile card component for displaying:
 * - Hotel Rooms (with rate_nightly)
 * - Retail Items (with price)
 * - Services (with price and duration)
 * - Experiences (with price_per_person)
 */
const ServiceCard = ({
  item,
  variant = 'default',
  onRequestService,
  className = '',
}) => {
  const { getActiveBranchTheme } = useBusinessContext();
  const theme = getActiveBranchTheme();
  const [isHovered, setIsHovered] = useState(false);

  const itemType = useMemo(() => {
    if (item.rate_nightly) return 'room';
    if (item.dish) return 'dining';
    if (item.product) return 'retail';
    if (item.service) return 'service';
    if (item.duration_minutes && item.price) return 'experience';
    if (item.prep_time_minutes) return 'menu-item';
    return 'generic';
  }, [item]);

  const getPrice = () => {
    if (item.rate_nightly) return item.rate_nightly;
    if (item.price_per_person) return item.price_per_person;
    return item.price || 0;
  };

  const getPriceLabel = () => {
    if (item.rate_nightly) return '/night';
    if (item.price_per_person) return 'pp';
    return '';
  };

  const getTitle = () => {
    return item.type || item.name || item.dish || item.product || item.service || 'Item';
  };

  const getFeaturesToDisplay = () => {
    const features = item.amenities || item.features || [];
    return features.slice(0, 3);
  };

  const getFeatureIcon = (feature) => {
    const featureLower = feature.toLowerCase();
    if (featureLower.includes('wifi')) return <Wifi size={16} />;
    if (featureLower.includes('air') || featureLower.includes('ac')) return <Wind size={16} />;
    if (featureLower.includes('tv') || featureLower.includes('smart')) return <Tv size={16} />;
    if (featureLower.includes('bar') || featureLower.includes('kitchen')) return <Utensils size={16} />;
    if (featureLower.includes('housekeeping') || featureLower.includes('service')) return <CheckCircle size={16} />;
    if (featureLower.includes('power') || featureLower.includes('electric')) return <Zap size={16} />;
    if (featureLower.includes('parking') || featureLower.includes('storage')) return <Package size={16} />;
    return <Star size={16} />;
  };

  const handleRequestService = () => {
    const logData = {
      itemId: item.id,
      itemType,
      itemName: getTitle(),
      price: getPrice(),
      timestamp: new Date().toISOString(),
    };
    console.log('🔔 Service Request Logged:', logData);
    console.table(logData);
    if (onRequestService && typeof onRequestService === 'function') {
      onRequestService(item);
    }
  };

  const renderRoomCard = () => (
    <div className={`service-card room-card ${variant} ${isHovered ? 'hovered' : ''} ${className}`}>
      <div className="card-header room-header">
        <div className="header-content">
          <h5 className="card-title">{getTitle()}</h5>
          <span className="capacity-badge"><Users size={14} /> {item.capacity} Guests</span>
        </div>
      </div>
      <div className="card-body">
        {item.description && <p className="card-description">{item.description}</p>}
        {getFeaturesToDisplay().length > 0 && (
          <div className="amenities-section">
            <h6 className="section-title">Amenities</h6>
            <div className="amenities-grid">
              {getFeaturesToDisplay().map((amenity, idx) => (
                <div key={idx} className="amenity-item">
                  <span className="amenity-icon">{getFeatureIcon(amenity)}</span>
                  <span className="amenity-text">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="card-footer room-footer">
        <div className="price-section">
          <span className="price-label">Rate</span>
          <div className="price-display">
            <span className="currency">$</span>
            <span className="amount">{getPrice()}</span>
            <span className="period">{getPriceLabel()}</span>
          </div>
        </div>
        <button className="btn-request-service" onClick={handleRequestService} aria-label={`Request ${getTitle()} room`}>Book Now</button>
      </div>
    </div>
  );

  const renderServiceCard = () => (
    <div className={`service-card service-type ${variant} ${isHovered ? 'hovered' : ''} ${className}`}>
      <div className="card-header service-header">
        <div className="header-content">
          <h5 className="card-title">{getTitle()}</h5>
          {item.duration_minutes && <span className="duration-badge"><Clock size={14} /> {item.duration_minutes}m</span>}
          {item.prep_time_minutes && <span className="duration-badge"><Clock size={14} /> {item.prep_time_minutes}m</span>}
        </div>
      </div>
      <div className="card-body">
        {item.description && <p className="card-description">{item.description}</p>}
        {item.group_size && <div className="meta-info"><span className="meta-label">Group Size:</span><span className="meta-value">{item.group_size}</span></div>}
        {item.suitable_for && <div className="meta-info"><span className="meta-label">Suitable For:</span><span className="meta-value">{item.suitable_for}</span></div>}
      </div>
      <div className="card-footer service-footer">
        <div className="price-section">
          <span className="price-label">{item.price_per_person ? 'Per Person' : 'Price'}</span>
          <div className="price-display">
            <span className="currency">{item.price_per_person ? '$' : 'KES'}</span>
            <span className="amount">{getPrice()}</span>
            <span className="period">{getPriceLabel()}</span>
          </div>
        </div>
        <button className="btn-request-service" onClick={handleRequestService} aria-label={`Request ${getTitle()} service`}>Request Service</button>
      </div>
    </div>
  );

  const renderRetailCard = () => (
    <div className={`service-card retail-card ${variant} ${isHovered ? 'hovered' : ''} ${className}`}>
      <div className="card-header retail-header">
        <div className="header-content">
          <h5 className="card-title">{getTitle()}</h5>
          {item.stock !== undefined && (
            <span className={`stock-badge ${item.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {item.stock > 0 ? <><CheckCircle size={14} /> {item.stock} in stock</> : <><AlertCircle size={14} /> Out of stock</>}
            </span>
          )}
        </div>
      </div>
      <div className="card-body">
        {item.description && <p className="card-description">{item.description}</p>}
      </div>
      <div className="card-footer retail-footer">
        <div className="price-section">
          <span className="price-label">Price</span>
          <div className="price-display">
            <span className="currency">KES</span>
            <span className="amount">{getPrice()}</span>
          </div>
        </div>
        <button className="btn-request-service" onClick={handleRequestService} disabled={item.stock === 0} aria-label={`Request ${getTitle()} item`}>
          {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );

  const renderDiningCard = () => (
    <div className={`service-card dining-card ${variant} ${isHovered ? 'hovered' : ''} ${className}`}>
      <div className="card-header dining-header">
        <div className="header-content">
          <h5 className="card-title">{getTitle()}</h5>
          {item.prep_time_minutes && <span className="prep-badge"><Clock size={14} /> {item.prep_time_minutes} min</span>}
        </div>
      </div>
      <div className="card-body">
        {item.description && <p className="card-description">{item.description}</p>}
        {item.availability !== undefined && (
          <div className="availability">
            {item.availability
              ? <span className="available"><CheckCircle size={14} /> Available</span>
              : <span className="unavailable"><AlertCircle size={14} /> Not available</span>}
          </div>
        )}
      </div>
      <div className="card-footer dining-footer">
        <div className="price-section">
          <span className="price-label">Price</span>
          <div className="price-display">
            <span className="currency">KES</span>
            <span className="amount">{getPrice()}</span>
          </div>
        </div>
        <button className="btn-request-service" onClick={handleRequestService} disabled={!item.availability} aria-label={`Order ${getTitle()}`}>
          {item.availability !== false ? 'Order Now' : 'Not Available'}
        </button>
      </div>
    </div>
  );

  const renderCard = () => {
    switch (itemType) {
      case 'room': return renderRoomCard();
      case 'service':
      case 'experience': return renderServiceCard();
      case 'retail': return renderRetailCard();
      case 'dining':
      case 'menu-item': return renderDiningCard();
      default: return renderServiceCard();
    }
  };

  return (
    <div
      className="service-card-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {renderCard()}
    </div>
  );
};

ServiceCard.displayName = 'ServiceCard';
export default ServiceCard;
```

---

# File: src/pages/Home.jsx

```jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Building2, Fuel } from 'lucide-react';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Est. 2024 · Kenya's Premier Holdings</span>
          </div>
          <h1 className="hero-title">Welcome to the Penuel Empire</h1>
          <p className="hero-subtitle">Experience unparalleled luxury hospitality and premium services across East Africa</p>
          <button className="hero-cta" onClick={() => navigate('/catalogue')}>
            Explore Our Services<ArrowRight size={20} />
          </button>
        </div>
        <div className="hero-gradient"></div>
      </section>

      <section className="legacy-section">
        <div className="legacy-container">
          <h2>Our Legacy</h2>
          <p className="legacy-text">
            Penuel Empire represents a commitment to excellence, blending timeless heritage
            with contemporary sophistication. We offer two distinct experiences tailored to
            your unique lifestyle—whether you seek ultimate luxury or convenient excellence.
          </p>
        </div>
      </section>

      <section className="properties-section">
        <div className="properties-container">
          <h2 className="properties-title">Discover Our Properties</h2>
          <div className="properties-grid">
            <div className="property-card plaza-card" onClick={() => navigate('/catalogue')}>
              <div className="card-icon"><Building2 size={48} /></div>
              <h3>Penuel Plaza</h3>
              <p>Experience luxury redefined. Five-star hospitality in Amboseli's heart.</p>
              <div className="card-features">
                <span>Premium Rooms</span><span>Fine Dining</span><span>Spa & Wellness</span>
              </div>
              <button className="card-cta">Explore Plaza<ArrowRight size={18} /></button>
            </div>
            <div className="property-card stopover-card" onClick={() => navigate('/catalogue')}>
              <div className="card-icon"><Fuel size={48} /></div>
              <h3>Penuel Stopover</h3>
              <p>Convenient excellence. Premium retail, dining, and services on the move.</p>
              <div className="card-features">
                <span>Express Retail</span><span>Quick Dining</span><span>Auto Services</span>
              </div>
              <button className="card-cta">Explore Stopover<ArrowRight size={18} /></button>
            </div>
          </div>
        </div>
      </section>

      <section className="footer-cta">
        <h2>Ready to Experience Excellence?</h2>
        <p>Join thousands who have chosen Penuel for unmatched service and luxury</p>
        <button className="footer-cta-btn" onClick={() => navigate('/catalogue')}>Browse Services Now</button>
      </section>
    </div>
  );
};

export default Home;
```

---

# File: src/pages/About.jsx

```jsx
import React from 'react';
import { Award, Shield, Zap, Users, TrendingUp, Lock, Sun, Moon } from 'lucide-react';
import { useBusinessContext } from '../context/BusinessContext';
import '../styles/About.css';

const About = () => {
  const { activeBranch, toggleBranch } = useBusinessContext();

  const trustStatsData = {
    plaza: [
      { icon: TrendingUp, number: '25+', label: 'Years Legacy', description: 'Heritage of Excellence' },
      { icon: Award, number: '500+', label: 'Happy Guests', description: 'Luxury Experiences' },
      { icon: Lock, number: '100%', label: 'Satisfaction', description: '5-Star Service' },
    ],
    stopover: [
      { icon: TrendingUp, number: '24/7', label: 'Operations', description: 'Always Available' },
      { icon: Award, number: '50K+', label: 'Travelers Served', description: 'Trusted Service' },
      { icon: Lock, number: '100%', label: 'Quality', description: 'Premium Standards' },
    ],
  };

  const storyContent = {
    plaza: {
      title: 'Penuel Plaza: Where Heritage Meets Luxury',
      paragraphs: [
        'Penuel Plaza represents the pinnacle of African luxury hospitality. Nestled in the heart of Amboseli, our five-star property combines timeless elegance with modern sophistication.',
        'Every detail—from premium linens to curated dining experiences—reflects our commitment to unparalleled service. We craft unforgettable moments.',
        'Our heritage spans decades of hospitality excellence, built on principles of warmth, authenticity, and respect for our guests and communities.',
      ],
      highlights: ['Premium Rooms', 'Fine Dining', 'Spa & Wellness', 'Concierge Services'],
      recognition: 'Industry Recognition: Best Luxury Hotel in East Africa',
    },
    stopover: {
      title: 'Penuel Stopover: Engineering Traveler Excellence',
      paragraphs: [
        'Penuel Stopover is a masterpiece of logistics and innovation. Designed for the modern traveling professional, we combine high-speed service with premium quality.',
        'Our model is engineered for efficiency—express check-in, rapid services, and curated retail—all optimized for travelers who value their time.',
        "From solar-powered operations to advanced automation, we're building the future of convenient premium service across East Africa.",
      ],
      highlights: ['Express Services', 'Solar Powered', 'Smart Retail', 'Logistics Hub'],
      recognition: 'Industry Recognition: Most Innovative Service Hub 2024',
    },
  };

  const storyData = storyContent[activeBranch];
  const trustStats = trustStatsData[activeBranch];

  // [Component render omitted for brevity - full JSX matches source exactly]
  return (
    <div className="about">
      {/* Hero, Switcher, Trust Stats, Brand Story, Standards, Portfolio, Values, Heritage, CTA sections */}
      {/* Full JSX as per source file - see About.jsx in repository */}
    </div>
  );
};

export default About;
```

---

# File: src/pages/Catalogue.jsx

```jsx
import React, { useMemo } from 'react';
import { useBusinessContext } from '../context/BusinessContext';
import { Wrench, MapPin, Clock, Zap, Award } from 'lucide-react';
import '../styles/Catalogue.css';

/**
 * Catalogue.jsx - SEO-Rich, High-Conversion Services Page
 * Reads activeBranch from context, renders Plaza rooms/experiences
 * or Stopover automotive/retail services with conversion badges.
 */

const Catalogue = () => {
  const { activeBranch, toggleBranch, getActiveBranchData, getBranchInfo } = useBusinessContext();
  const branchData = getActiveBranchData();
  const branchInfo = getBranchInfo();

  const serviceGuides = {
    plaza: {
      title: 'What Defines a 5-Star Luxury Stay?',
      subtitle: 'The Penuel Plaza Experience',
      content: [
        { heading: 'Premium Accommodation Excellence', text: 'A true 5-star stay combines luxury accommodation with impeccable service...', keywords: 'Luxury accommodation, premium rooms, 5-star hotel' },
        { heading: 'Concierge & Personal Services', text: 'Our dedicated concierge team anticipates your needs before you ask...', keywords: 'Concierge services, personal attention, hotel services' },
        { heading: 'Executive Dining', text: 'Experience world-class culinary excellence...', keywords: 'Executive dining, fine dining, culinary excellence' },
      ],
    },
    stopover: {
      title: 'The Science of a Perfect Pitstop',
      subtitle: 'Optimized Service for the Traveling Professional',
      content: [
        { heading: 'High-Speed Service Architecture', text: 'Time is precious for traveling professionals...', keywords: 'Express service, quick fuel stops, traveler convenience' },
        { heading: 'Traveler Convenience Hub', text: 'Everything you need in one location...', keywords: 'Traveler stops, convenience services, quality fuel retail' },
        { heading: 'Quality Assurance Standards', text: 'Every service meets our rigorous quality standards...', keywords: 'Quality fuel, automotive services, food safety standards' },
      ],
    },
  };

  const guide = serviceGuides[activeBranch];

  const services = useMemo(() => {
    const serviceList = [];
    if (activeBranch === 'plaza') {
      branchData.rooms?.forEach((room, idx) => {
        serviceList.push({
          id: `room-${idx}`, type: 'room', title: room.type,
          description: room.description || 'Luxurious accommodation',
          price: `${room.rate_nightly} ${branchData.currency}`, icon: '🛏️',
          badge: idx === 0 ? '10% Off First Booking' : null,
          badgeType: idx === 0 ? 'launch-offer' : null,
        });
      });
      branchData.experiences?.forEach((exp, idx) => {
        serviceList.push({
          id: `exp-${idx}`, type: 'experience', title: exp.name,
          description: exp.description,
          price: `${exp.price_per_person} ${branchData.currency}`, icon: '✨',
          badge: 'Member Exclusive', badgeType: 'member',
        });
      });
    } else {
      branchData.units?.automotive?.services?.forEach((service, idx) => {
        serviceList.push({
          id: `auto-${idx}`, type: 'auto', title: service.service_name,
          description: service.description,
          price: `${service.service_fee} ${branchData.currency}`, icon: '🔧',
          badge: 'Launch Offer', badgeType: 'launch-offer',
          features: [`${service.service_duration_minutes} min`],
        });
      });
      branchData.units?.retail?.categories?.forEach((category) => {
        category.items?.slice(0, 2).forEach((item, idx) => {
          serviceList.push({
            id: `retail-${category.name}-${idx}`, type: 'retail', title: item.product,
            description: category.name,
            price: `${item.price} ${branchData.currency}`, icon: '🛍️',
            badge: idx === 0 ? 'Member Exclusive' : null,
            badgeType: idx === 0 ? 'member' : null,
          });
        });
      });
    }
    return serviceList;
  }, [activeBranch, branchData]);

  return (
    <div className="catalogue">
      {/* Header, Branch Toggle, Services Grid, Guide, CTA rendered from JSX */}
      {/* Full implementation as per source file */}
    </div>
  );
};

export default Catalogue;
```

---

# File: src/pages/Login.jsx

```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';
import '../styles/Login.css';

/**
 * Login.jsx - The Auth Gate / Entry Vault
 * Path: /gate
 *
 * SECURITY NOTE:
 * Credentials are hardcoded client-side (DEVELOPMENT ONLY).
 * Password validation is minimum 6 characters only — no real auth.
 * Authentication state stored in localStorage (isAuthenticated, userRole, userEmail).
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

    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!VALID_CREDENTIALS[email]) {
      setError('Invalid email. Please use owner@penuel.com or secretary@penuel.com');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const userRole = VALID_CREDENTIALS[email];

    localStorage.setItem('userRole', userRole);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('isAuthenticated', 'true');

    console.log(`✨ Login successful: ${email} (${userRole})`);
    navigate('/dashboard');
    setLoading(false);
  };

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
            <div className="login-icon"><ShieldCheck size={32} /></div>
            <h2>Access the Portal</h2>
            <p className="login-subtitle">Secure entry for authorized personnel</p>
          </div>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input id="email" type="email" placeholder="owner@penuel.com" value={email}
                  onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input id="password" type="password" placeholder="••••••••" value={password}
                  onChange={(e) => setPassword(e.target.value)} disabled={loading} required />
              </div>
            </div>
            {error && (
              <div className="error-message">
                <AlertCircle size={18} /><span>{error}</span>
              </div>
            )}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Authenticating...' : 'Enter Portal'}
            </button>
          </form>
          <div className="login-footer">
            <p className="demo-note">
              Demo Credentials:<br />
              <code>owner@penuel.com</code> or <code>secretary@penuel.com</code><br />
              Password: any 6+ characters
            </p>
          </div>
        </div>
      </div>
      <div className="login-tech-footer">
        <code>Secure Server: Penuel-HQ-01</code>
      </div>
    </div>
  );
};

export default Login;
```

---

# File: src/pages/DashboardHome.jsx

```jsx
import React, { useMemo } from 'react';
import { useBusinessContext } from '../context/BusinessContext';
import {
  TrendingUp, Users, CheckCircle, Zap, Droplets, Utensils, Clock, Activity,
} from 'lucide-react';
import '../styles/Dashboard.css';

const plazaStats = {
  metrics: [
    { id: 'plaza-revenue', label: 'Monthly Revenue', value: '$124,580', change: '+12.5%', icon: TrendingUp, color: 'var(--secondary-color)' },
    { id: 'plaza-occupancy', label: 'Occupancy Rate', value: '87%', change: '+5.2%', icon: Users, color: 'var(--secondary-color)' },
    { id: 'plaza-vips', label: 'Active VIPs', value: '34', change: '+3 Today', icon: CheckCircle, color: 'var(--secondary-color)' },
    { id: 'plaza-housekeeping', label: 'Housekeeping Status', value: '22/24', change: 'Rooms Clean', icon: Zap, color: 'var(--secondary-color)' },
  ],
  activityFeed: [
    { id: 'plaza-activity-1', icon: Users, message: 'Room 302 Checked In', timestamp: '2 mins ago', type: 'checkin' },
    { id: 'plaza-activity-2', icon: CheckCircle, message: 'Suite 405 Ready for Guest', timestamp: '5 mins ago', type: 'ready' },
    { id: 'plaza-activity-3', icon: Activity, message: 'VIP Event - Grand Ballroom Booked', timestamp: '12 mins ago', type: 'event' },
    { id: 'plaza-activity-4', icon: Zap, message: 'Housekeeping Completed Floor 3', timestamp: '18 mins ago', type: 'housekeeping' },
    { id: 'plaza-activity-5', icon: TrendingUp, message: 'Daily Revenue Target Reached 95%', timestamp: '25 mins ago', type: 'revenue' },
  ],
};

const stopoverStats = {
  metrics: [
    { id: 'stopover-revenue', label: 'Daily Revenue', value: '$3,240', change: '+8.3%', icon: TrendingUp, color: 'var(--secondary-color)' },
    { id: 'stopover-washes', label: 'Cars Washed', value: '48', change: '+6 This Hour', icon: Droplets, color: 'var(--secondary-color)' },
    { id: 'stopover-avg-time', label: 'Avg. Wash Time', value: '12.5 min', change: '-0.8 min', icon: Clock, color: 'var(--secondary-color)' },
    { id: 'stopover-restaurant', label: 'Restaurant Tables', value: '16/20', change: 'Currently Active', icon: Utensils, color: 'var(--secondary-color)' },
  ],
  activityFeed: [
    { id: 'stopover-activity-1', icon: Droplets, message: 'Express Wash Completed - Bay 3', timestamp: '1 min ago', type: 'wash' },
    { id: 'stopover-activity-2', icon: Utensils, message: 'Table 7 Order Submitted', timestamp: '4 mins ago', type: 'restaurant' },
    { id: 'stopover-activity-3', icon: CheckCircle, message: 'Premium Wash Package - Lane 1', timestamp: '8 mins ago', type: 'premium' },
    { id: 'stopover-activity-4', icon: Activity, message: 'Restaurant - Happy Hour Started', timestamp: '15 mins ago', type: 'event' },
    { id: 'stopover-activity-5', icon: TrendingUp, message: 'Daily Target 78% Complete', timestamp: '22 mins ago', type: 'revenue' },
  ],
};

const PulseCard = ({ metric }) => {
  const IconComponent = metric.icon;
  return (
    <div className="dashboard-card pulse-card">
      <div className="pulse-card-icon">
        <IconComponent size={24} style={{ color: metric.color }} />
      </div>
      <div className="pulse-card-content">
        <p className="pulse-card-label">{metric.label}</p>
        <p className="pulse-card-value">{metric.value}</p>
        <p className="pulse-card-change">{metric.change}</p>
      </div>
    </div>
  );
};

const ActivityItem = ({ activity }) => {
  const IconComponent = activity.icon;
  return (
    <div className="activity-item">
      <div className="activity-icon">
        <IconComponent size={16} style={{ color: 'var(--secondary-color)' }} />
      </div>
      <div className="activity-content">
        <p className="activity-message">{activity.message}</p>
        <p className="activity-timestamp">{activity.timestamp}</p>
      </div>
    </div>
  );
};

const PerformanceOverview = ({ activeBranch }) => {
  const title = activeBranch === 'plaza' ? 'Occupancy & Revenue Trend' : 'Wash Volume & Revenue Trend';
  const placeholder = activeBranch === 'plaza'
    ? 'Chart: Monthly occupancy and revenue trends for Plaza'
    : 'Chart: Daily wash volume and revenue trends for Stopover';
  return (
    <div className="performance-overview">
      <h3 className="performance-title">{title}</h3>
      <div className="performance-chart-placeholder">
        <p>{placeholder}</p>
        <p className="placeholder-note">(Chart integration coming soon)</p>
      </div>
    </div>
  );
};

const ActivityFeed = ({ activities }) => (
  <div className="activity-feed">
    <h3 className="activity-feed-title">Live Activity Feed</h3>
    <div className="activity-list">
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  </div>
);

const DashboardHome = () => {
  const { activeBranch } = useBusinessContext();
  const currentStats = useMemo(() => activeBranch === 'plaza' ? plazaStats : stopoverStats, [activeBranch]);
  const pageTitle = activeBranch === 'plaza' ? 'Plaza Overview' : 'Stopover Overview';
  const pageSubtitle = activeBranch === 'plaza' ? 'Premium accommodations and VIP services' : 'Express services and quick stops';

  return (
    <div className="dashboard-main">
      <div className="dashboard-page-header">
        <div className="dashboard-page-title">
          <h1>{pageTitle}</h1>
          <p>{pageSubtitle}</p>
        </div>
      </div>
      <div className="metrics-grid">
        {currentStats.metrics.map((metric) => (
          <PulseCard key={metric.id} metric={metric} />
        ))}
      </div>
      <div className="dashboard-content-split">
        <div className="performance-section">
          <PerformanceOverview activeBranch={activeBranch} />
        </div>
        <div className="activity-section">
          <ActivityFeed activities={currentStats.activityFeed} />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
```

---

# File: src/pages/OperationsFeed.jsx

```jsx
import React, { useMemo, useState } from 'react';
import { useBusinessContext } from '../context/BusinessContext';
import {
  DoorOpen, DoorClosed, Bell, Briefcase, Droplets, AlertCircle,
  UtensilsCrossed, CheckCircle, Clock, AlertTriangle, Zap,
} from 'lucide-react';
import '../styles/Dashboard.css';

// [Full static data arrays and sub-components as per source]
// plazaOperations: 8 items (Check-in, Room Service, Concierge)
// stopoverOperations: 8 items (Wash Queue, Fuel Alert, Food Order)
// StatusBadge, OperationRow, OperationsFilter inline components

const OperationsFeed = () => {
  const { activeBranch } = useBusinessContext();
  const [activeFilter, setActiveFilter] = useState('All');

  const currentOperations = useMemo(
    () => activeBranch === 'plaza' ? plazaOperations : stopoverOperations,
    [activeBranch]
  );

  const filteredOperations = useMemo(
    () => activeFilter === 'All' ? currentOperations : currentOperations.filter((op) => op.type === activeFilter),
    [currentOperations, activeFilter]
  );

  React.useEffect(() => { setActiveFilter('All'); }, [activeBranch]);

  return (
    <div className="dashboard-main">
      {/* Page header, filter buttons, scrollable operations log, stats footer */}
    </div>
  );
};

export default OperationsFeed;
```

---

# File: src/data/plaza.json

```json
{
  "branch": "Penuel Plaza",
  "theme": "Luxury Amboseli",
  "location": "Amboseli National Park Region",
  "currency": "KES",
  "rooms": [
    {
      "id": "room_001",
      "type": "Safari View Standard",
      "capacity": 2,
      "rate_nightly": 120,
      "amenities": ["King-size bed", "Ensuite bathroom", "Balcony with Kilimanjaro view", "Air conditioning", "WiFi"],
      "description": "Comfortable entry-level accommodation with stunning mountain views"
    },
    {
      "id": "room_002",
      "type": "Amboseli Deluxe",
      "capacity": 3,
      "rate_nightly": 160,
      "amenities": ["Twin beds + sofa bed", "Premium ensuite", "Large private balcony", "Air conditioning", "Smart TV", "Mini bar", "WiFi", "Daily housekeeping"],
      "description": "Upgraded accommodation with extended living space and premium services"
    },
    {
      "id": "room_003",
      "type": "Elephant Suite Luxury",
      "capacity": 4,
      "rate_nightly": 200,
      "amenities": ["Master bedroom + lounge", "Marble ensuite with jacuzzi", "Private terrace", "Air conditioning", "Smart TV & entertainment system", "Premium bar", "Concierge service", "WiFi", "Laundry service", "Breakfast included"],
      "description": "Premium suite with exclusive amenities and personalized concierge service"
    }
  ],
  "experiences": [
    {
      "id": "exp_001",
      "name": "Sunrise Safari Game Drive",
      "duration_hours": 3,
      "price_per_person": 85,
      "group_size": "1-6 persons",
      "description": "Guided tour to spot African elephants, lions, giraffes, and zebras at dawn"
    },
    {
      "id": "exp_002",
      "name": "Maasai Cultural Village Visit",
      "duration_hours": 4,
      "price_per_person": 75,
      "group_size": "2-8 persons",
      "description": "Immersive experience with local Maasai community, traditional crafts, and storytelling"
    },
    {
      "id": "exp_003",
      "name": "Mount Kilimanjaro Viewing & Picnic",
      "duration_hours": 5,
      "price_per_person": 95,
      "group_size": "1-4 persons",
      "description": "Premium vantage point with gourmet picnic lunch overlooking iconic peak"
    },
    {
      "id": "exp_004",
      "name": "Spa & Wellness Retreat",
      "duration_hours": 2,
      "price_per_person": 60,
      "group_size": "1-2 persons",
      "description": "In-resort massage, aromatherapy, and meditation overlooking the savanna"
    }
  ],
  "dining": [
    {
      "id": "dining_001",
      "name": "Savanna Kitchen",
      "cuisine": "Pan-African/International",
      "service_hours": "06:00-23:00",
      "capacity": 120,
      "average_meal_price": 45
    },
    {
      "id": "dining_002",
      "name": "Kilimanjaro Bar & Lounge",
      "cuisine": "Beverages/Light Bites",
      "service_hours": "10:00-01:00",
      "capacity": 60,
      "average_drink_price": 12
    }
  ],
  "facilities": [
    "Swimming pool", "Fitness center", "Business center",
    "Conference halls", "Outdoor amphitheater", "Library with local history"
  ],
  "payment_methods": ["Cash KES", "M-Pesa", "International credit cards", "Bank transfers"]
}
```

---

# File: src/data/stopover.json

```json
{
  "branch": "Penuel Stopover",
  "type": "Multi-Service Hub",
  "location": "Highway Rest Stop - Amboseli Corridor",
  "currency": "KES",
  "operating_hours": "24/7",
  "units": {
    "retail": {
      "id": "unit_retail_001",
      "name": "Penuel Express Shop",
      "type": "Retail Convenience",
      "operating_hours": "06:00-23:00",
      "categories": [
        {
          "category_id": "cat_001",
          "name": "Snacks & Beverages",
          "items": [
            { "id": "item_001", "product": "Water (500ml)", "price": 50, "stock": 250 },
            { "id": "item_002", "product": "Energy Drink (330ml)", "price": 120, "stock": 120 },
            { "id": "item_003", "product": "Packaged Snacks Bundle", "price": 200, "stock": 80 }
          ]
        },
        {
          "category_id": "cat_002",
          "name": "Travel Essentials",
          "items": [
            { "id": "item_004", "product": "Phone charger (USB-C)", "price": 350, "stock": 45 },
            { "id": "item_005", "product": "Travel pillow", "price": 280, "stock": 30 },
            { "id": "item_006", "product": "Sunscreen SPF 50", "price": 400, "stock": 50 }
          ]
        },
        {
          "category_id": "cat_003",
          "name": "Local Crafts & Souvenirs",
          "items": [
            { "id": "item_007", "product": "Maasai beaded bracelet", "price": 500, "stock": 35 },
            { "id": "item_008", "product": "Wooden carving (small)", "price": 800, "stock": 20 }
          ]
        }
      ],
      "payment_methods": ["Cash KES", "M-Pesa", "Credit cards", "Digital wallets"]
    },
    "dining": {
      "id": "unit_dining_001",
      "name": "Wayfarer's Kitchen",
      "type": "Quick Service Restaurant",
      "operating_hours": "06:00-23:00",
      "seating_capacity": 80,
      "tables": [
        { "table_id": "table_001", "table_number": "1-10", "capacity_per_table": 4, "status": "available" },
        { "table_id": "table_002", "table_number": "11-20", "capacity_per_table": 2, "status": "available" }
      ],
      "menu_categories": [
        {
          "category_id": "menu_001",
          "name": "Breakfast & Light Meals",
          "items": [
            { "id": "menu_item_001", "dish": "Ugali & Sukuma Wiki", "price": 250, "prep_time_minutes": 10, "availability": true },
            { "id": "menu_item_002", "dish": "Eggs with Toast & Butter", "price": 180, "prep_time_minutes": 8, "availability": true }
          ]
        },
        {
          "category_id": "menu_002",
          "name": "Main Courses",
          "items": [
            { "id": "menu_item_003", "dish": "Grilled Chicken with Chapati", "price": 380, "prep_time_minutes": 20, "availability": true },
            { "id": "menu_item_004", "dish": "Nyama Choma (Beef) with Kachumbari", "price": 450, "prep_time_minutes": 25, "availability": true },
            { "id": "menu_item_005", "dish": "Fish & Chips Platter", "price": 420, "prep_time_minutes": 18, "availability": true }
          ]
        },
        {
          "category_id": "menu_003",
          "name": "Beverages",
          "items": [
            { "id": "menu_item_006", "drink": "Fresh Fruit Juice (500ml)", "price": 120, "prep_time_minutes": 3, "availability": true },
            { "id": "menu_item_007", "drink": "Premium Coffee", "price": 150, "prep_time_minutes": 5, "availability": true }
          ]
        }
      ],
      "payment_methods": ["Cash KES", "M-Pesa", "Card payment"]
    },
    "automotive": {
      "id": "unit_auto_001",
      "name": "Executive Wash & Service Bay",
      "type": "Vehicle Services",
      "operating_hours": "06:00-22:00",
      "bays": [
        { "bay_id": "bay_001", "bay_number": 1, "type": "Wash bay", "status": "available" },
        { "bay_id": "bay_002", "bay_number": 2, "type": "Wash bay", "status": "available" },
        { "bay_id": "bay_003", "bay_number": 3, "type": "Service & maintenance", "status": "available" }
      ],
      "services": [
        { "service_id": "svc_001", "name": "Standard Car Wash", "duration_minutes": 15, "price": 500, "suitable_for": "All vehicles" },
        { "service_id": "svc_002", "name": "Executive Wash (Interior & Exterior)", "duration_minutes": 45, "price": 1200, "suitable_for": "Luxury vehicles" },
        { "service_id": "svc_003", "name": "Oil & Filter Change", "duration_minutes": 30, "price": 1500, "suitable_for": "All vehicles" },
        { "service_id": "svc_004", "name": "Tire Rotation & Alignment", "duration_minutes": 60, "price": 2000, "suitable_for": "All vehicles" },
        { "service_id": "svc_005", "name": "Battery Check & Replacement", "duration_minutes": 20, "price": 3000, "suitable_for": "All vehicles" },
        { "service_id": "svc_006", "name": "Basic Mechanical Inspection", "duration_minutes": 40, "price": 800, "suitable_for": "All vehicles" }
      ],
      "spare_parts": [
        { "part_id": "part_001", "name": "Engine Oil (5L)", "price": 2200, "stock": 15 },
        { "part_id": "part_002", "name": "Air Filter", "price": 400, "stock": 25 },
        { "part_id": "part_003", "name": "Brake Pads (set)", "price": 3500, "stock": 8 }
      ],
      "waiting_lounge": {
        "seating_capacity": 25,
        "amenities": ["WiFi", "TV lounge", "Refreshments", "Restrooms"]
      },
      "payment_methods": ["Cash KES", "M-Pesa", "Card payment", "Invoice (fleet accounts)"]
    }
  },
  "staffing": {
    "retail": 4,
    "dining": 8,
    "automotive": 6
  }
}
```

---

# File: src/styles/App.css

```css
/**
 * Penuel Empire Portal - Elite Unified Theme Engine
 * Philosophy: "One Empire, Multiple Personalities"
 *
 * CSS VARIABLE ARCHITECTURE:
 * - --primary-color: #0a0a0a (Deep Black)
 * - --secondary-color: #d4af37 (Gold, flips to Blue via JS)
 * - body.theme-stopover overrides --secondary-color to #0077b6
 * - All theme changes driven by var(--secondary-color)
 */

:root {
  --primary-color: #0a0a0a;
  --secondary-color: #d4af37;
  --accent-color: #111111;
  --text-color: #ffffff;
  --text-muted: #a0a0a0;
  --accent-light: #e8d9a7;
  --border-accent: #d4af37;
  --card-shadow: rgba(0, 0, 0, 0.3);
  --serif-font: 'Georgia', serif;
  --sans-serif-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  --spacing-xs: 0.25rem; --spacing-sm: 0.5rem; --spacing-md: 1rem;
  --spacing-lg: 1.5rem; --spacing-xl: 2rem; --spacing-2xl: 3rem; --spacing-3xl: 4rem;
  --transition-fast: 0.2s ease; --transition-normal: 0.3s ease; --transition-slow: 0.5s ease;
  --z-dropdown: 100; --z-sticky: 200; --z-fixed: 300; --z-modal: 1000; --z-tooltip: 1100;
}

/* Full CSS omitted for brevity — see src/styles/App.css */
```

---

# File: src/styles/Dashboard.css

```css
/**
 * DASHBOARD.CSS - MASTER SYNC COMPLETE VERSION
 *
 * THEME SYNC MECHANISM:
 * - Default: --secondary-color: #d4af37 (Plaza Gold)
 * - body.theme-stopover overrides: --secondary-color: #0077b6 (Stopover Blue)
 * - All accent colors reference var(--secondary-color) exclusively
 * - Transitions: 0.5s ease on all color-dependent properties
 *
 * LAYOUT:
 * - .dashboard-container: flex column
 * - .dashboard-layout: CSS grid (240px sidebar | 1fr main)
 * - .sidebar: sticky, height calc(100vh - 70px)
 * - .dashboard-header: sticky top:0, z-index:99
 */

:root {
  --primary-color: #0a0a0a;
  --secondary-color: #d4af37;
  --text-color: #ffffff;
  --text-muted: #a0a0a0;
  --accent-color: #111111;
  --accent-light: #e8d9a7;
  --border-accent: #d4af37;
  --card-shadow: rgba(0, 0, 0, 0.3);
}

body.theme-stopover {
  --secondary-color: #0077b6;
  --border-accent: #0077b6;
}

/* Full CSS omitted for brevity — see src/styles/Dashboard.css */
```

---

# File: src/styles/DashboardHome.css

```css
/**
 * DashboardHome.css - Additional Styles for Smart Dashboard
 *
 * KEY CLASSES:
 * - .metrics-grid: repeat(auto-fit, minmax(240px, 1fr))
 * - .pulse-card: flex row, border uses var(--secondary-color)
 * - .dashboard-content-split: grid 70% / 30%
 * - .performance-overview: chart placeholder area
 * - .activity-feed: max-height 400px, overflow-y auto
 * - .activity-item: individual feed row with icon + text
 */

/* Full CSS omitted for brevity — see src/styles/DashboardHome.css */
```

---

# File: src/styles/Navbar.css

```css
/**
 * Navbar.css - Old Money Luxury Aesthetic
 *
 * KEY DESIGN:
 * - .navbar: sticky, backdrop-filter blur(10px)
 * - .nav-link::after: 2px underline, width animates 0→100% on hover/active
 * - .navbar-mobile-menu: absolute positioned dropdown
 * - All accent colors via var(--secondary-color)
 */

/* Full CSS omitted for brevity — see src/styles/Navbar.css */
```

---

# File: src/styles/Login.css

```css
/**
 * Login.css - High-End Entry Vault
 *
 * KEY DESIGN:
 * - .login-container: fixed full-screen, z-index 2000
 * - .login-card: backdrop-filter blur(40px) glassmorphism
 * - .login-vault: animation vaultSlideUp 1.2s
 * - VALID_CREDENTIALS hardcoded client-side (DEV ONLY)
 * - Authentication via localStorage only (no server)
 */

/* Full CSS omitted for brevity — see src/styles/Login.css */
```

---

# File: src/styles/About.css

```css
/**
 * About.css - High-Conversion Trust & Authority Page
 *
 * KEY SECTIONS:
 * - .about-hero: min-height 50vh, gradient background
 * - .trust-bar: padding 8rem, 3-column stats grid
 * - .story-grid: 2-column layout, desktop only
 * - .timeline: centered with ::before vertical line
 * - .about-cta: gold gradient background
 */

/* Full CSS omitted for brevity — see src/styles/About.css */
```

---

# File: src/styles/Catalogue.css

```css
/**
 * Catalogue.css - SEO-Rich, High-Conversion Services Page
 *
 * KEY SECTIONS:
 * - .branch-section: sticky top:70px, z-index:99
 * - .service-card: glass-effect, hover shimmer via ::before
 * - .service-badge: .member (gold fill) | .launch-offer (gold outline)
 * - .guide-block: border-left 3px var(--secondary-color) accent
 * - .catalogue-cta: gold gradient full-width section
 */

/* Full CSS omitted for brevity — see src/styles/Catalogue.css */
```

---

# File: src/styles/Home.css

```css
/**
 * Home.css
 *
 * KEY SECTIONS:
 * - .hero-section: min-height 100vh, radial gradient overlay
 * - .hero-badge / .hero-title / .hero-cta: staggered fadeInUp animations
 * - .property-card: hover translateY(-8px), shimmer ::before
 * - .card-features: pill badges using var(--secondary-color)
 */

/* Full CSS omitted for brevity — see src/styles/Home.css */
```

---

# File: src/styles/index.css

```css
/**
 * index.css - Global Styles & Resets
 *
 * Covers: CSS reset, typography defaults, form element normalization,
 * Bootstrap container overrides, utility classes, scrollbar, selection,
 * focus-visible, print styles, reduced-motion support.
 *
 * NOTE: This file uses a light color scheme (#2c2416 text on #fafaf8 bg)
 * which CONFLICTS with App.css dark theme. App.css effectively overrides
 * these defaults for all themed routes.
 */

/* Full CSS omitted for brevity — see src/styles/index.css */
```

---

# File: src/components/shared/ServiceCard.css

```css
/**
 * ServiceCard.css - Reusable card component styles
 *
 * KEY CLASSES:
 * - .service-card-wrapper: hover trigger container
 * - .card-header: gradient background, flex row
 * - .amenity-item: pill with hover translateX(4px)
 * - .btn-request-service: gradient background, disabled state
 * - .service-card.premium: ::before star badge
 * - .service-card.compact: no shadow, stacked footer
 */

/* Full CSS omitted for brevity — see src/components/shared/ServiceCard.css */
```

---

# File: src/components/shared/ServiceCard.md

```markdown
# ServiceCard Component Documentation

## Type Detection Logic
rate_nightly?  → 'room'
dish?          → 'dining'
product?       → 'retail'
service?       → 'service'
duration_minutes && price? → 'experience'
prep_time_minutes? → 'menu-item'
else → 'generic'

## Props
- item (required): data object
- variant: 'default' | 'premium' | 'compact'
- onRequestService: callback
- className: string

## Variants
- default: standard card
- premium: gold border, star badge ::before
- compact: no shadow, minimal padding

## Console Logging
On button click: console.log('🔔 Service Request Logged:', {itemId, itemType, itemName, price, timestamp})
```

---

# File: src/stopover.js

> ⚠️ NOTE: This file appears to be a duplicate of `src/data/stopover.json` placed at the wrong path (`src/stopover.js`). It contains JSON data but has a `.js` extension. This is a structural issue.

```json
{
  "branch": "Penuel Stopover",
  "type": "Multi-Service Hub",
  "location": "Highway Rest Stop - Amboseli Corridor",
  "currency": "KES",
  "operating_hours": "24/7"
}
```
*(Full content identical to src/data/stopover.json — see that file)*

---

# AUDIT FINDINGS SUMMARY

## Architecture Overview

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | React 18 + Vite 5 | Module-based, StrictMode enabled |
| Routing | react-router-dom v6 | BrowserRouter in index.jsx |
| State | React Context (BusinessContext) | No Redux/Zustand |
| Styling | Plain CSS + CSS Variables | No CSS-in-JS |
| Auth | localStorage only | No server-side session |
| Data | Static JSON files | No API calls in Milestone 1 |
| Payments | Placeholder only | M-Pesa pending Milestone 2 |

## Critical Security Issues

### 🔴 HIGH — Client-Side Credentials (Login.jsx)
```js
const VALID_CREDENTIALS = {
  'owner@penuel.com': 'owner',
  'secretary@penuel.com': 'secretary',
};
```
- Credentials fully exposed in browser devtools
- Password check is only `password.length < 6` — any 6+ char string works
- No hashing, no server validation

### 🔴 HIGH — localStorage Authentication (DashboardLayout.jsx)
```js
const isAuthenticated = localStorage.getItem('isAuthenticated');
```
- Any user can set `localStorage.setItem('isAuthenticated', 'true')` in console
- Role stored as plaintext: `localStorage.getItem('userRole')` → `'owner'` or `'secretary'`
- No JWT, no session token, no CSRF protection

### 🔴 HIGH — Owner-Only Routes Not Protected
- `/dashboard/financials`, `/dashboard/settings`, `/dashboard/aura` render for any authenticated user
- Role check exists in **Sidebar** menu visibility but NOT in route-level guards
- A secretary can directly navigate to `/dashboard/financials`

### 🟡 MEDIUM — M-Pesa Config Logged to Console (BusinessContext.jsx)
```js
console.log("Expected M-Pesa Config:", mpesaConfig);
```
- When Milestone 2 is implemented, this will log real API keys to browser console
- `import.meta.env` variables are bundled into client-side JS by Vite

### 🟡 MEDIUM — Duplicate File: src/stopover.js
- JSON data duplicated outside `src/data/` with `.js` extension
- Risk of data drift between `src/data/stopover.json` and `src/stopover.js`

### 🟡 MEDIUM — No Input Sanitization on Search
- `DashboardHeader.jsx` search input has no sanitization or XSS protection
- Currently cosmetic only (no `TODO` implementation), but poses future risk

### 🟢 LOW — CSS Variable Duplication
- `:root` variables defined in both `App.css` and `Dashboard.css`
- `index.css` light theme conflicts with `App.css` dark theme

### 🟢 LOW — Theme Sync Redundancy
- `AURA SYNC` logic duplicated across App.jsx, DashboardLayout.jsx, DashboardHeader.jsx, and Sidebar.jsx
- All four independently call `document.body.classList` and CSS variable updates
- Should be consolidated into a single `useEffect` in BusinessContext or DashboardLayout

### 🟢 LOW — Missing vite.config.js
- `vite.config.js` not present in provided files (may exist but was not shared)
- Cannot audit environment variable exposure, build targets, or proxy config

## Component Dependency Map

```
index.jsx
└── BrowserRouter
    └── BusinessProvider (BusinessContext.jsx)
        └── App.jsx
            ├── Navbar.jsx
            ├── Home.jsx
            ├── About.jsx
            ├── Catalogue.jsx
            │   └── ServiceCard.jsx (shared)
            ├── Login.jsx → localStorage
            └── DashboardLayout.jsx → localStorage
                ├── DashboardHeader.jsx
                ├── Sidebar.jsx
                └── [page components]
                    ├── DashboardHome.jsx
                    └── OperationsFeed.jsx
```

## Data Flow

```
plaza.json ──┐
             ├── BusinessContext (activeBranch state)
stopover.json┘       │
                      ├── Catalogue.jsx (getActiveBranchData)
                      ├── ServiceCard.jsx (getActiveBranchTheme)
                      ├── DashboardHome.jsx (activeBranch direct)
                      └── About.jsx (activeBranch direct)
```

---

*End of consolidated audit source — Penuel Empire Portal v1.0*
