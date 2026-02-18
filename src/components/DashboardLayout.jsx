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
  const { activeBranch } = useBusinessContext();

  // Check authentication on mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/gate');
    }
  }, [navigate]);

  /**
   * MASTER SYNC EFFECT - Watches activeBranch
   * 
   * When activeBranch changes, this effect:
   * 1. Updates DOM classes for CSS cascading
   * 2. Updates CSS variables for instant color changes
   * 3. Logs for debugging
   * 
   * This is the ONLY place where theme synchronization happens.
   * Both Sidebar and DashboardHeader toggle it, but THIS listens and updates.
   */
  useEffect(() => {
    if (activeBranch) {
      // Step 1: Update document.body.classList
      // This allows CSS rules like: body.theme-stopover .switcher-slider { ... }
      document.body.classList.remove('theme-plaza', 'theme-stopover');
      document.body.classList.add(`theme-${activeBranch}`);

      // Step 2: Update CSS variables on document.documentElement
      // This ensures colors change INSTANTLY without waiting for CSS cascade
      const root = document.documentElement;
      
      if (activeBranch === 'plaza') {
        // Plaza Theme: Gold
        root.style.setProperty('--secondary-color', '#d4af37');
      } else if (activeBranch === 'stopover') {
        // Stopover Theme: Blue
        root.style.setProperty('--secondary-color', '#0077b6');
      }

      // Step 3: Log for debugging
      console.log(`🎨 [DashboardLayout] MASTER SYNC: Theme set to ${activeBranch}`);
      console.log(`📍 [DashboardLayout] Body class: theme-${activeBranch}`);
      console.log(`🌈 [DashboardLayout] CSS variable: --secondary-color = ${activeBranch === 'plaza' ? '#d4af37' : '#0077b6'}`);
    }
  }, [activeBranch]);

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
