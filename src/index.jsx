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
