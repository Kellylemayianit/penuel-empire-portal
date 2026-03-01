import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusinessContext } from '../context/BusinessContext';
import {
  LayoutDashboard,
  Activity,
  Users,
  BarChart3,
  Settings,
  Sparkles,       // replaces duplicate BarChart3 for Aura Analytics
  LogOut,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  Wrench,         // Car Wash dept workspace
  UtensilsCrossed,// Restaurant dept workspace
  ShoppingCart,   // Supermarket dept workspace
  Cog,            // Service Bay dept workspace
} from 'lucide-react';
import '../styles/Dashboard.css';

/**
 * Sidebar.jsx — Dept-Aware Navigation (v2)
 *
 * CHANGES FROM v1:
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. PROPS: { userRole, userDept }
 *      v1 accepted only userRole.  userDept is now accepted so the sidebar
 *      can display the department badge and inject the dept workspace link.
 *
 * 2. COMPLETE LOGOUT — all 4 localStorage keys cleared:
 *      v1 omitted 'userDept'. On v1 logout the key survived in localStorage,
 *      meaning a second login on the same browser could inherit a stale dept
 *      value before the new login wrote its own.  All four keys are now
 *      explicitly removed together:
 *        • isAuthenticated
 *        • userRole
 *        • userDept      ← was missing in v1
 *        • userEmail
 *
 * 3. ROLE-GATED MENU — owner-only items are hidden for staff:
 *      v1 appended ownerMenuItems to the combined array unconditionally for
 *      owners and excluded them for staff — but the exclusion was already
 *      correct. The change here is to make the gate explicit:
 *        const isOwner = userRole === 'owner';
 *      and gate the three owner-only items (Financials, Settings, Aura) on
 *      isOwner only. This replaces the previous role-string comparison spread
 *      across two separate arrays and a ternary, making future role additions
 *      a single-line change.
 *
 * 4. DEPT WORKSPACE LINK — injected for staff only:
 *      Staff members get one additional nav item: their dept-specific workspace
 *      at /dashboard/dept/<dept>.  The label, icon, and path are all derived
 *      from userDept via DEPT_CONFIG.  Owner does not see this item because
 *      the owner has direct links to all four dept workspaces via a separate
 *      section (future Milestone 3 feature), and showing a single random dept
 *      link in the owner view would be misleading.
 *
 *      DEPT_CONFIG maps every valid dept to:
 *        label  — human-readable nav label
 *        icon   — Lucide icon component
 *        path   — the Tier 3 route defined in App.jsx
 *
 * 5. DEPT BADGE DISPLAY:
 *      The role badge now shows both ROLE and DEPT on two lines when userDept
 *      is present.  The dept string is converted to Title Case for display
 *      (e.g. 'carwash' → 'Carwash', 'restaurant' → 'Restaurant').
 *      This gives staff an immediate visual confirmation of which dept context
 *      they are in without requiring any additional API call.
 *
 * 6. ICON DEDUPLICATION:
 *      v1 used BarChart3 for both Financial Reports and Aura Analytics.
 *      Aura now uses Sparkles, which is semantically more appropriate for
 *      an analytics/insight feature and avoids the duplicate icon confusion.
 *
 * MENU ARCHITECTURE:
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   ALL ROLES
 *   ├── Dashboard Home          /dashboard
 *   ├── Operations Feed         /dashboard/operations
 *   └── Staff Management        /dashboard/staff
 *
 *   STAFF ONLY (injected from DEPT_CONFIG)
 *   └── <Dept> Workspace        /dashboard/dept/<dept>
 *
 *   OWNER ONLY
 *   ├── Financial Reports       /dashboard/financials
 *   ├── Global Settings         /dashboard/settings
 *   └── Aura Analytics          /dashboard/aura
 *
 * UNCHANGED FROM v1:
 * ─────────────────────────────────────────────────────────────────────────────
 *   • handleBranchToggle — delegates to toggleBranch(newBranch), no DOM mutation
 *   • Branch switcher dropdown — Sun/Moon + Plaza/Stopover options
 *   • Exit Portal button
 *   • Sidebar footer (Penuel Empire · v1.0)
 *   • All CSS class names — no stylesheet changes required
 */

