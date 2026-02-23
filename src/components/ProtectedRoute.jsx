/**
 * ProtectedRoute.jsx — Tiered Access Guard (v2)
 *
 * UPGRADE FROM v1:
 * ─────────────────────────────────────────────────────────────────────────────
 * v1 checked only whether userRole === requiredRole (exact match).
 * That design broke as soon as the owner needed access to staff-only routes,
 * because the owner's role is 'owner', not 'staff'.
 *
 * v2 implements a two-tier "master key" model:
 *
 *   TIER 1 — Master Access
 *     If userRole === 'owner', access is ALWAYS granted, regardless of
 *     requiredRole or requiredDept. The owner is above the role hierarchy.
 *
 *   TIER 2 — Role + (optional) Dept Match
 *     For non-owners, BOTH conditions must pass:
 *       a. userRole === requiredRole   (e.g. 'staff' === 'staff')
 *       b. If requiredDept is supplied:
 *            userDept === requiredDept (e.g. 'carwash' === 'carwash')
 *          If requiredDept is omitted:
 *            dept check is skipped — any dept with the correct role passes.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PROP REFERENCE:
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   requiredRole  {string}           — Role that must match (e.g. 'owner', 'staff').
 *                                      Required. Owner always bypasses this.
 *
 *   requiredDept  {string|undefined} — Optional department scope.
 *                                      When supplied, the user's dept must
 *                                      also match for access to be granted.
 *                                      Ignored entirely if the user is an owner.
 *
 *   redirectTo    {string}           — Fallback path on denial.
 *                                      Defaults to '/dashboard'.
 *                                      Staff who hit an owner-only route are
 *                                      redirected to '/dashboard/operations'
 *                                      (set this at the call-site in App.jsx).
 *
 *   children      {ReactNode}        — Content to render if access is granted.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * USAGE EXAMPLES (App.jsx):
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   // Owner-only route (staff of any dept are redirected)
 *   <ProtectedRoute requiredRole="owner" redirectTo="/dashboard/operations">
 *     <DashboardLayout>...</DashboardLayout>
 *   </ProtectedRoute>
 *
 *   // Any authenticated staff member (no dept restriction)
 *   <ProtectedRoute requiredRole="staff">
 *     <DashboardLayout>...</DashboardLayout>
 *   </ProtectedRoute>
 *
 *   // Dept-scoped route (only carwash staff + owner can enter)
 *   <ProtectedRoute requiredRole="staff" requiredDept="carwash">
 *     <DashboardLayout>...</DashboardLayout>
 *   </ProtectedRoute>
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SECURITY NOTE:
 * ─────────────────────────────────────────────────────────────────────────────
 * This is a UI-layer guard only. localStorage is readable and writable by
 * any script on the page. A determined user can bypass this via DevTools.
 * Production requires server-side JWT validation on every API endpoint
 * (Milestone 2) — this component only prevents accidental or casual access.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({
  requiredRole,
  requiredDept,
  redirectTo = '/dashboard',
  children,
}) => {
  // Read and normalise all three session values in one pass.
  const userRole = (localStorage.getItem('userRole') || '').toLowerCase();
  const userDept = (localStorage.getItem('userDept') || '').toLowerCase();

  // ─────────────────────────────────────────────────────────────────────────
  // TIER 1 — Master key: owner bypasses every role and dept check.
  // ─────────────────────────────────────────────────────────────────────────
  const isOwner = userRole === 'owner';
  if (isOwner) return children;

  // ─────────────────────────────────────────────────────────────────────────
  // TIER 2a — Role match.
  // ─────────────────────────────────────────────────────────────────────────
  const roleMatches = userRole === requiredRole.toLowerCase();
  if (!roleMatches) {
    return <Navigate to={redirectTo} replace />;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // TIER 2b — Optional dept match.
  // Only evaluated when requiredDept is explicitly provided.
  // ─────────────────────────────────────────────────────────────────────────
  if (requiredDept) {
    const deptMatches = userDept === requiredDept.toLowerCase();
    if (!deptMatches) {
      return <Navigate to={redirectTo} replace />;
    }
  }

  // All checks passed — render the protected content.
  return children;
};

export default ProtectedRoute;
