import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Building2, Fuel } from 'lucide-react';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Est. 2024 • Kenya's Premier Holdings</span>
          </div>

          <h1 className="hero-title">
            Welcome to the Penuel Empire
          </h1>

          <p className="hero-subtitle">
            Experience unparalleled luxury hospitality and premium services across East Africa
          </p>

          <button
            className="hero-cta"
            onClick={() => navigate('/catalogue')}
          >
            Explore Our Services
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Hero Background Effect */}
        <div className="hero-gradient"></div>
      </section>

      {/* Legacy Section */}
      <section className="legacy-section">
        <div className="legacy-container">
          <h2>Our Legacy</h2>
          <p className="legacy-text">
            Penuel Empire represents a commitment to excellence, blending timeless heritage 
            with contemporary sophistication. We offer two distinct experiences tailored to 
            your unique lifestyle—whether you seek ultimate luxury or convenient excellence.
          </p>
        </div>
      </section>

      {/* Twin Properties CTA Section */}
      <section className="properties-section">
        <div className="properties-container">
          <h2 className="properties-title">Discover Our Properties</h2>

          <div className="properties-grid">
            {/* Penuel Plaza Card */}
            <div
              className="property-card plaza-card"
              onClick={() => navigate('/catalogue')}
            >
              <div className="card-icon">
                <Building2 size={48} />
              </div>
              <h3>Penuel Plaza</h3>
              <p>Experience luxury redefined. Five-star hospitality in Amboseli's heart.</p>
              <div className="card-features">
                <span>Premium Rooms</span>
                <span>Fine Dining</span>
                <span>Spa & Wellness</span>
              </div>
              <button className="card-cta">
                Explore Plaza
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Penuel Stopover Card */}
            <div
              className="property-card stopover-card"
              onClick={() => navigate('/catalogue')}
            >
              <div className="card-icon">
                <Fuel size={48} />
              </div>
              <h3>Penuel Stopover</h3>
              <p>Convenient excellence. Premium retail, dining, and services on the move.</p>
              <div className="card-features">
                <span>Express Retail</span>
                <span>Quick Dining</span>
                <span>Auto Services</span>
              </div>
              <button className="card-cta">
                Explore Stopover
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="footer-cta">
        <h2>Ready to Experience Excellence?</h2>
        <p>Join thousands who have chosen Penuel for unmatched service and luxury</p>
        <button
          className="footer-cta-btn"
          onClick={() => navigate('/catalogue')}
        >
          Browse Services Now
        </button>
      </section>
    </div>
  );
};

export default Home;
