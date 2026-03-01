/**
 * Catalogue.jsx — Nested Category Slideshow System
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * DATA MAP (precise paths for updated plaza.json / stopover.json):
 *
 * PLAZA (4 Slideshows):
 *   Rooms & Suites     → plazaData.rooms[]
 *   Dining             → plazaData.dining.restaurants[].menu[]  (flattened)
 *   Room Service       → plazaData.dining.room_service.menu[]
 *   Event Catering     → plazaData.dining.event_catering.packages[]
 *
 * STOPOVER (4 Slideshows):
 *   Restaurant & Café  → stopoverData.units.restaurant.menu_categories[].items[]  (flattened)
 *   Supermarket        → stopoverData.units.supermarket.categories[].items[]       (flattened)
 *   Service Bay        → stopoverData.units.service_bay.services[]
 *   Car Wash           → stopoverData.units.car_wash.services[]
 *
 * EMPIRE: Both BusinessSections stacking all the above.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useCallback, useMemo } from 'react';
import { useBusinessContext } from '../context/BusinessContext';
import { MapPin, Flame, Globe, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/Catalogue.css';

// ─────────────────────────────────────────────────────────────────────────────
// DATA NORMALIZERS — all return uniform card objects, all null-safe
// ─────────────────────────────────────────────────────────────────────────────

function normalizePlazaRooms(rooms = [], currency = 'KES') {
  return rooms.map((room, i) => ({
    id:          `room-${room.id ?? i}`,
    title:       room.type ?? `Room ${i + 1}`,
    description: room.description ?? 'Luxurious accommodation at Penuel Plaza.',
    price:       room.rate_nightly != null
                   ? `${Number(room.rate_nightly).toLocaleString()} ${currency}/night`
                   : 'Contact for pricing',
    meta:        room.capacity ? `Up to ${room.capacity} guests` : null,
    icon:        '🛏️',
    badge:       room.badge ?? null,
    badgeType:   room.badge ? 'member' : null,
  }));
}

function normalizePlazaDining(restaurants = [], currency = 'KES') {
  const cards = [];
  restaurants.forEach((restaurant) => {
    (restaurant.menu ?? []).forEach((item, i) => {
      cards.push({
        id:          `dining-${restaurant.id ?? 'r'}-${item.id ?? i}`,
        title:       item.name ?? `Dish ${i + 1}`,
        description: item.description ?? `Served at ${restaurant.name}.`,
        price:       item.price != null
                       ? `${Number(item.price).toLocaleString()} ${currency}`
                       : 'Ask for menu',
        meta:        `${restaurant.name}${item.category ? ` · ${item.category}` : ''}`,
        icon:        '🍽️',
        badge:       null,
        badgeType:   null,
      });
    });
  });
  return cards;
}

function normalizePlazaRoomService(roomService = {}, currency = 'KES') {
  return (roomService.menu ?? []).map((item, i) => ({
    id:          `rs-${item.id ?? i}`,
    title:       item.name ?? `Item ${i + 1}`,
    description: item.description ?? 'Available 24 hours to your room.',
    price:       item.price != null
                   ? `${Number(item.price).toLocaleString()} ${currency}`
                   : 'Contact for pricing',
    meta:        item.category ? `${item.category} · 24 hrs` : '24 hrs in-room',
    icon:        '🔔',
    badge:       i === 0 ? '24 / 7' : null,
    badgeType:   'launch-offer',
  }));
}

function normalizePlazaCatering(eventCatering = {}, currency = 'KES') {
  return (eventCatering.packages ?? []).map((pkg, i) => ({
    id:          `catering-${pkg.id ?? i}`,
    title:       pkg.name ?? `Package ${i + 1}`,
    description: pkg.description ?? 'Premium event catering at Penuel Plaza.',
    price:       pkg.price_per_person != null
                   ? `${Number(pkg.price_per_person).toLocaleString()} ${currency}/person`
                   : 'Quote on request',
    meta:        pkg.min_guests && pkg.max_guests
                   ? `${pkg.min_guests}–${pkg.max_guests} guests`
                   : null,
    icon:        '🥂',
    badge:       i === 0 ? 'Most Popular' : null,
    badgeType:   'member',
  }));
}

function normalizeStopoverRestaurant(menuCategories = [], currency = 'KES') {
  const cards = [];
  menuCategories.forEach((cat) => {
    (cat.items ?? []).forEach((item, i) => {
      const name = item.dish ?? item.drink ?? `Item ${i + 1}`;
      const isBeverage = cat.name?.toLowerCase().includes('beverage') ||
                         cat.name?.toLowerCase().includes('café') ||
                         cat.name?.toLowerCase().includes('cafe');
      cards.push({
        id:          `stop-menu-${cat.category_id ?? 'c'}-${item.id ?? i}`,
        title:       name,
        description: item.description ?? `Fresh from Wayfarer's Kitchen.`,
        price:       item.price != null
                       ? `${Number(item.price).toLocaleString()} ${currency}`
                       : 'Ask at counter',
        meta:        item.prep_time_minutes
                       ? `${item.prep_time_minutes} min · ${cat.name}`
                       : cat.name,
        icon:        isBeverage ? '☕' : '🍛',
        badge:       null,
        badgeType:   null,
      });
    });
  });
  return cards;
}

function normalizeStopoverSupermarket(categories = [], currency = 'KES') {
  const cards = [];
  categories.forEach((cat) => {
    const catName = cat.name ?? '';
    const icon = catName.toLowerCase().includes('fresh') || catName.toLowerCase().includes('grocer')
      ? '🥦'
      : catName.toLowerCase().includes('craft') || catName.toLowerCase().includes('souvenir')
        ? '🪆'
        : catName.toLowerCase().includes('snack') || catName.toLowerCase().includes('beverage')
          ? '🧃'
          : '🛒';
    (cat.items ?? []).forEach((item, i) => {
      cards.push({
        id:          `super-${cat.category_id ?? 'c'}-${item.id ?? i}`,
        title:       item.product ?? `Item ${i + 1}`,
        description: item.description ?? 'Available at Penuel Express Supermarket.',
        price:       item.price != null
                       ? `${Number(item.price).toLocaleString()} ${currency}`
                       : 'In-store pricing',
        meta:        `${catName}${item.stock != null ? ` · ${item.stock} in stock` : ''}`,
        icon,
        badge:       null,
        badgeType:   null,
      });
    });
  });
  return cards;
}

function normalizeStopoverServiceBay(services = [], currency = 'KES') {
  return services.map((svc, i) => ({
    id:          `svc-${svc.service_id ?? i}`,
    title:       svc.service_name ?? `Service ${i + 1}`,
    description: svc.description ?? 'Professional vehicle service at Penuel Service Bay.',
    price:       svc.service_fee != null
                   ? `${Number(svc.service_fee).toLocaleString()} ${currency}`
                   : 'Contact for pricing',
    meta:        svc.duration_minutes
                   ? `~${svc.duration_minutes} min · ${svc.suitable_for ?? 'All vehicles'}`
                   : svc.suitable_for ?? null,
    icon:        '🔧',
    badge:       i === 0 ? 'Express' : null,
    badgeType:   'launch-offer',
  }));
}

function normalizeStopoverCarWash(services = [], currency = 'KES') {
  return services.map((svc, i) => ({
    id:          `wash-${svc.service_id ?? i}`,
    title:       svc.service_name ?? `Wash Package ${i + 1}`,
    description: svc.description ?? 'Premium car wash at Penuel Express Car Wash.',
    price:       svc.service_fee != null
                   ? `${Number(svc.service_fee).toLocaleString()} ${currency}`
                   : 'Contact for pricing',
    meta:        svc.duration_minutes
                   ? `~${svc.duration_minutes} min · ${svc.suitable_for ?? 'All vehicles'}`
                   : svc.suitable_for ?? null,
    icon:        '🚿',
    badge:       i === 0 ? 'Most Popular' : null,
    badgeType:   'member',
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// ServiceCard — 300px fixed-width swipeable tile
// ─────────────────────────────────────────────────────────────────────────────
const ServiceCard = ({ item }) => (
  <article className="service-card">
    {item.badge && (
      <span className={`service-badge service-badge--${item.badgeType ?? 'default'}`}>
        {item.badge}
      </span>
    )}
    <div  className="service-card__icon" aria-hidden="true">{item.icon}</div>
    <h4   className="service-card__title">{item.title}</h4>
    <p    className="service-card__desc">{item.description}</p>
    {item.meta && <span className="service-card__meta">{item.meta}</span>}
    <div className="service-card__footer">
      <span className="service-card__price">{item.price}</span>
      <button className="service-card__btn" aria-label={`Enquire about ${item.title}`}>
        Enquire
      </button>
    </div>
  </article>
);

// ─────────────────────────────────────────────────────────────────────────────
// SlideshowSection — horizontal scroll row (renders null if items is empty)
// ─────────────────────────────────────────────────────────────────────────────
const SlideshowSection = ({ title, icon, items = [], accentClass = '' }) => {
  const trackRef = useRef(null);
  const scroll   = useCallback((dir) => {
    trackRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  }, []);

  if (!items.length) return null;

  return (
    <section className="slideshow-section" aria-label={title}>
      <div className="slideshow-section__header">
        <div className="slideshow-section__title-row">
          <span className="slideshow-section__icon" aria-hidden="true">{icon}</span>
          <h3 className={`slideshow-section__title gradient-text ${accentClass}`}>{title}</h3>
          <span className="slideshow-section__count">{items.length} items</span>
        </div>
        <div className="slideshow-section__controls">
          <button className="slideshow-arrow" onClick={() => scroll('left')} aria-label="Scroll left">
            <ChevronLeft size={18} />
          </button>
          <button className="slideshow-arrow" onClick={() => scroll('right')} aria-label="Scroll right">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="slideshow-track" ref={trackRef}>
        {items.map((item) => <ServiceCard key={item.id} item={item} />)}
        <div className="slideshow-track__sentinel" aria-hidden="true" />
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BusinessSection — empire-only brand wrapper
// ─────────────────────────────────────────────────────────────────────────────
const BusinessSection = ({ brandName, brandEmoji, tagline, location, children }) => (
  <div className="business-section">
    <div className="business-section__header">
      <div className="business-section__brand">
        <span className="business-section__emoji" aria-hidden="true">{brandEmoji}</span>
        <div className="business-section__brand-text">
          <h2 className="business-section__name">{brandName}</h2>
          {tagline && <p className="business-section__tagline">{tagline}</p>}
          <p className="business-section__location">
            <MapPin size={13} aria-hidden="true" /> {location}
          </p>
        </div>
      </div>
      <div className="business-section__divider" aria-hidden="true" />
    </div>
    <div className="business-section__slides">{children}</div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// CATALOGUE — root component
// ─────────────────────────────────────────────────────────────────────────────
const Catalogue = () => {
  const { activeBranch, toggleBranch, getBranchInfo, plazaData, stopoverData } =
    useBusinessContext();

  const branchInfo = getBranchInfo();
  const currency   = branchInfo?.currency ?? 'KES';

  // PLAZA slices
  const plazaRooms       = useMemo(() => normalizePlazaRooms(plazaData?.rooms ?? [], currency),
    [plazaData, currency]);
  const plazaDining      = useMemo(() => normalizePlazaDining(plazaData?.dining?.restaurants ?? [], currency),
    [plazaData, currency]);
  const plazaRoomService = useMemo(() => normalizePlazaRoomService(plazaData?.dining?.room_service ?? {}, currency),
    [plazaData, currency]);
  const plazaCatering    = useMemo(() => normalizePlazaCatering(plazaData?.dining?.event_catering ?? {}, currency),
    [plazaData, currency]);

  // STOPOVER slices
  const stopRestaurant  = useMemo(() => normalizeStopoverRestaurant(stopoverData?.units?.restaurant?.menu_categories ?? [], currency),
    [stopoverData, currency]);
  const stopSupermarket = useMemo(() => normalizeStopoverSupermarket(stopoverData?.units?.supermarket?.categories ?? [], currency),
    [stopoverData, currency]);
  const stopServiceBay  = useMemo(() => normalizeStopoverServiceBay(stopoverData?.units?.service_bay?.services ?? [], currency),
    [stopoverData, currency]);
  const stopCarWash     = useMemo(() => normalizeStopoverCarWash(stopoverData?.units?.car_wash?.services ?? [], currency),
    [stopoverData, currency]);

  const displayName     = activeBranch === 'empire' ? 'The Penuel Empire'     : branchInfo.branch;
  const displayLocation = activeBranch === 'empire' ? 'East Africa Portfolio' : branchInfo.location;
  const accentClass     = `accent--${activeBranch}`;

  const allEmpty = [plazaRooms, plazaDining, plazaRoomService, plazaCatering,
                    stopRestaurant, stopSupermarket, stopServiceBay, stopCarWash]
                    .every(a => a.length === 0);

  return (
    <div className={`catalogue catalogue--${activeBranch}`}>

      {/* HERO */}
      <header className="catalogue-header">
        <div className="catalogue-header__noise" aria-hidden="true" />
        <div className="catalogue-header__glow"  aria-hidden="true" />
        <div className="catalogue-header__content">
          <p className="catalogue-header__eyebrow">Our Services</p>
          <h1 className="catalogue-header__title">
            <span className={`gradient-text ${accentClass}`}>Empire Portfolio</span>
          </h1>
          <p className="catalogue-header__sub">
            Curated excellence across our premium properties — browse, explore, enquire.
          </p>
        </div>
      </header>

      {/* AURA STRIP */}
      <nav className="aura-strip" aria-label="Brand switcher">
        <div className="aura-strip__inner">
          <div className="aura-strip__meta">
            <span className="aura-strip__name">{displayName}</span>
            <span className="aura-strip__location">
              <MapPin size={13} aria-hidden="true" /> {displayLocation}
            </span>
          </div>
          <div className="aura-strip__buttons" role="group">
            <button
              className={`aura-btn aura-btn--empire   ${activeBranch === 'empire'   ? 'is-active' : ''}`}
              onClick={() => toggleBranch('empire')}
              aria-pressed={activeBranch === 'empire'}
            ><Flame size={15} /> Empire</button>
            <button
              className={`aura-btn aura-btn--plaza    ${activeBranch === 'plaza'    ? 'is-active' : ''}`}
              onClick={() => toggleBranch('plaza')}
              aria-pressed={activeBranch === 'plaza'}
            ><Globe size={15} /> Plaza</button>
            <button
              className={`aura-btn aura-btn--stopover ${activeBranch === 'stopover' ? 'is-active' : ''}`}
              onClick={() => toggleBranch('stopover')}
              aria-pressed={activeBranch === 'stopover'}
            ><Zap size={15} /> Stopover</button>
          </div>
        </div>
      </nav>

      {/* BODY */}
      <main className="catalogue-body">

        {allEmpty && (
          <div className="catalogue-empty" role="alert">
            <span className="catalogue-empty__icon">🔍</span>
            <h3>No services found</h3>
            <p>Ensure <code>plaza.json</code> and <code>stopover.json</code> are in <code>src/data/</code>.</p>
          </div>
        )}

        {/* EMPIRE — nested, all 8 slideshows across 2 brand sections */}
        {activeBranch === 'empire' && !allEmpty && (
          <>
            <BusinessSection
              brandName="Penuel Plaza"
              brandEmoji="🏨"
              tagline="Luxury Amboseli · 5-Star Heritage"
              location="Amboseli National Park Region, Kenya"
            >
              <SlideshowSection title="Rooms & Suites"      icon="🛏️" items={plazaRooms}       accentClass={accentClass} />
              <SlideshowSection title="Dining & Restaurants" icon="🍽️" items={plazaDining}      accentClass={accentClass} />
              <SlideshowSection title="Room Service"         icon="🔔" items={plazaRoomService} accentClass={accentClass} />
              <SlideshowSection title="Event Catering"       icon="🥂" items={plazaCatering}    accentClass={accentClass} />
            </BusinessSection>

            <BusinessSection
              brandName="Penuel Stopover"
              brandEmoji="⛽"
              tagline="Multi-Service Highway Hub · 24 / 7"
              location="A109 Amboseli Corridor, Kenya"
            >
              <SlideshowSection title="Restaurant & Café" icon="🍛" items={stopRestaurant}  accentClass={accentClass} />
              <SlideshowSection title="Supermarket"       icon="🛒" items={stopSupermarket} accentClass={accentClass} />
              <SlideshowSection title="Service Bay"       icon="🔧" items={stopServiceBay}  accentClass={accentClass} />
              <SlideshowSection title="Car Wash"          icon="🚿" items={stopCarWash}     accentClass={accentClass} />
            </BusinessSection>
          </>
        )}

        {/* PLAZA — 4 slideshows */}
        {activeBranch === 'plaza' && !allEmpty && (
          <div className="single-brand-view">
            <SlideshowSection title="Rooms & Suites"       icon="🛏️" items={plazaRooms}       accentClass={accentClass} />
            <SlideshowSection title="Dining & Restaurants" icon="🍽️" items={plazaDining}      accentClass={accentClass} />
            <SlideshowSection title="Room Service"         icon="🔔" items={plazaRoomService} accentClass={accentClass} />
            <SlideshowSection title="Event Catering"       icon="🥂" items={plazaCatering}    accentClass={accentClass} />
          </div>
        )}

        {/* STOPOVER — 4 slideshows */}
        {activeBranch === 'stopover' && !allEmpty && (
          <div className="single-brand-view">
            <SlideshowSection title="Restaurant & Café" icon="🍛" items={stopRestaurant}  accentClass={accentClass} />
            <SlideshowSection title="Supermarket"       icon="🛒" items={stopSupermarket} accentClass={accentClass} />
            <SlideshowSection title="Service Bay"       icon="🔧" items={stopServiceBay}  accentClass={accentClass} />
            <SlideshowSection title="Car Wash"          icon="🚿" items={stopCarWash}     accentClass={accentClass} />
          </div>
        )}

      </main>

      {/* FOOTER CTA */}
      <section className="catalogue-cta">
        <div className="catalogue-cta__inner">
          <h2 className={`gradient-text ${accentClass}`}>Ready to Experience the Empire?</h2>
          <p>Join thousands who choose Penuel for unmatched service and hospitality across East Africa.</p>
          <div className="catalogue-cta__actions">
            <button className="cta-btn cta-btn--primary">Book Now</button>
            <button className="cta-btn cta-btn--ghost">Contact Us</button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Catalogue;
