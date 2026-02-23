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
 * DashboardHeader.jsx — Search-Sanitized + DOM-Clean Version
 *
 * CHANGES FROM PREVIOUS VERSION:
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. handleSearch:  now sanitizes input before storing it in state.
 *    A regex strips all HTML tags (< ... >) before the value is written to
 *    `searchQuery`, preventing XSS payloads from ever reaching React's
 *    virtual DOM as raw markup.  The sanitized query + current branch are
 *    logged so the backend integration point is immediately obvious.
 *
 * 2. handleBranchToggle: calls only toggleBranch(newBranch).  No
 *    document.body.classList or root.style.setProperty — those side-effects
 *    are owned exclusively by the useEffect in BusinessContext.jsx.
 *
 * 3. JSDoc comment block updated to reflect current (accurate) architecture.
 */

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const ROUTE_LABELS = {
  '/dashboard':             'Dashboard Home',
  '/dashboard/operations':  'Operations Feed',
  '/dashboard/staff':       'Staff Management',
  '/dashboard/financials':  'Financial Reports',
  '/dashboard/settings':    'Global Settings',
  '/dashboard/aura':        'Aura Analytics',
};

/**
 * sanitizeInput
 *
 * Strips every HTML tag from a raw string using a single regex pass.
 *
 * Mechanism: replaces any sequence starting with '<', containing any
 * characters (non-greedy), and ending with '>' — i.e. the pattern
 * for any HTML or pseudo-HTML tag.
 *
 * Examples:
 *   sanitizeInput('<script>alert(1)</script>') → 'alert(1)'
 *   sanitizeInput('<img src=x onerror=alert(1)>') → ''
 *   sanitizeInput('<b>bold</b>')                → 'bold'
 *   sanitizeInput('room 302')                   → 'room 302'  (unchanged)
 *
 * MILESTONE 2: Replace with DOMPurify.sanitize(value, { ALLOWED_TAGS: [] })
 * for comprehensive sanitization including encoded entities (&lt; etc.).
 *
 * @param {string} raw - The raw string from the input event.
 * @returns {string} The string with all HTML tags removed.
 */
