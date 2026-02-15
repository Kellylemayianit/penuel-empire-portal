import React from 'react';
import { Award, Shield, Zap, Users, TrendingUp, Lock, Sun, Moon } from 'lucide-react';
import { useBusinessContext } from '../context/BusinessContext';
import '../styles/About.css';

/**
 * About.jsx - Elite In-Page Business Switcher
 * 
 * Features:
 * - In-page switcher (Sun/Moon) below hero section
 * - Content adapts in real-time to activeBranch
 * - Sleek, non-clunky design
 * - All elements use unified base palette
 * - Dynamic accent colors only
 */

const About = () => {
  const { activeBranch, toggleBranch } = useBusinessContext();

  // Branch-specific trust stats
  const trustStatsData = {
    plaza: [
      { icon: TrendingUp, number: '25+', label: 'Years Legacy', description: 'Heritage of Excellence' },
      { icon: Award, number: '500+', label: 'Happy Guests', description: 'Luxury Experiences' },
      { icon: Lock, number: '100%', label: 'Satisfaction', description: '5-Star Service' },
    ],
    stopover: [
      { icon: TrendingUp, number: '24/7', label: 'Operations', description: 'Always Available' },
      { icon: Award, number: '50K+', label: 'Travelers Served', description: 'Trusted Service' },
      { icon: Lock, number: '100%', label: 'Quality', description: 'Premium Standards' },
    ],
  };

  // Branch-specific story content
  const storyContent = {
    plaza: {
      title: 'Penuel Plaza: Where Heritage Meets Luxury',
      paragraphs: [
        'Penuel Plaza represents the pinnacle of African luxury hospitality. Nestled in the heart of Amboseli, our five-star property combines timeless elegance with modern sophistication.',
        'Every detail—from premium linens to curated dining experiences—reflects our commitment to unparalleled service. We craft unforgettable moments.',
        'Our heritage spans decades of hospitality excellence, built on principles of warmth, authenticity, and respect for our guests and communities.',
      ],
      highlights: ['Premium Rooms', 'Fine Dining', 'Spa & Wellness', 'Concierge Services'],
      recognition: 'Industry Recognition: Best Luxury Hotel in East Africa',
    },
    stopover: {
      title: 'Penuel Stopover: Engineering Traveler Excellence',
      paragraphs: [
        'Penuel Stopover is a masterpiece of logistics and innovation. Designed for the modern traveling professional, we combine high-speed service with premium quality.',
        'Our model is engineered for efficiency—express check-in, rapid services, and curated retail—all optimized for travelers who value their time.',
        'From solar-powered operations to advanced automation, we\'re building the future of convenient premium service across East Africa.',
      ],
      highlights: ['Express Services', 'Solar Powered', 'Smart Retail', 'Logistics Hub'],
      recognition: 'Industry Recognition: Most Innovative Service Hub 2024',
    },
  };

  const storyData = storyContent[activeBranch];
  const trustStats = trustStatsData[activeBranch];

  const professionalStandards = [
    {
      icon: Shield,
      title: activeBranch === 'plaza' ? 'Heritage Excellence' : 'Engineering Excellence',
      description: activeBranch === 'plaza' 
        ? 'Decades of proven expertise in luxury hospitality. Trusted by thousands of discerning travelers.'
        : 'Cutting-edge technology and logistics. Trusted by professionals worldwide.',
      keywords: activeBranch === 'plaza' 
        ? 'Luxury Hotel | Heritage Brand | Premium Service'
        : 'Tech-Enabled | Innovation Hub | Smart Service',
    },
    {
      icon: Lock,
      title: 'Transparent Pricing',
      description: 'No hidden fees. What you see is what you pay. Premium value guaranteed.',
      keywords: 'No Hidden Costs | Full Transparency | Value Pricing',
    },
    {
      icon: Zap,
      title: activeBranch === 'plaza' ? 'Expert Concierge' : 'Expert Support',
      description: activeBranch === 'plaza'
        ? 'Free personalized consultations. Our concierge anticipates your every need.'
        : 'Free expert support. Rapid response 24/7.',
      keywords: 'Expert Team | Personal Service | 24/7 Support',
    },
    {
      icon: TrendingUp,
      title: 'Innovative Solutions',
      description: activeBranch === 'plaza'
        ? 'Combining timeless luxury with modern technology.'
        : 'Solar power, smart systems, and sustainable operations.',
      keywords: activeBranch === 'plaza' ? 'Luxury Tech | Modern Heritage' : 'Solar | Smart | Sustainable',
    },
  ];

  const portfolioItems = activeBranch === 'plaza' 
    ? [
        { id: 1, title: 'Luxury Suite Opening', category: 'Accommodation', image: '🏰' },
        { id: 2, title: 'Fine Dining Experience', category: 'Culinary', image: '🍽️' },
        { id: 3, title: 'Wellness Retreat', category: 'Spa & Wellness', image: '🧖' },
        { id: 4, title: 'Heritage Event', category: 'Hospitality', image: '🎭' },
      ]
    : [
        { id: 1, title: 'Stopover Grand Opening', category: 'Service Hub', image: '⚡' },
        { id: 2, title: 'Solar Panel Installation', category: 'Sustainability', image: '☀️' },
        { id: 3, title: 'Express Retail Launch', category: 'Retail', image: '🛍️' },
        { id: 4, title: 'Logistics Hub', category: 'Innovation', image: '🚀' },
      ];

  return (
    <div className="about">
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>Our Story</h1>
          <p>{activeBranch === 'plaza' ? 'Luxury Heritage Across East Africa' : 'Engineered Excellence for Modern Travelers'}</p>
        </div>
      </section>

      {/* IN-PAGE BUSINESS SWITCHER - Sleek Design */}
      <section className="about-switcher-section">
        <div className="container">
          <div className="about-switcher">
            <span className="switcher-label">Explore Our Brand</span>
            <div className="switcher-buttons">
              <button
                className={`switcher-btn ${activeBranch === 'plaza' ? 'active' : ''}`}
                onClick={() => toggleBranch('plaza')}
                aria-label="Switch to Plaza"
                title="Penuel Plaza"
              >
                <Sun size={18} />
                <span>Plaza</span>
              </button>
              <button
                className={`switcher-btn ${activeBranch === 'stopover' ? 'active' : ''}`}
                onClick={() => toggleBranch('stopover')}
                aria-label="Switch to Stopover"
                title="Penuel Stopover"
              >
                <Moon size={18} />
                <span>Stopover</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-bar">
        <div className="container">
          <div className="trust-stats-grid">
            {trustStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="trust-stat">
                  <div className="stat-icon"><IconComponent size={40} /></div>
                  <div className="stat-content">
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-description">{stat.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="brand-story">
        <div className="container">
          <div className="story-grid">
            <div className="story-text">
              <h2>{storyData.title}</h2>
              {storyData.paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
              <div className="story-highlights">
                {storyData.highlights.map((highlight, idx) => (
                  <span key={idx} className="highlight-badge">{highlight}</span>
                ))}
              </div>
              <div className="story-highlight">
                <Award size={20} />
                <span>{storyData.recognition}</span>
              </div>
            </div>
            <div className="video-placeholder">
              <div className="video-frame">
                <span style={{ fontSize: '64px' }}>🎬</span>
                <p>Penuel {activeBranch === 'plaza' ? 'Plaza' : 'Stopover'}: The Journey</p>
                <span>Video Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="professional-standards">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Penuel {activeBranch === 'plaza' ? 'Plaza' : 'Stopover'}</h2>
            <p>What Sets Us Apart in the Industry</p>
          </div>
          <div className="standards-grid">
            {professionalStandards.map((standard, index) => {
              const IconComponent = standard.icon;
              return (
                <div key={index} className="standard-card">
                  <div className="standard-icon"><IconComponent size={48} /></div>
                  <h3>{standard.title}</h3>
                  <p className="standard-description">{standard.description}</p>
                  <div className="standard-keywords"><small>{standard.keywords}</small></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="portfolio-section">
        <div className="container">
          <div className="section-header">
            <h2>Our {activeBranch === 'plaza' ? 'Luxury' : 'Innovation'} Portfolio</h2>
            <p>Showcase of Excellence Across Our Properties</p>
          </div>
          <div className="portfolio-grid">
            {portfolioItems.map((item) => (
              <div key={item.id} className="portfolio-item">
                <div className="portfolio-image">
                  <span className="portfolio-emoji">{item.image}</span>
                </div>
                <div className="portfolio-content">
                  <span className="portfolio-category">{item.category}</span>
                  <h3>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Values</h2>
            <p>The Principles That Guide Every Decision</p>
          </div>
          <div className="values-grid">
            {[
              { icon: Award, title: 'Excellence', description: 'Highest standards in every interaction.' },
              { icon: Users, title: 'Community', description: 'Investing in our people and the communities we serve.' },
              { icon: Zap, title: 'Innovation', description: 'Forward-thinking solutions for modern travelers.' },
              { icon: Shield, title: 'Integrity', description: 'Built on honesty, transparency, and ethics.' },
            ].map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="value-card">
                  <div className="value-icon"><IconComponent size={40} /></div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="heritage-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Heritage</h2>
            <p>Milestones That Define Our Journey</p>
          </div>
          <div className="timeline">
            {[
              { year: '2024', title: 'Twin Vision Realized', description: 'Penuel Plaza & Stopover launch with commitment to excellence.' },
              { year: '2024', title: 'Dual Excellence', description: 'Two distinct properties, one unified brand philosophy.' },
              { year: '2025', title: 'Regional Expansion', description: 'Expansion across East Africa with innovation.' },
              { year: 'Future', title: 'Continental Legacy', description: 'Building Africa\'s premier hospitality and service network.' },
            ].map((milestone, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-dot"></div>
                  <div className="marker-line"></div>
                </div>
                <div className="timeline-content">
                  <div className="timeline-year">{milestone.year}</div>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="cta-content">
          <h2>Ready to Experience Excellence?</h2>
          <p>Join thousands who have chosen Penuel for unmatched service and reliability</p>
          <button className="cta-button">Explore Our Services Today</button>
        </div>
      </section>
    </div>
  );
};

export default About;
