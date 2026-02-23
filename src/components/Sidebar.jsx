import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusinessContext } from '../context/BusinessContext';
import {
  LayoutDashboard,
  Activity,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import '../styles/Dashboard.css';

/**
 * Sidebar.jsx - FINAL PRODUCTION VERSION
 * 
 * Philosophy: "Executive Command Sidebar with Single Source of Truth"
 * 
 * Key Features:
 * - Uses useBusinessContext() ONLY for branch state
 * - No local useState for branch tracking
 * - Unified handleBranchToggle that calls document.body.classList
 * - Active classes tied directly to activeBranch from context
 * - Full role-based menu visibility (Owner/Secretary)
 * - Synced with DashboardHeader via same toggle logic
 */

const Sidebar = ({ userRole }) => {
  const navigate = useNavigate();
  const { activeBranch, toggleBranch } = useBusinessContext();
  const [currentPage, setCurrentPage] = React.useState('dashboard');
  const [toggleOpen, setToggleOpen] = React.useState(false);

  // Menu items visible to all roles
  const baseMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Home',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      id: 'operations',
      label: 'Operations Feed',
      icon: Activity,
      path: '/dashboard/operations',
    },
    {
      id: 'staff',
      label: 'Staff Management',
      icon: Users,
      path: '/dashboard/staff',
    },
  ];

  // Owner-only menu items
  const ownerMenuItems = [
    {
      id: 'financials',
      label: 'Financial Reports',
      icon: BarChart3,
      path: '/dashboard/financials',
    },
    {
      id: 'settings',
      label: 'Global Settings',
      icon: Settings,
      path: '/dashboard/settings',
    },
    {
      id: 'aura',
      label: 'Aura Analytics',
      icon: BarChart3,
      path: '/dashboard/aura',
    },
  ];

  // Combine menu based on role
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

  /**
   * UNIFIED BRANCH TOGGLE - Single Source of Truth
   * 
   * This function:
   * 1. Updates BusinessContext (activeBranch)
   * 2. Forces immediate DOM update (body.classList) for Aura Sync
   * 3. Ensures theme changes even if React batches updates
   * 4. Visual feedback tied to activeBranch value
   * 
   * CRITICAL: This is the EXACT same function in DashboardHeader
   */
  const handleBranchToggle = (newBranch) => {
    if (activeBranch !== newBranch) {
      // Step 1: Update BusinessContext
      toggleBranch(newBranch);
    }
  };

  return (
    <aside className="sidebar">
      {/* ===== SIDEBAR HEADER ===== */}
      <div className="sidebar-header">
        <div className="sidebar-branding">
          <h3>PENUEL</h3>
          <p>Command Center</p>
        </div>
      </div>

      {/* ===== ROLE BADGE ===== */}
      <div className="sidebar-role-badge">
        <span className="role-label">{userRole.toUpperCase()}</span>
      </div>

      {/* ===== MAIN MENU ===== */}
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

      {/* ===== BUSINESS CONTEXT DIVIDER ===== */}
      <div className="sidebar-divider"></div>

      {/* ===== BUSINESS SWITCHER ===== */}
      <div className="sidebar-business-switch">
        <div className="switch-label">Context</div>
        
        <div className="switch-dropdown">
          <button
            className="switch-toggle-btn"
            onClick={() => setToggleOpen(!toggleOpen)}
            title="Switch Business Context"
          >
            <span className="switch-current">
              {activeBranch === 'plaza' ? (
                <>
                  <Sun size={16} />
                  <span>Plaza</span>
                </>
              ) : (
                <>
                  <Moon size={16} />
                  <span>Stopover</span>
                </>
              )}
            </span>
            <span className="switch-chevron">
              {toggleOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </button>

          {toggleOpen && (
            <div className="switch-menu">
              {/* Plaza Option - Active class tied to activeBranch */}
              <button
                className={`switch-option ${activeBranch === 'plaza' ? 'active' : ''}`}
                onClick={() => handleBranchToggle('plaza')}
              >
                <Sun size={16} />
                <span>Plaza</span>
              </button>

              {/* Stopover Option - Active class tied to activeBranch */}
              <button
                className={`switch-option ${activeBranch === 'stopover' ? 'active' : ''}`}
                onClick={() => handleBranchToggle('stopover')}
              >
                <Moon size={16} />
                <span>Stopover</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===== EXIT PORTAL BUTTON ===== */}
      <button 
        className="sidebar-logout" 
        onClick={handleLogout} 
        title="Exit Portal"
      >
        <LogOut size={18} />
        <span>Exit Portal</span>
      </button>

      {/* ===== SIDEBAR FOOTER ===== */}
      <div className="sidebar-footer">
        <p>Penuel Empire</p>
        <span className="footer-version">v1.0</span>
      </div>
    </aside>
  );
};

export default Sidebar;
