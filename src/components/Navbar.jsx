import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBusinessContext } from '../context/BusinessContext';
import { Menu, X } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeBranch } = useBusinessContext(); // We keep this for the underline color
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <button className="navbar-logo" onClick={() => navigate('/')}>
            <span className="logo-text">Penuel</span>
          </button>
        </div>

        {/* CLEAN DESKTOP NAV - NO ICONS */}
        <div className="navbar-menu">
          <button className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => navigate('/')}>Home</button>
          <button className={`nav-link ${isActive('/about') ? 'active' : ''}`} onClick={() => navigate('/about')}>About</button>
          <button className={`nav-link ${isActive('/catalogue') ? 'active' : ''}`} onClick={() => navigate('/catalogue')}>Services</button>
        </div>

        <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE NAV - CLEAN */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <button className="mobile-nav-link" onClick={() => { navigate('/'); setMobileMenuOpen(false); }}>Home</button>
          <button className="mobile-nav-link" onClick={() => { navigate('/about'); setMobileMenuOpen(false); }}>About</button>
          <button className="mobile-nav-link" onClick={() => { navigate('/catalogue'); setMobileMenuOpen(false); }}>Services</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;