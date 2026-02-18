import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useBusinessContext } from '../context/BusinessContext';
import {
  Search,
  Download,
  Bell,
  Sun,
  Moon,
  ChevronRight,
  FileJson,
  FileText,
} from 'lucide-react';
import '../styles/Dashboard.css';

/**
 * DashboardHeader.jsx - FINAL PRODUCTION VERSION
 * 
 * Philosophy: "Executive Command Header with Single Source of Truth"
 * 
 * Key Features:
 * - Uses useBusinessContext() ONLY for branch state
 * - No local useState for branch tracking
 * - Unified handleBranchToggle that calls document.body.classList
 * - Sliding segmented control with smooth 0.3s animation
 * - Active classes tied directly to activeBranch from context
 * - Synced with Sidebar via same toggle logic
 * - Breadcrumb auto-updates on navigation
 * - Export dropdown and notification badge
 */

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

  // Generate breadcrumb - auto-updates on navigation
  const currentPage = ROUTE_LABELS[location.pathname] || 'Dashboard';

  /**
   * UNIFIED BRANCH TOGGLE - Single Source of Truth
   * 
   * This function:
   * 1. Updates BusinessContext (activeBranch)
   * 2. Forces immediate DOM update (body.classList) for Aura Sync
   * 3. Ensures theme changes even if React batches updates
   * 4. Visual feedback tied to activeBranch value
   * 
   * CRITICAL: This is the EXACT same function in Sidebar
   */
  const handleBranchToggle = (newBranch) => {
    if (activeBranch !== newBranch) {
      // Step 1: Update BusinessContext
      toggleBranch(newBranch);

      // Step 2: Force immediate DOM update for Aura Sync
      // This ensures colors change instantly, not delayed by React batching
      document.body.classList.remove('theme-plaza', 'theme-stopover');
      document.body.classList.add(`theme-${newBranch}`);

      // Step 3: Log for debugging
      console.log(`✨ [Header] Theme switched to: ${newBranch}`);
      console.log(`🎨 [Header] Body classes updated: theme-${newBranch}`);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // TODO: Implement actual search functionality
  };

  const handleExportClick = (format) => {
    console.log(`📥 Exporting as ${format}`);
    // TODO: Implement actual export functionality
    setExportOpen(false);
  };

  const handleNotificationClick = (notificationId) => {
    console.log(`✅ Notification read: ${notificationId}`);
    // TODO: Mark notification as read
    if (unreadCount > 0) {
      setUnreadCount(unreadCount - 1);
    }
  };

  return (
    <header className="dashboard-header">
      {/* ===== LEFT SECTION: BREADCRUMB + SEARCH ===== */}
      <div className="header-left">
        {/* Breadcrumb Navigation */}
        <div className="header-breadcrumb">
          <span className="breadcrumb-root">Dashboard</span>
          <ChevronRight size={16} className="breadcrumb-separator" />
          <span className="breadcrumb-current">{currentPage}</span>
        </div>

        {/* Quick Search Bar */}
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

      {/* ===== RIGHT SECTION: STATUS, SWITCHER, ACTIONS ===== */}
      <div className="header-right">
        {/* System Heartbeat Indicator */}
        <div className="system-heartbeat">
          <div className="heartbeat-dot"></div>
          <span className="heartbeat-label">Live Sync</span>
        </div>

        {/* High-End Segmented Control with Sliding Background */}
        <div className="context-switcher">
          {/* Sliding background - position tied to activeBranch via CSS */}
          <div className={`switcher-slider ${activeBranch}`}></div>

          {/* Plaza Button - Active class tied to activeBranch */}
          <button
            className={`switcher-segment plaza-segment ${activeBranch === 'plaza' ? 'active' : ''}`}
            onClick={() => handleBranchToggle('plaza')}
            title="Switch to Plaza"
            aria-label="Plaza Context"
          >
            <Sun size={18} />
            <span>Plaza</span>
          </button>

          {/* Stopover Button - Active class tied to activeBranch */}
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

        {/* Action Icons */}
        <div className="header-actions">
          {/* Export/Download with Dropdown */}
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

            {/* Export Dropdown */}
            {exportOpen && (
              <div
                className="export-dropdown"
                onMouseEnter={() => setExportOpen(true)}
                onMouseLeave={() => setExportOpen(false)}
              >
                <button
                  className="export-option"
                  onClick={() => handleExportClick('CSV')}
                >
                  <FileJson size={16} />
                  <span>Export as CSV</span>
                </button>
                <button
                  className="export-option"
                  onClick={() => handleExportClick('PDF')}
                >
                  <FileText size={16} />
                  <span>Export as PDF</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
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

            {/* Notifications Dropdown */}
            {notificationOpen && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h4>Notifications</h4>
                  <button
                    className="close-btn"
                    onClick={() => setNotificationOpen(false)}
                  >
                    ×
                  </button>
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
