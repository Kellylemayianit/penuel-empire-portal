import React from 'react';
import { Award, Shield, Zap, Users, TrendingUp, Lock, Flame, Building2, Fuel } from 'lucide-react';
import { useBusinessContext } from '../context/BusinessContext';
import '../styles/About.css';

/**
 * About.jsx — Triple-Aura Architecture
 *
 * Three states: 'empire' | 'plaza' | 'stopover'
 *
 * WHAT CHANGED FROM v2 (2-state):
 * ─────────────────────────────────────────────────────────────────────────
 *  • Switcher expanded from Sun/Moon (2-button) to 3-button Aura strip
 *    (🔥 Empire | ✦ Plaza | ⚡ Stopover) — no icon import clutter
 *  • All data objects (trustStats, storyContent, professionalStandards,
 *    portfolioItems) gain an 'empire' key so the page never renders blank
 *    on the new default state
 *  • hero subtitle, section headings, switcher label, CTA copy all
 *    branch-aware — no hardcoded Plaza/Stopover strings visible in Empire state
 *  • Timeline gains an Empire milestone for the parent company founding
 *  • Values section is brand-agnostic — shared across all three states
 * ─────────────────────────────────────────────────────────────────────────
 */

// ─────────────────────────────────────────────────────────────────────────────
// TRUST STATS — three sets
// ─────────────────────────────────────────────────────────────────────────────
const TRUST_STATS = {
  empire: [
    { icon: TrendingUp, number: '2',    label: 'Flagship Properties', description: 'One Vision'          },
    { icon: Award,      number: '50K+', label: 'Guests Served',        description: 'Across Both Brands'  },
    { icon: Lock,       number: '100%', label: 'Commitment',           description: 'To Excellence'       },
  ],
  plaza: [
    { icon: TrendingUp, number: '25+',  label: 'Years Legacy',    description: 'Heritage of Excellence' },
    { icon: Award,      number: '500+', label: 'Happy Guests',    description: 'Luxury Experiences'     },
    { icon: Lock,       number: '100%', label: 'Satisfaction',    description: '5-Star Service'         },
  ],
  stopover: [
    { icon: TrendingUp, number: '24/7', label: 'Operations',      description: 'Always Available'       },
    { icon: Award,      number: '50K+', label: 'Travelers Served',description: 'Trusted Service'        },
    { icon: Lock,       number: '100%', label: 'Quality',         description: 'Premium Standards'      },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// STORY CONTENT — three sets
// ─────────────────────────────────────────────────────────────────────────────
const STORY_CONTENT = {
  empire: {
    title: 'The Penuel Empire: One Vision, Two Worlds',
    paragraphs: [
      'The Penuel Empire was forged from a singular conviction — that excellence is not accidental. It is engineered through meticulous design, relentless service, and an uncompromising commitment to the people we serve.',
      'Two distinct brands. One holding philosophy. Whether you step into the quiet grandeur of Penuel Plaza at the foot of Kilimanjaro, or pull off the A109 into the high-efficiency world of Penuel Stopover, you are experiencing one unified standard of care.',
      'We are building East Africa\'s most trusted hospitality and service network — one interaction at a time.',
    ],
    highlights: ['Penuel Plaza', 'Penuel Stopover', 'East Africa', 'Est. 2024'],
    recognition: 'Vision: Kenya\'s Premier Multi-Brand Hospitality Holdings',
  },
  plaza: {
    title: 'Penuel Plaza: Where Heritage Meets Luxury',
    paragraphs: [
      'Penuel Plaza represents the pinnacle of African luxury hospitality. Nestled in the heart of Amboseli, our five-star property combines timeless elegance with modern sophistication.',
      'Every detail — from premium linens to curated dining experiences — reflects our commitment to unparalleled service. We craft unforgettable moments.',
      'Our heritage spans decades of hospitality excellence, built on principles of warmth, authenticity, and respect for our guests and communities.',
    ],
    highlights: ['Premium Rooms', 'Fine Dining', 'Spa & Wellness', 'Concierge Services'],
    recognition: 'Industry Recognition: Best Luxury Hotel in East Africa',
  },
  stopover: {
    title: 'Penuel Stopover: Engineering Traveler Excellence',
    paragraphs: [
      'Penuel Stopover is a masterpiece of logistics and innovation. Designed for the modern traveling professional, we combine high-speed service with premium quality.',
      'Our model is engineered for efficiency — express check-in, rapid services, and curated retail — all optimized for travelers who value their time.',
      'From solar-powered operations to advanced automation, we\'re building the future of convenient premium service across East Africa.',
    ],
    highlights: ['Express Services', 'Solar Powered', 'Smart Retail', 'Logistics Hub'],
    recognition: 'Industry Recognition: Most Innovative Service Hub 2024',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PROFESSIONAL STANDARDS — helper returns correct set per branch
// ─────────────────────────────────────────────────────────────────────────────
const getProfessionalStandards = (branch) => [
  {
    icon: Shield,
    title: branch === 'empire'
      ? 'Holding Company Excellence'
      : branch === 'plaza'
        ? 'Heritage Excellence'
        : 'Engineering Excellence',
    description: branch === 'empire'
      ? 'Two proven brands under one strategic roof. The Empire sets the standard for every property in the group.'
      : branch === 'plaza'
        ? 'Decades of proven expertise in luxury hospitality. Trusted by thousands of discerning travelers.'
        : 'Cutting-edge technology and logistics. Trusted by professionals worldwide.',
    keywords: branch === 'empire'
      ? 'Holdings | Group Strategy | Brand Excellence'
      : branch === 'plaza'
        ? 'Luxury Hotel | Heritage Brand | Premium Service'
        : 'Tech-Enabled | Innovation Hub | Smart Service',
  },
  {
    icon: Lock,
    title: 'Transparent Pricing',
    description: 'No hidden fees. What you see is what you pay. Premium value guaranteed across every property.',
    keywords: 'No Hidden Costs | Full Transparency | Value Pricing',
  },
  {
    icon: Zap,
    title: branch === 'stopover' ? 'Expert Support' : 'Expert Concierge',
    description: branch === 'stopover'
      ? 'Free expert support. Rapid response 24/7.'
      : 'Free personalized consultations. Our teams anticipate your every need.',
    keywords: 'Expert Team | Personal Service | 24/7 Support',
  },
  {
    icon: TrendingUp,
    title: 'Innovative Solutions',
    description: branch === 'stopover'
      ? 'Solar power, smart systems, and sustainable operations.'
      : 'Combining timeless luxury with modern technology across all properties.',
    keywords: branch === 'stopover' ? 'Solar | Smart | Sustainable' : 'Luxury Tech | Modern Heritage',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PORTFOLIO ITEMS — three sets
// ─────────────────────────────────────────────────────────────────────────────
const PORTFOLIO_ITEMS = {
  empire: [
    { id: 1, title: 'Empire Launch',         category: 'Holdings',      image: '🔥' },
    { id: 2, title: 'Dual Brand Strategy',   category: 'Vision',        image: '✦'  },
    { id: 3, title: 'East Africa Expansion', category: 'Growth',        image: '🌍' },
    { id: 4, title: 'Team of 100+',          category: 'People',        image: '👥' },
  ],
  plaza: [
    { id: 1, title: 'Luxury Suite Opening',  category: 'Accommodation', image: '🏰' },
    { id: 2, title: 'Fine Dining Experience',category: 'Culinary',      image: '🍽️' },
    { id: 3, title: 'Wellness Retreat',      category: 'Spa & Wellness',image: '🧖' },
    { id: 4, title: 'Heritage Event',        category: 'Hospitality',   image: '🎭' },
  ],
  stopover: [
    { id: 1, title: 'Stopover Grand Opening',category: 'Service Hub',   image: '⚡' },
    { id: 2, title: 'Solar Installation',    category: 'Sustainability', image: '☀️' },
    { id: 3, title: 'Express Retail Launch', category: 'Retail',        image: '🛍️' },
    { id: 4, title: 'Logistics Hub',         category: 'Innovation',    image: '🚀' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TIMELINE — brand-aware milestones
// ─────────────────────────────────────────────────────────────────────────────
const TIMELINE = [
  {
    year:        '2024',
    title:       'The Empire Ignites',
    description: 'Penuel Empire Holdings incorporated. The parent vision for East Africa\'s premier multi-brand hospitality group takes form.',
  },
  {
    year:        '2024',
    title:       'Twin Vision Realized',
    description: 'Penuel Plaza & Penuel Stopover launch simultaneously — two distinct brands, one unified standard of excellence.',
  },
  {
    year:        '2025',
    title:       'Regional Expansion',
    description: 'Both properties scale operations across the East Africa corridor with innovation and community investment.',
  },
  {
    year:        'Future',
    title:       'Continental Legacy',
    description: 'Building Africa\'s premier hospitality and service network — one property, one interaction at a time.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// AURA BUTTONS — the three-way switcher
// ─────────────────────────────────────────────────────────────────────────────
const AURA_BUTTONS = [
  { key: 'empire',   label: 'Empire',   icon: '🔥' },
  { key: 'plaza',    label: 'Plaza',    icon: '✦'  },
  { key: 'stopover', label: 'Stopover', icon: '⚡' },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const About = () => {
  const { activeBranch, toggleBranch } = useBusinessContext();

  // Safe fallback — empire is the new default; old saved state of plaza/stopover still works
  const branch     = ['empire', 'plaza', 'stopover'].includes(activeBranch) ? activeBranch : 'empire';
  const storyData  = STORY_CONTENT[branch];
  const trustStats = TRUST_STATS[branch];
  const standards  = getProfessionalStandards(branch);
  const portfolio  = PORTFOLIO_ITEMS[branch];

  const heroSubtitle = {
    empire:   'The Holding Company Behind East Africa\'s Finest Experiences',
    plaza:    'Luxury Heritage Across East Africa',
    stopover: 'Engineered Excellence for Modern Travelers',
  }[branch];

  const portfolioLabel = {
    empire:   'Empire',
    plaza:    'Luxury',
    stopover: 'Innovation',
  }[branch];

  const whyChooseLabel = {
    empire:   'The Penuel Empire',
    plaza:    'Penuel Plaza',
    stopover: 'Penuel Stopover',
  }[branch];

  const videoLabel = {
    empire:   'Penuel Empire: The Vision',
    plaza:    'Penuel Plaza: The Journey',
    stopover: 'Penuel Stopover: The Journey',
  }[branch];

  return (
    <div className="about">

      {/* ── HERO ── */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>Our Story</h1>
          <p>{heroSubtitle}</p>
        </div>
      </section>

      {/* ── AURA SWITCHER STRIP ── */}
      <section className="about-switcher-section">
        <div className="container">
          <div className="about-switcher">
            <span className="switcher-label">Explore Our Brand</span>
            <div className="switcher-buttons">
              {AURA_BUTTONS.map(({ key, label, icon }) => (
                <button
                  key={key}
                  className={`switcher-btn switcher-btn--${key} ${branch === key ? 'active' : ''}`}
                  onClick={() => toggleBranch(key)}
                  aria-label={`Switch to ${label}`}
                  aria-pressed={branch === key}
                  title={`Penuel ${label}`}
                >
                  <span className="switcher-btn-icon">{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="trust-bar">
        <div className="container">
          <div className="trust-stats-grid">
            {trustStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="trust-stat">
                  <div className="stat-icon">
                    <IconComponent size={40} />
                  </div>
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

      {/* ── BRAND STORY ── */}
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
                <span style={{ fontSize: '64px' }}>
                  {branch === 'empire' ? '🔥' : '🎬'}
                </span>
                <p>{videoLabel}</p>
                <span>Video Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROFESSIONAL STANDARDS ── */}
      <section className="professional-standards">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose {whyChooseLabel}</h2>
            <p>What Sets Us Apart in the Industry</p>
          </div>
          <div className="standards-grid">
            {standards.map((standard, index) => {
              const IconComponent = standard.icon;
              return (
                <div key={index} className="standard-card">
                  <div className="standard-icon">
                    <IconComponent size={48} />
                  </div>
                  <h3>{standard.title}</h3>
                  <p className="standard-description">{standard.description}</p>
                  <div className="standard-keywords">
                    <small>{standard.keywords}</small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ── */}
      <section className="portfolio-section">
        <div className="container">
          <div className="section-header">
            <h2>Our {portfolioLabel} Portfolio</h2>
            <p>Showcase of Excellence Across Our Properties</p>
          </div>
          <div className="portfolio-grid">
            {portfolio.map((item) => (
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

      {/* ── VALUES — shared across all branches ── */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Values</h2>
            <p>The Principles That Guide Every Decision</p>
          </div>
          <div className="values-grid">
            {[
              { icon: Award,  title: 'Excellence', description: 'Highest standards in every interaction, across every property.' },
              { icon: Users,  title: 'Community',  description: 'Investing in our people and the communities we serve.'          },
              { icon: Zap,    title: 'Innovation', description: 'Forward-thinking solutions for modern travelers.'                },
              { icon: Shield, title: 'Integrity',  description: 'Built on honesty, transparency, and ethics.'                    },
            ].map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="value-card">
                  <div className="value-icon">
                    <IconComponent size={40} />
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HERITAGE TIMELINE ── */}
      <section className="heritage-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Heritage</h2>
            <p>Milestones That Define Our Journey</p>
          </div>
          <div className="timeline">
            {TIMELINE.map((milestone, index) => (
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

      {/* ── CTA ── */}
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
