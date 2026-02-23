import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusinessContext } from '../context/BusinessContext';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar';
import '../styles/Dashboard.css';

/**
 * DashboardLayout.jsx - MASTER SYNC VERSION
 * 
 * Philosophy: "The Master Synchronizer"
 * 
 * This component is the SINGLE SOURCE OF TRUTH for theme synchronization.
 * It watches activeBranch from BusinessContext and:
 * 1. Updates document.body.classList (for CSS cascading)
 * 2. Updates CSS variables on document.documentElement (for instant color updates)
 * 3. Triggers re-renders of all child components via context
 * 
 * CRITICAL: This useEffect ensures ALL theme changes propagate immediately
 * across the entire dashboard, regardless of React batching or state delays.
 */

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  // Check authentication on mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/gate');
    }
  }, [navigate]);

 

  const userRole = localStorage.getItem('userRole') || 'secretary';

  return (
    <div className="dashboard-container">
      {/* ===== STICKY HEADER ===== */}
      <DashboardHeader />

      {/* ===== GRID LAYOUT: SIDEBAR + MAIN CONTENT ===== */}
      <div className="dashboard-layout">
        {/* ===== SIDEBAR ===== */}
        <Sidebar userRole={userRole} />

        {/* ===== MAIN CONTENT AREA ===== */}
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
