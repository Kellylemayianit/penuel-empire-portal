import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusinessContext } from '../context/BusinessContext';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar';
import '../styles/Dashboard.css';

/**
 * DashboardLayout.jsx — Prop-Driven Session Architecture (v2)
 *
 * CHANGES FROM v1:
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. PROPS ACCEPTED: { children, userRole, userDept }
 *      Previously only { children } was destructured and userRole was read
 *      directly from localStorage inside this component with a 'secretary'
 *      fallback. That pattern:
 *        a) Ignored the values App.jsx was already threading down as props.
 *        b) Never forwarded userDept anywhere, making dept-scoped UI impossible.
 *        c) Silently masked unauthenticated users as secretaries instead of
 *           redirecting them.
 *
 * 2. SESSION GUARD UPGRADED:
 *      v1:  checked only `isAuthenticated` — a missing userRole silently
 *           defaulted to 'secretary' (the old fallback).
 *      v2:  checks both `isAuthenticated` AND that userRole is a non-empty
 *           string. If either is absent the user is redirected to /gate
 *           immediately. No silent promotion, no ghost sessions.
 *
 *      Why check the prop instead of localStorage again?
 *      App.jsx's Layout factory reads localStorage ONCE, normalises the value,
 *      and passes it down. Reading localStorage a second time here would create
 *      two reads that could theoretically differ (e.g. if another tab clears
 *      the key between renders). Trusting the prop from App.jsx is the single-
 *      source-of-truth approach.
 *
 * 3. SIDEBAR RECEIVES BOTH PROPS:
 *      <Sidebar userRole={userRole} userDept={userDept} />
 *      Sidebar now has everything it needs to:
 *        • Filter menu items by role (owner vs staff)
 *        • Display the dept badge correctly
 *        • Build dept-specific nav links (e.g. /dashboard/dept/carwash)
 *
 * 4. DEPT CSS CLASS ON <main>:
 *      className={`dashboard-main ${userDept}`}
 *      Produces classes like:
 *        .dashboard-main.carwash     → steel-blue accent overrides
 *        .dashboard-main.restaurant  → green accent overrides
 *        .dashboard-main.service     → amber accent overrides
 *        .dashboard-main.supermarket → teal accent overrides
 *        .dashboard-main.executive   → default gold (owner, no override needed)
 *      These CSS hooks are ready to use — no additional JS required.
 *      The department-specific overrides live in Dashboard.css.
 *
 * SESSION GUARD FLOW:
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   App.jsx Layout factory reads localStorage
 *         │
 *         ▼
 *   ProtectedRoute checks role / dept against route requirements
 *         │  (redirects to /gate or /dashboard/operations if not authorised)
 *         ▼
 *   DashboardLayout receives confirmed-valid userRole + userDept as props
 *         │
 *         ▼
 *   useEffect safety net: if isAuthenticated or userRole is missing → /gate
 *         │  (belt-and-suspenders: catches direct navigation, stale props,
 *         │   or localStorage being cleared by another tab)
 *         ▼
 *   Render: Sidebar + <main className={`dashboard-main ${userDept}`}>
 */

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const DashboardLayout = ({ children, userRole, userDept }) => {
  const navigate = useNavigate();

  // ───────────────────────────────────────────────────────────────────────────
  // SESSION GUARD
  //
  // Fires on mount and whenever userRole changes (e.g. another tab logs out).
  //
  // Two conditions redirect to /gate:
  //   1. isAuthenticated is absent/falsy in localStorage — covers the case
  //      where localStorage was cleared externally after the component mounted.
  //   2. userRole prop is falsy — covers the case where App.jsx received an
  //      empty string from localStorage (e.g. a race condition on first render
  //      before login writes the value).
  //
  // We do NOT check userDept here because the executive/owner role has dept
  // 'executive' which is a valid non-empty value, but if for any reason dept
  // is missing we want the rest of the UI to degrade gracefully rather than
  // hard-redirect. The ProtectedRoute already validated dept before we got here.
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (!isAuthenticated || !userRole) {
      // Clear any partial session data before redirecting — prevents ghost
      // sessions where one key is present but others are missing.
      if (!isAuthenticated) {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userDept');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('isAuthenticated');
      }
      navigate('/gate', { replace: true });
    }
  }, [navigate, userRole]);

  // ───────────────────────────────────────────────────────────────────────────
  // RENDER GUARD
  //
  // While the useEffect redirect is in-flight React will still attempt to
  // render. Returning null prevents any dashboard chrome from flashing for
  // an unauthenticated user before the navigation completes.
  // ───────────────────────────────────────────────────────────────────────────
  if (!userRole) return null;

  return (
    <div className="dashboard-container">

      {/* ===== STICKY HEADER ===== */}
      {/*
        DashboardHeader reads activeBranch from BusinessContext and owns the
        branch switcher UI. It does not need userRole or userDept — the header
        UI is identical for all roles.
      */}
      <DashboardHeader />

      {/* ===== GRID LAYOUT: SIDEBAR + MAIN CONTENT ===== */}
      <div className="dashboard-layout">

        {/* ===== SIDEBAR ===== */}
        {/*
          Receives both userRole and userDept so it can:
            • Show/hide owner-only nav items based on role
            • Display the department badge
            • Render dept-specific workspace links (Tier 3 routes)
        */}
        <Sidebar userRole={userRole} userDept={userDept} />

        {/* ===== MAIN CONTENT AREA ===== */}
        {/*
          The dept CSS class provides a scoped styling hook for every
          department. Example overrides in Dashboard.css:

            .dashboard-main.carwash     { --dept-accent: #4a9eca; }
            .dashboard-main.restaurant  { --dept-accent: #4caf50; }
            .dashboard-main.service     { --dept-accent: #ff9800; }
            .dashboard-main.supermarket { --dept-accent: #00bcd4; }
            .dashboard-main.executive   { --dept-accent: var(--secondary-color); }

          Any component that needs its dept colour just uses var(--dept-accent).
          No prop-drilling required beyond this point.

          `userDept` will be an empty string if somehow missing (getSession()
          in App.jsx defaults to ''). The resulting class 'dashboard-main '
          is harmless — it just won't match any dept-specific CSS rule.
        */}
        <main className={`dashboard-main ${userDept || ''}`}>
          {children}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
