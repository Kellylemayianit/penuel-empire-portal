import React, { useMemo } from 'react';
import { useBusinessContext } from '../context/BusinessContext';
import { Wrench, MapPin, Clock, Zap, Award } from 'lucide-react';
import '../styles/Catalogue.css';

/**
 * Catalogue.jsx - SEO-Rich, High-Conversion Services Page
 * 
 * Structure:
 * 1. Header Section
 * 2. Branch Toggle & Info
 * 3. Services Grid (with Member Exclusive badges)
 * 4. Service Guide Section (SEO-optimized educational content)
 * 5. CTA Section
 * 
 * SEO Strategy:
 * - Dynamic content based on branch
 * - Keyword-rich descriptions
 * - Educational guides for each branch
 * - Conversion badges (Member Exclusive, Launch Offer)
 */

const Catalogue = () => {
  const { activeBranch, toggleBranch, getActiveBranchData, getBranchInfo } =
    useBusinessContext();

  const branchData = getActiveBranchData();
  const branchInfo = getBranchInfo();

  // Service Guide Content (SEO-Optimized Educational)
  const serviceGuides = {
    plaza: {
      title: 'What Defines a 5-Star Luxury Stay?',
      subtitle: 'The Penuel Plaza Experience',
      content: [
        {
          heading: 'Premium Accommodation Excellence',
          text: 'A true 5-star stay combines luxury accommodation with impeccable service. At Penuel Plaza, our executive rooms feature premium linens, modern amenities, and stunning views—designed for discerning travelers who expect perfection.',
          keywords: 'Luxury accommodation, premium rooms, 5-star hotel',
        },
        {
          heading: 'Concierge & Personal Services',
          text: 'Our dedicated concierge team anticipates your needs before you ask. From reservations to recommendations, we provide personalized attention that transforms a stay into an unforgettable experience.',
          keywords: 'Concierge services, personal attention, hotel services',
        },
        {
          heading: 'Executive Dining',
          text: 'Experience world-class culinary excellence. Our executive dining venues offer diverse cuisine, from international favorites to local specialties, all prepared by expert chefs using premium ingredients.',
          keywords: 'Executive dining, fine dining, culinary excellence',
        },
      ],
    },
    stopover: {
      title: 'The Science of a Perfect Pitstop',
      subtitle: 'Optimized Service for the Traveling Professional',
      content: [
        {
          heading: 'High-Speed Service Architecture',
          text: 'Time is precious for traveling professionals. Our Stopover model is engineered for efficiency—express check-in, rapid services, and quick retail access designed for travelers in a hurry.',
          keywords: 'Express service, quick fuel stops, traveler convenience',
        },
        {
          heading: 'Traveler Convenience Hub',
          text: 'Everything you need in one location. Quality fuel, curated retail, quick dining, and automotive services—all optimized for minimal downtime and maximum satisfaction.',
          keywords: 'Traveler stops, convenience services, quality fuel retail',
        },
        {
          heading: 'Quality Assurance Standards',
          text: 'Every service meets our rigorous quality standards. From fuel purity to food safety, from vehicle maintenance to retail selection, we guarantee excellence in every interaction.',
          keywords: 'Quality fuel, automotive services, food safety standards',
        },
      ],
    },
  };

  const guide = serviceGuides[activeBranch];

  // Memoized services with conversion badges
  const services = useMemo(() => {
    const serviceList = [];

    if (activeBranch === 'plaza') {
      if (branchData.rooms) {
        branchData.rooms.forEach((room, idx) => {
          serviceList.push({
            id: `room-${idx}`,
            type: 'room',
            title: room.type,
            description: room.description || 'Luxurious accommodation',
            price: `${room.rate_nightly} ${branchData.currency}`,
            icon: '🛏️',
            badge: idx === 0 ? '10% Off First Booking' : null,
            badgeType: idx === 0 ? 'launch-offer' : null,
          });
        });
      }
      if (branchData.experiences) {
        branchData.experiences.forEach((exp, idx) => {
          serviceList.push({
            id: `exp-${idx}`,
            type: 'experience',
            title: exp.name,
            description: exp.description,
            price: `${exp.price_per_person} ${branchData.currency}`,
            icon: '✨',
            badge: 'Member Exclusive',
            badgeType: 'member',
          });
        });
      }
    } else {
      if (branchData.units?.automotive?.services) {
        branchData.units.automotive.services.forEach((service, idx) => {
          serviceList.push({
            id: `auto-${idx}`,
            type: 'auto',
            title: service.service_name,
            description: service.description,
            price: `${service.service_fee} ${branchData.currency}`,
            icon: '🔧',
            badge: 'Launch Offer',
            badgeType: 'launch-offer',
            features: [`${service.service_duration_minutes} min`],
          });
        });
      }
      if (branchData.units?.retail?.categories) {
        branchData.units.retail.categories.forEach((category) => {
          category.items?.slice(0, 2).forEach((item, idx) => {
            serviceList.push({
              id: `retail-${category.name}-${idx}`,
              type: 'retail',
              title: item.product,
              description: category.name,
              price: `${item.price} ${branchData.currency}`,
              icon: '🛍️',
              badge: idx === 0 ? 'Member Exclusive' : null,
              badgeType: idx === 0 ? 'member' : null,
            });
          });
        });
      }
    }

    return serviceList;
  }, [activeBranch, branchData]);

  return (
    <div className="catalogue">
      {/* HEADER */}
      <section className="catalogue-header">
        <div className="header-content">
          <h1>Our Services & Offerings</h1>
          <p>Curated Excellence Across Our Premium Properties</p>
        </div>
      </section>

      {/* BRANCH SECTION */}
      <section className="branch-section">
        <div className="container">
          <div className="branch-info">
            <div className="branch-details">
              <h2>{branchInfo.branch}</h2>
              <p className="branch-location">
                <MapPin size={18} />
                {branchInfo.location}
              </p>
            </div>

            <div className="branch-toggle">
              <button
                className={`toggle-btn ${activeBranch === 'plaza' ? 'active' : ''}`}
                onClick={() => toggleBranch('plaza')}
              >
                Penuel Plaza
              </button>
              <button
                className={`toggle-btn ${activeBranch === 'stopover' ? 'active' : ''}`}
                onClick={() => toggleBranch('stopover')}
              >
                Penuel Stopover
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="services-section">
        <div className="container">
          {services.length > 0 ? (
            <div className="services-grid">
              {services.map((service) => (
                <div key={service.id} className="service-card">
                  {/* Conversion Badge */}
                  {service.badge && (
                    <div className={`service-badge ${service.badgeType}`}>
                      {service.badgeType === 'member' && <Award size={14} />}
                      {service.badgeType === 'launch-offer' && <Zap size={14} />}
                      <span>{service.badge}</span>
                    </div>
                  )}

                  <div className="service-icon">{service.icon}</div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>

                  {service.features && (
                    <div className="service-features">
                      {service.features.map((feature, idx) => (
                        <span key={idx} className="feature-tag">
                          <Clock size={14} />
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="service-footer">
                    <span className="service-price">{service.price}</span>
                    <button className="service-btn">Select</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-services">
              <p>No services available at this time</p>
            </div>
          )}
        </div>
      </section>

      {/* SERVICE GUIDE SECTION (SEO-Optimized Educational Content) */}
      <section className="service-guide">
        <div className="container">
          <div className="guide-header">
            <h2>{guide.title}</h2>
            <p>{guide.subtitle}</p>
          </div>

          <div className="guide-content">
            {guide.content.map((section, idx) => (
              <div key={idx} className="guide-block">
                <h3>{section.heading}</h3>
                <p>{section.text}</p>
                <div className="guide-keywords">
                  <small>📌 Keywords: {section.keywords}</small>
                </div>
              </div>
            ))}
          </div>

          {/* CTA within guide */}
          <div className="guide-cta">
            <h3>Ready to Experience the Difference?</h3>
            <button className="cta-btn">Book Your Experience Now</button>
          </div>
        </div>
      </section>

      {/* MAIN CTA */}
      <section className="catalogue-cta">
        <div className="cta-content">
          <h2>Join Our Community</h2>
          <p>Become a member and unlock exclusive benefits, early access to new services, and special pricing</p>
          <button className="cta-button primary">Become a Member</button>
          <button className="cta-button secondary">Learn More</button>
        </div>
      </section>
    </div>
  );
};

export default Catalogue;