const sanitizeInput = (raw) => raw.replace(/<[^>]*>/g, '');

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const DashboardHeader = () => {
  const location = useLocation();
  const { activeBranch, toggleBranch } = useBusinessContext();

  const [searchFocus,      setSearchFocus]      = useState(false);
  const [searchQuery,      setSearchQuery]      = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [exportOpen,       setExportOpen]       = useState(false);
  const [unreadCount,      setUnreadCount]      = useState(3);

  // Breadcrumb — auto-updates on every navigation.
  const currentPage = ROUTE_LABELS[location.pathname] || 'Dashboard';

  // ─────────────────────────────────────────────────────────────────────────
  // BRANCH TOGGLE
  //
  // Delegates entirely to BusinessContext. The context's useEffect watches
  // activeBranch and applies all DOM / CSS variable changes in one place.
  // This component has ZERO direct DOM manipulation for theming.
  // ─────────────────────────────────────────────────────────────────────────
  const handleBranchToggle = (newBranch) => {
    if (activeBranch !== newBranch) {
      toggleBranch(newBranch);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SEARCH — XSS SANITIZATION
  //
  // Flow:
  //   1. User types in the search input (onChange fires).
  //   2. Raw value passes through sanitizeInput() — all HTML tags stripped.
  //   3. The SANITIZED string is written to state — never the raw value.
  //   4. React renders the controlled input with `value={searchQuery}`, so
  //      the input box itself reflects the stripped text instantly.
  //   5. The sanitized query + activeBranch are logged, marking the exact
  //      integration point where a backend fetch call will go.
  //
  // Why store sanitized (not raw) in state?
  //   Because `value={searchQuery}` means the input renders whatever is in
  //   state. Storing the sanitized string gives the user immediate visual
  //   feedback that HTML tags are being stripped — and ensures no downstream
  //   consumer of `searchQuery` can receive a dirty string.
  // ─────────────────────────────────────────────────────────────────────────
  const handleSearch = (e) => {
    const sanitized = sanitizeInput(e.target.value);
    setSearchQuery(sanitized);

    // Backend integration point — these two values are all a search API needs.
    // MILESTONE 2: Replace this log with:
    //   fetch(`/api/search?q=${encodeURIComponent(sanitized)}&branch=${activeBranch}`)
    if (import.meta.env.DEV) {
      console.log(`[Search] Query: "${sanitized}" | Branch: ${activeBranch}`);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // EXPORT / NOTIFICATION HANDLERS (unchanged in logic, console guards added)
  // ─────────────────────────────────────────────────────────────────────────
  const handleExportClick = (format) => {
    // MILESTONE 2: POST /api/export { format, branch: activeBranch }
    if (import.meta.env.DEV) {
      console.log(`[Export] Format: ${format} | Branch: ${activeBranch}`);
    }
    setExportOpen(false);
  };

  const handleNotificationClick = (notificationId) => {
    // MILESTONE 2: PATCH /api/notifications/${notificationId}/read
    if (import.meta.env.DEV) {
      console.log(`[Notification] Marked read: ${notificationId}`);
    }
    if (unreadCount > 0) {
      setUnreadCount(unreadCount - 1);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <header className="dashboard-header">

      {/* ===== LEFT: BREADCRUMB + SEARCH ===== */}
      <div className="header-left">

        {/* Breadcrumb */}
        <div className="header-breadcrumb">
          <span className="breadcrumb-root">Dashboard</span>
          <ChevronRight size={16} className="breadcrumb-separator" />
          <span className="breadcrumb-current">{currentPage}</span>
        </div>

        {/* Search — `value` is always the sanitized string from state */}
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
            aria-label="Search dashboard"
            maxLength={200}
          />
        </div>
      </div>

      {/* ===== RIGHT: STATUS + SWITCHER + ACTIONS ===== */}
      <div className="header-right">

        {/* System Heartbeat */}
        <div className="system-heartbeat">
          <div className="heartbeat-dot"></div>
          <span className="heartbeat-label">Live Sync</span>
        </div>

        {/* Segmented Branch Switcher */}
        <div className="context-switcher">
          {/* Sliding background — position driven by CSS class, not JS */}
          <div className={`switcher-slider ${activeBranch}`}></div>

          <button
            className={`switcher-segment plaza-segment ${activeBranch === 'plaza' ? 'active' : ''}`}
            onClick={() => handleBranchToggle('plaza')}
            title="Switch to Plaza"
            aria-label="Plaza Context"
            aria-pressed={activeBranch === 'plaza'}
          >
            <Sun size={18} />
            <span>Plaza</span>
          </button>

          <button
            className={`switcher-segment stopover-segment ${activeBranch === 'stopover' ? 'active' : ''}`}
            onClick={() => handleBranchToggle('stopover')}
            title="Switch to Stopover"
            aria-label="Stopover Context"
            aria-pressed={activeBranch === 'stopover'}
          >
            <Moon size={18} />
            <span>Stopover</span>
          </button>
        </div>

        {/* Action Icons */}
        <div className="header-actions">

          {/* Export */}
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

          {/* Notifications */}
          <div className="notification-container">
            <button
              className="action-btn notification-btn"
              onClick={() => setNotificationOpen(!notificationOpen)}
              title="Notifications"
              aria-label={`Notifications — ${unreadCount} unread`}
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
                  <button
                    className="close-btn"
                    onClick={() => setNotificationOpen(false)}
                    aria-label="Close notifications"
                  >
                    ×
                  </button>
                </div>

                <div className="notifications-content">
                  <div
                    className="notification-item"
                    onClick={() => handleNotificationClick(1)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="notification-dot-small"></div>
                    <div className="notification-text">
                      <p className="notification-title">System Update</p>
                      <p className="notification-time">2 minutes ago</p>
                    </div>
                  </div>

                  <div
                    className="notification-item"
                    onClick={() => handleNotificationClick(2)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="notification-dot-small"></div>
                    <div className="notification-text">
                      <p className="notification-title">New Staff Member Added</p>
                      <p className="notification-time">15 minutes ago</p>
                    </div>
                  </div>

                  <div
                    className="notification-item"
                    onClick={() => handleNotificationClick(3)}
                    role="button"
                    tabIndex={0}
                  >
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