// ─────────────────────────────────────────────────────────────────────────────
// DEPT CONFIG
// Maps each valid userDept value to its display label, nav icon, and route.
// Add a new entry here whenever a new department is created.
// ─────────────────────────────────────────────────────────────────────────────
const DEPT_CONFIG = {
  carwash: {
    label: 'Car Wash Workspace',
    icon:  Wrench,
    path:  '/dashboard/dept/carwash',
  },
  service: {
    label: 'Service Bay Workspace',
    icon:  Cog,
    path:  '/dashboard/dept/service',
  },
  restaurant: {
    label: 'Restaurant Workspace',
    icon:  UtensilsCrossed,
    path:  '/dashboard/dept/restaurant',
  },
  supermarket: {
    label: 'Supermarket Workspace',
    icon:  ShoppingCart,
    path:  '/dashboard/dept/supermarket',
  },
  // 'executive' intentionally omitted — owner has master access to all Tier 3
  // routes and will navigate directly rather than via a single dept link.
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * toTitleCase
 * Converts a dept slug to a display-ready title.
 * 'carwash' → 'Carwash', 'restaurant' → 'Restaurant'
 */
const toTitleCase = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

// ─────────────────────────────────────────────────────────────────────────────
// MENU DEFINITIONS
// Defined outside the component so the arrays are stable across renders.
// ─────────────────────────────────────────────────────────────────────────────

/** Items visible to every authenticated user regardless of role or dept. */
const BASE_MENU_ITEMS = [
  {
    id:    'dashboard',
    label: 'Dashboard Home',
    icon:  LayoutDashboard,
    path:  '/dashboard',
  },
  {
    id:    'operations',
    label: 'Operations Feed',
    icon:  Activity,
    path:  '/dashboard/operations',
  },
  {
    id:    'staff',
    label: 'Staff Management',
    icon:  Users,
    path:  '/dashboard/staff',
  },
];

/** Items visible to the owner only. Hidden for all staff roles. */
const OWNER_MENU_ITEMS = [
  {
    id:    'financials',
    label: 'Financial Reports',
    icon:  BarChart3,
    path:  '/dashboard/financials',
  },
  {
    id:    'settings',
    label: 'Global Settings',
    icon:  Settings,
    path:  '/dashboard/settings',
  },
  {
    id:    'aura',
    label: 'Aura Analytics',
    icon:  Sparkles,        // was BarChart3 in v1 — deduplicated
    path:  '/dashboard/aura',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const Sidebar = ({ userRole, userDept }) => {
  const navigate = useNavigate();
  const { activeBranch, toggleBranch } = useBusinessContext();

  const [currentPage, setCurrentPage] = React.useState('dashboard');
  const [toggleOpen,  setToggleOpen]  = React.useState(false);

  // Pre-compute role flag once — used in three places below.
  const isOwner = userRole === 'owner';

  // ───────────────────────────────────────────────────────────────────────────
  // MENU ASSEMBLY
  //
  // Build the final menu array in three steps:
  //   1. Start with the base items every user sees.
  //   2. If this is a staff user (not owner) AND their dept has a workspace
  //      configured in DEPT_CONFIG, append that dept workspace link.
  //   3. If this is an owner, append the three owner-only items.
  //
  // Why append dept link before owner items?
  //   Visual hierarchy: base navigation first, then the most role-specific
  //   item, then the elevated-privilege items at the bottom. This places the
  //   dept workspace directly below the core tools the staff member uses most.
  // ───────────────────────────────────────────────────────────────────────────
  const menuItems = React.useMemo(() => {
    const items = [...BASE_MENU_ITEMS];

    // Step 2 — dept workspace for staff only
    if (!isOwner && userDept && DEPT_CONFIG[userDept]) {
      const deptEntry = DEPT_CONFIG[userDept];
      items.push({
        id:    `dept-${userDept}`,
        label: deptEntry.label,
        icon:  deptEntry.icon,
        path:  deptEntry.path,
      });
    }

    // Step 3 — owner-only items
    if (isOwner) {
      items.push(...OWNER_MENU_ITEMS);
    }

    return items;
  }, [isOwner, userDept]);

  // ───────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ───────────────────────────────────────────────────────────────────────────

  const handleMenuClick = (item) => {
    setCurrentPage(item.id);
    navigate(item.path);
  };

  /**
   * handleLogout
   *
   * CHANGE FROM v1: userDept is now explicitly removed.
   *
   * All four session keys are cleared atomically before navigation.
   * Order does not matter — navigate() is only called after all removes.
   *
   * Keys cleared:
   *   isAuthenticated  — prevents DashboardLayout from thinking user is logged in
   *   userRole         — prevents ProtectedRoute from granting stale access
   *   userDept         — prevents next login from inheriting a stale dept value
   *   userEmail        — housekeeping, prevents PII from lingering in storage
   */
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userDept');       // ← was missing in v1
    localStorage.removeItem('userEmail');
    navigate('/gate', { replace: true });
  };

  /**
   * handleBranchToggle
   * Unchanged from v1. Delegates entirely to BusinessContext.toggleBranch().
   * The context's useEffect applies all DOM/CSS-variable changes in one place.
   */
  const handleBranchToggle = (newBranch) => {
    if (activeBranch !== newBranch) {
      toggleBranch(newBranch);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // RENDER
  // ───────────────────────────────────────────────────────────────────────────
  return (
    <aside className="sidebar">

      {/* ===== SIDEBAR HEADER ===== */}
      <div className="sidebar-header">
        <div className="sidebar-branding">
          <h3>PENUEL</h3>
          <p>Command Center</p>
        </div>
      </div>

      {/* ===== ROLE + DEPT BADGE =====
          v2: shows department below role for staff users.
          Owner sees only "OWNER" (their dept 'executive' adds no new info).
          Staff see both role and dept:
            STAFF
            Restaurant
      */}
      <div className="sidebar-role-badge">
        <span className="role-label">
          {(userRole || '').toUpperCase()}
        </span>
        {!isOwner && userDept && (
          <span className="dept-label">
            {toTitleCase(userDept)}
          </span>
        )}
      </div>

      {/* ===== MAIN MENU ===== */}
      <nav className="sidebar-menu" aria-label="Dashboard navigation">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              className={`sidebar-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => handleMenuClick(item)}
              title={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <IconComponent size={20} className="menu-icon" />
              <span className="menu-label">{item.label}</span>
              {isActive && <div className="menu-indicator" aria-hidden="true" />}
            </button>
          );
        })}
      </nav>

      {/* ===== BUSINESS CONTEXT DIVIDER ===== */}
      <div className="sidebar-divider" role="separator" />

      {/* ===== BUSINESS CONTEXT SWITCHER =====
          Unchanged from v1. Plaza/Stopover dropdown delegating to context.
      */}
      <div className="sidebar-business-switch">
        <div className="switch-label">Context</div>

        <div className="switch-dropdown">
          <button
            className="switch-toggle-btn"
            onClick={() => setToggleOpen(!toggleOpen)}
            title="Switch Business Context"
            aria-expanded={toggleOpen}
            aria-haspopup="listbox"
          >
            <span className="switch-current">
              {activeBranch === 'plaza' ? (
                <>
                  <Sun  size={16} aria-hidden="true" />
                  <span>Plaza</span>
                </>
              ) : (
                <>
                  <Moon size={16} aria-hidden="true" />
                  <span>Stopover</span>
                </>
              )}
            </span>
            <span className="switch-chevron" aria-hidden="true">
              {toggleOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </button>

          {toggleOpen && (
            <div className="switch-menu" role="listbox" aria-label="Select business context">

              <button
                role="option"
                aria-selected={activeBranch === 'plaza'}
                className={`switch-option ${activeBranch === 'plaza' ? 'active' : ''}`}
                onClick={() => handleBranchToggle('plaza')}
              >
                <Sun  size={16} aria-hidden="true" />
                <span>Plaza</span>
              </button>

              <button
                role="option"
                aria-selected={activeBranch === 'stopover'}
                className={`switch-option ${activeBranch === 'stopover' ? 'active' : ''}`}
                onClick={() => handleBranchToggle('stopover')}
              >
                <Moon size={16} aria-hidden="true" />
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
        aria-label="Log out and return to login page"
      >
        <LogOut size={18} aria-hidden="true" />
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
