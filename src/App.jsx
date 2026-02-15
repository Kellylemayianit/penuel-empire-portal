import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useBusinessContext } from './context/BusinessContext';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Catalogue from './pages/Catalogue';

// Styles
import './styles/App.css';

/**
 * Penuel Empire Portal - Elite Unified Theme Engine
 *
 * Philosophy: "One Empire, Multiple Personalities"
 * 
 * Architecture:
 * - Base Palette: Deep Charcoal (#0a0a0a), Refined White (#fcfaf2), Muted Grey
 * - Accent Variable: Flips between Gold (#d4af37) and Blue (#0077b6)
 * - Navbar: Identical across all pages (only accent color changes)
 * - Home Page: Dark entrance, all base colors match sub-pages
 * - Sub-pages: Airy elegance with minimal color accents
 * - All transitions: Smooth 0.5s
 * 
 * Result: Cohesive brand identity that adapts to business context
 */

// ============================================================================
// ELITE THREE-TIER COLOR STRATEGY (Unified Base + Dynamic Accent)
// ============================================================================

const THEMES = {
  // TIER 1: HOME INDEX (Professional Dark Entry)
  // Same base palette as all pages, only accent changes
  homeIndex: {
    name: 'Home Index',
    vibe: 'Empire Gateway',
    colors: {
      // BASE PALETTE (Consistent across all pages)
      'primary-color': '#0a0a0a',         // Deep Black
      'secondary-color': '#d4af37',       // Gold (flips to blue)
      'text-color': '#f8f9fa',            // Clean off-white
      'text-muted': '#a0a0a0',            // Muted grey
      
      // ACCENT UTILITIES
      'accent-color': '#111111',
      'accent-light': '#e8d9a7',
      'border-accent': '#d4af37',
      'card-shadow': 'rgba(0, 0, 0, 0.3)',
    },
  },

  // TIER 2: PENUEL PLAZA (Airy Elegance)
  // Light background, gold accents only
  plaza: {
    name: 'Penuel Plaza',
    vibe: 'Elegant Luxury',
    colors: {
      // BASE PALETTE (Consistent across all pages)
      'primary-color': '#fcfaf2',         // Refined white
      'secondary-color': '#d4af37',       // Gold accent
      'text-color': '#2a2a2a',            // Deep charcoal
      'text-muted': '#7a7a7a',            // Muted grey
      
      // ACCENT UTILITIES
      'accent-color': '#f5f1e8',
      'accent-light': '#e5d4b3',
      'border-accent': '#d4af37',
      'card-shadow': 'rgba(0, 0, 0, 0.05)',
    },
  },

  // TIER 3: PENUEL STOPOVER (Clean Professional)
  // Light background, blue accents only
  stopover: {
    name: 'Penuel Stopover',
    vibe: 'Professional Fresh',
    colors: {
      // BASE PALETTE (Consistent across all pages)
      'primary-color': '#fafbfc',         // Clean white
      'secondary-color': '#0077b6',       // Blue accent (replaces gold)
      'text-color': '#1a2a3a',            // Navy charcoal
      'text-muted': '#6b7a8a',            // Muted grey-navy
      
      // ACCENT UTILITIES
      'accent-color': '#e8f0f7',
      'accent-light': '#4a9fd8',
      'border-accent': '#0077b6',
      'card-shadow': 'rgba(0, 0, 0, 0.05)',
    },
  },
};

// ============================================================================
// THEME SELECTOR HELPER
// ============================================================================

const getThemeForPath = (pathname, activeBranch) => {
  if (pathname === '/') {
    return THEMES.homeIndex;
  }

  if (pathname === '/catalogue' || pathname === '/about') {
    return activeBranch === 'plaza' ? THEMES.plaza : THEMES.stopover;
  }

  return null;
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

function App() {
  const location = useLocation();
  const { activeBranch } = useBusinessContext();

  /**
   * Elite Dynamic Theme Injection
   * 
   * Injects unified base colors + dynamic accent only
   * Creates seamless transitions across all pages
   * Navbar stays consistent (only accent color changes)
   */
  useEffect(() => {
    const themeToApply = getThemeForPath(location.pathname, activeBranch);

    if (themeToApply) {
      const root = document.documentElement;

      console.log(
        `✨ Elite Theme Applied: ${themeToApply.name} (${themeToApply.vibe})`
      );

      // Inject CSS variables
      Object.entries(themeToApply.colors).forEach(([varName, hexValue]) => {
        root.style.setProperty(`--${varName}`, hexValue);
      });

      // Update body class
      document.body.classList.remove(
        'theme-home-index',
        'theme-plaza',
        'theme-stopover'
      );
      document.body.classList.add(
        `theme-${themeToApply.name.toLowerCase().replace(/\s+/g, '-')}`
      );
    }
  }, [location.pathname, activeBranch]);

  return (
    <>
      {/* Unified Navbar - Identical on all pages */}
      <Navbar />

      {/* Content Routes with Dynamic Theming */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/catalogue" element={<Catalogue />} />
      </Routes>
    </>
  );
}

export default App;
