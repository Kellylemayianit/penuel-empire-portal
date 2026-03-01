import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Building2, Fuel, Flame, Globe, ChevronRight } from 'lucide-react';
import { useBusinessContext } from '../context/BusinessContext';
import '../styles/Home.css';

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT REGISTRY — all branch-specific copy lives here, not in JSX
// ─────────────────────────────────────────────────────────────────────────────
const BRANCH_CONTENT = {
  empire: {
    badge:     'Est. 2024 · Kenya\'s Premier Holdings',
    title:     'The Penuel Empire',
    subtitle:  'A holding company built on two pillars of excellence. Luxury hospitality and premium traveler services, unified under one vision for East Africa.',
    cta:       'Discover Our Properties',
    legacyHeading: 'One Vision. Two Empires.',
    legacyText: 'The Penuel Empire was forged from a singular conviction: that excellence is not accidental. It is engineered through meticulous design, relentless service, and an uncompromising commitment to the people we serve. From the quiet luxury of Amboseli to the pulse of the highway corridor, we are building East Africa\'s most trusted hospitality and service network.',
    propertiesTitle: 'Our Properties',
    footerHeading: 'Ready to Experience the Empire?',
    footerSub: 'Choose your experience. Both worlds await.',
    stats: [
      { number: '2',    label: 'Flagship Properties' },
      { number: '50K+', label: 'Guests Served' },
      { number: '100%', label: 'Commitment' },
    ],
  },
  plaza: {
    badge:     'Amboseli · Five-Star Luxury',
    title:     'Penuel Plaza',
    subtitle:  'Where the savanna meets sophistication. Five-star hospitality at the foot of Kilimanjaro, crafted for those who demand the extraordinary.',
    cta:       'Explore Our Services',
    legacyHeading: 'Our Legacy of Luxury',
    legacyText: 'Penuel Plaza was conceived as more than a hotel — it is an immersive African luxury experience. Every room frames Kilimanjaro. Every meal is a culinary journey. Every interaction is orchestrated to anticipate your desires before you voice them. We have hosted heads of state, celebrated couples, and solitary souls seeking silence. All are treated with the same devotion.',
    propertiesTitle: 'Our Offerings',
    footerHeading: 'Ready to Experience Penuel Plaza?',
    footerSub: 'Book your stay and discover what true luxury means.',
    stats: [
      { number: '5★',   label: 'Hotel Rating' },
      { number: '500+', label: 'Happy Guests' },
      { number: '24/7', label: 'Concierge' },
    ],
  },
  stopover: {
    badge:     'Highway A109 · 24/7 Service Hub',
    title:     'Penuel Stopover',
    subtitle:  'Engineered for the road. Premium retail, rapid dining, and expert automotive services for the modern traveler who refuses to compromise in transit.',
    cta:       'Browse Services',
    legacyHeading: 'Excellence on the Move',
    legacyText: 'Penuel Stopover reimagines what a highway stop can be. We engineered every service for speed without sacrificing quality. Solar-powered operations, certified automotive technicians, a restaurant that rivals Nairobi\'s best, and a retail floor curated for the discerning traveler. We exist because great journeys deserve great stops.',
    propertiesTitle: 'Our Services',
    footerHeading: 'On the Road? We\'re Ready.',
    footerSub: 'Premium services, minimal wait times. Your journey, uninterrupted.',
    stats: [
      { number: '24/7',  label: 'Operations' },
      { number: '50K+',  label: 'Travelers' },
      { number: '15min', label: 'Avg. Service' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PROPERTY CARDS — what appears in the grid
// ─────────────────────────────────────────────────────────────────────────────
const PROPERTY_CARDS = {
  empire: [
    {
      icon: Building2,
      title: 'Penuel Plaza',
      description: 'Five-star luxury at the foot of Kilimanjaro. Premium rooms, fine dining, and a world-class spa in Amboseli.',
      features: ['Premium Rooms', 'Fine Dining', 'Spa & Wellness'],
      cta: 'Explore Plaza',
      branch: 'plaza',
    },
    {
      icon: Fuel,
      title: 'Penuel Stopover',
      description: 'Engineered for the modern traveler. Premium retail, expert auto services, and rapid dining on the Amboseli corridor.',
      features: ['Express Retail', 'Quick Dining', 'Auto Services'],
      cta: 'Explore Stopover',
      branch: 'stopover',
    },
  ],
  plaza: [
    {
      icon: Building2,
      title: 'Safari View Standard',
      description: 'Wake to Kilimanjaro framed in your window. King-size comfort with private balcony overlooking the savanna.',
      features: ['King-size Bed', 'Private Balcony', 'Kilimanjaro View'],
      cta: 'View Room',
      branch: null,
    },
    {
      icon: Sparkles,
      title: 'Amboseli Experiences',
      description: 'Sunrise safari drives, Maasai village immersions, and gourmet picnics at iconic vantage points.',
      features: ['Safari Drives', 'Cultural Tours', 'Spa Retreat'],
      cta: 'See Experiences',
      branch: null,
    },
  ],
  stopover: [
    {
      icon: Fuel,
      title: 'Executive Wash & Service',
      description: 'Certified technicians, three service bays, and a premium wash that respects your vehicle.',
      features: ['Standard Wash', 'Executive Detail', 'Oil Change'],
      cta: 'View Services',
      branch: null,
    },
    {
      icon: Globe,
      title: "Wayfarer's Kitchen",
      description: 'A full quick-service restaurant. Ugali, grills, fresh juice — quality food for travelers on any schedule.',
      features: ['Full Menu', 'Quick Service', 'Fresh Daily'],
      cta: 'See Menu',
      branch: null,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// AURA BUTTON LABELS
// ─────────────────────────────────────────────────────────────────────────────
const AURA_BUTTONS = [
  { key: 'empire',   label: 'Empire',   icon: '🔥' },
  { key: 'plaza',    label: 'Plaza',    icon: '✦'  },
  { key: 'stopover', label: 'Stopover', icon: '⚡' },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();
  const { activeBranch, toggleBranch } = useBusinessContext();

  const content = BRANCH_CONTENT[activeBranch] || BRANCH_CONTENT.empire;
  const cards   = PROPERTY_CARDS[activeBranch] || PROPERTY_CARDS.empire;

  const handleCardClick = (card) => {
    if (card.branch) {
      // Switching to a sub-brand — update context and navigate
      toggleBranch(card.branch);
      navigate('/catalogue');
    } else {
      navigate('/catalogue');
    }
  };

  return (
    <div className="home">

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-content">

          <div className="hero-badge">
            <Sparkles size={14} />
            <span>{content.badge}</span>
          </div>

          <h1 className="hero-title">{content.title}</h1>

          <p className="hero-subtitle">{content.subtitle}</p>

          <button
            className="hero-cta"
            onClick={() => navigate('/catalogue')}
          >
            {content.cta}
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="hero-gradient" />
      </section>

      {/* ── AURA SELECTOR STRIP ── */}
      <div className="aura-selector">
        <span className="aura-selector-label">Switch Experience</span>
        <div className="aura-selector-buttons">
          {AURA_BUTTONS.map(({ key, label, icon }) => (
            <button
              key={key}
              className={`aura-btn ${key} ${activeBranch === key ? 'active' : ''}`}
              onClick={() => toggleBranch(key)}
              aria-label={`Switch to ${label} view`}
              aria-pressed={activeBranch === key}
            >
              <span className="aura-btn-icon">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── LEGACY / IDENTITY ── */}
      <section className="legacy-section">
        <div className="legacy-container">
          <h2>{content.legacyHeading}</h2>
          <p className="legacy-text">{content.legacyText}</p>

          {/* Stats bar — visible in all states */}
          <div className="empire-stats">
            {content.stats.map((stat, i) => (
              <div key={i} className="empire-stat">
                <div className="empire-stat-number">{stat.number}</div>
                <div className="empire-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROPERTIES / OFFERINGS ── */}
      <section className="properties-section">
        <div className="properties-container">
          <h2 className="properties-title">{content.propertiesTitle}</h2>

          <div className="properties-grid">
            {cards.map((card, i) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={i}
                  className={`property-card ${card.branch ? `${card.branch}-card` : ''}`}
                  onClick={() => handleCardClick(card)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleCardClick(card)}
                >
                  <div className="card-icon">
                    <IconComponent size={48} />
                  </div>

                  <h3>{card.title}</h3>
                  <p>{card.description}</p>

                  <div className="card-features">
                    {card.features.map((f, fi) => (
                      <span key={fi}>{f}</span>
                    ))}
                  </div>

                  <button
                    className="card-cta"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(card);
                    }}
                  >
                    {card.cta}
                    <ArrowRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="footer-cta">
        <h2>{content.footerHeading}</h2>
        <p>{content.footerSub}</p>
        <button
          className="footer-cta-btn"
          onClick={() => navigate('/catalogue')}
        >
          {content.cta}
        </button>
      </section>

    </div>
  );
};

export default Home;
