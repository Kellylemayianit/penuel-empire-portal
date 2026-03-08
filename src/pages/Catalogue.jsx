/**
 * Catalogue.jsx — Penuel Empire Discovery Portal
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * TASK 1 — FloatingSwitcher REMOVED from this file.
 *   It now lives in App.jsx as <FloatingAuraController /> so it persists
 *   on every page inside BusinessProvider.
 *
 * TASK 2 — Stopover data path correction.
 *   All four stopover normalizers now read the EXACT paths in stopover.json:
 *
 *   normalizeStopoverRestaurant(data)
 *     data = stopoverData.units.restaurant.menu_categories   (array)
 *     each cat: { category_id, name, items: [{ id, dish, price, prep_time_minutes }] }
 *
 *   normalizeStopoverSupermarket(data)
 *     data = stopoverData.units.supermarket.categories       (array)
 *     each cat: { category_id, name, items: [{ id, product, price, stock }] }
 *
 *   normalizeServiceBay(data)
 *     data = stopoverData.units.service_bay.services         (array)
 *     each svc: { service_id, service_name, service_fee, duration_minutes, suitable_for }
 *
 *   normalizeCarWash(data)
 *     data = stopoverData.units.car_wash.services            (array)
 *     each svc: { service_id, service_name, service_fee, duration_minutes, suitable_for }
 *
 *   Every normalizer:
 *     (a) if (!data) return [];
 *     (b) entire body wrapped in try/catch → console.warn + return [] on error
 *     (c) every property access uses optional chaining (?.)
 *     (d) Array.isArray() check before any .map() / .forEach()
 *
 * TASK 3 — Plaza dining normalizer: unchanged, handles both object and
 *   flat-array shapes (dual-path from previous session).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, {
  useRef, useCallback, useMemo, useEffect, useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusinessContext } from '../context/BusinessContext';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import '../styles/Catalogue.css';

// ─────────────────────────────────────────────────────────────────────────────
// GRADIENT PLACEHOLDERS — used when no image URL / on 404
// ─────────────────────────────────────────────────────────────────────────────
const PLACEHOLDERS = {
  empire:   'linear-gradient(135deg,#1e1e1e 0%,#2d1a00 50%,#ff4500 100%)',
  plaza:    'linear-gradient(135deg,#1a1a1a 0%,#2d2500 50%,#d4af37 100%)',
  stopover: 'linear-gradient(135deg,#071525 0%,#0a192f 50%,#0074d9 100%)',
};

// ─────────────────────────────────────────────────────────────────────────────
// CARD IMAGE MAP — keyed by exact JSON id fields
// ─────────────────────────────────────────────────────────────────────────────
const CARD_IMAGES = {
  // Plaza rooms
  room_001: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  room_002: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
  room_003: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80',
  room_004: 'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=600&q=80',
  room_005: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80',

  // Plaza dining
  dining_001: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
  dining_002: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
  menu_001:   'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
  menu_002:   'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
  menu_003:   'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80',
  menu_004:   'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80',
  menu_005:   'https://images.unsplash.com/photo-1609951651556-5334e2706168?w=600&q=80',
  menu_006:   'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
  menu_007:   'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80',

  // Stopover restaurant — ids match stopover.json menu items
  menu_008: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80',
  menu_009: 'https://images.unsplash.com/photo-1621956838481-f8a8e9f34500?w=600&q=80',
  menu_010: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80',
  menu_011: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80',

  // Stopover supermarket items
  item_001: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80',
  item_007: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&q=80',
  item_013: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=600&q=80',
  item_016: 'https://images.unsplash.com/photo-1596178067117-f5e7ff3e3d82?w=600&q=80',

  // Stopover service bay / car wash
  svc_001:  'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80',
  svc_002:  'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=600&q=80',
  wash_001: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&q=80',
  wash_002: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  wash_003: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&q=80',
};

function resolveImg(id, cardImage) {
  if (cardImage) return cardImage;
  return CARD_IMAGES[id] ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPIRE DISCOVERY CARD CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const EMPIRE_CATEGORIES = [
  {
    id: 'emp-plaza-rooms',     branch: 'plaza',    trackKey: 'rooms',
    label: 'Plaza · Rooms & Suites', icon: '🛏️',
    tagline: 'Five-star Amboseli accommodation',
    gradient: 'linear-gradient(160deg,#1a1a1a 0%,#2c2000 60%,#d4af37 100%)',
    badge: 'Stay',
  },
  {
    id: 'emp-plaza-dining',    branch: 'plaza',    trackKey: 'dining',
    label: 'Plaza · Dining', icon: '🍽️',
    tagline: 'Pan-African & international cuisine',
    gradient: 'linear-gradient(160deg,#1a1a1a 0%,#1f1500 60%,#c9a026 100%)',
    badge: 'Dine',
  },
  {
    id: 'emp-stop-restaurant', branch: 'stopover', trackKey: 'restaurant',
    label: 'Stopover · Restaurant', icon: '🍛',
    tagline: 'Fresh Kenyan road-stop meals',
    gradient: 'linear-gradient(160deg,#071525 0%,#0a192f 60%,#0074d9 100%)',
    badge: 'Eat',
  },
  {
    id: 'emp-stop-supermarket',branch: 'stopover', trackKey: 'supermarket',
    label: 'Stopover · Supermarket', icon: '🛒',
    tagline: 'Travel essentials & fresh groceries',
    gradient: 'linear-gradient(160deg,#071525 0%,#0b1e35 60%,#0056b3 100%)',
    badge: 'Shop',
  },
  {
    id: 'emp-stop-service',    branch: 'stopover', trackKey: 'servicebay',
    label: 'Stopover · Service Bay', icon: '🔧',
    tagline: 'Expert mechanical & tyre services',
    gradient: 'linear-gradient(160deg,#071525 0%,#051020 60%,#00c6ff 100%)',
    badge: 'Service',
  },
  {
    id: 'emp-stop-carwash',    branch: 'stopover', trackKey: 'carwash',
    label: 'Stopover · Car Wash', icon: '🚿',
    tagline: 'Express & executive 4×4 vehicle wash',
    gradient: 'linear-gradient(160deg,#071525 0%,#04101f 60%,#38b2ff 100%)',
    badge: 'Wash',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// NORMALIZERS
//
// Rules enforced on every function:
//   (a)  if (!data) return [];
//   (b)  try { … } catch (err) { console.warn(…); return []; }
//   (c)  every property access uses optional chaining (?.)
//   (d)  Array.isArray() guard before every .map() / .forEach()
// ─────────────────────────────────────────────────────────────────────────────

// ── Plaza Rooms ───────────────────────────────────────────────────────────────
function normalizePlazaRooms(data, currency = 'KES') {
  if (!data) return [];
  try {
    const rooms = Array.isArray(data) ? data : [];
    return rooms.map((room, i) => ({
      id:          `room-${room?.id ?? i}`,
      title:        room?.type        ?? 'Room',
      description:  room?.description ?? 'Luxury accommodation at Penuel Plaza.',
      price:        room?.rate_nightly != null
                      ? `${Number(room.rate_nightly).toLocaleString()} ${currency} / night`
                      : 'Contact for pricing',
      meta:         room?.capacity ? `Up to ${room.capacity} guests` : null,
      icon:         '🛏️',
      badge:        room?.badge ?? (i === rooms.length - 1 ? 'Top Suite' : null),
      badgeType:    i === rooms.length - 1 ? 'member' : 'launch-offer',
      tags:         room?.amenities?.slice(0, 3) ?? [],
      branch:       'plaza',
      trackKey:     'rooms',
      image:        resolveImg(room?.id, room?.card_image),
      rawData:      room,
    }));
  } catch (err) {
    console.warn('[normalizePlazaRooms]', err.message);
    return [];
  }
}

// ── Plaza Dining ──────────────────────────────────────────────────────────────
// Handles OBJECT shape { restaurants:[{ menu:[...] }], room_service:{menu:[...]} }
// AND flat ARRAY shape for backwards-compat.
function normalizePlazaDining(data, currency = 'KES') {
  if (!data) return [];
  try {
    // PATH A — object shape (real plaza.json)
    if (!Array.isArray(data) && typeof data === 'object') {
      const cards = [];

      const restaurants = Array.isArray(data.restaurants) ? data.restaurants : [];
      restaurants.forEach((restaurant, ri) => {
        const menu   = Array.isArray(restaurant?.menu) ? restaurant.menu : [];
        const isBar  = /bar|lounge/i.test(restaurant?.name ?? '');
        const fbPrice = restaurant?.average_meal_price != null
          ? `From ${Number(restaurant.average_meal_price).toLocaleString()} ${currency}`
          : 'See menu';

        if (menu.length === 0) {
          cards.push({
            id:          `dining-${restaurant?.id ?? `r${ri}`}`,
            title:        restaurant?.name ?? 'Restaurant',
            description:  [restaurant?.cuisine, restaurant?.service_hours && `Open ${restaurant.service_hours}`].filter(Boolean).join(' · ') || 'Fine dining at Penuel Plaza.',
            price:        fbPrice,
            meta:         restaurant?.seating_capacity ? `Seats ${restaurant.seating_capacity}` : null,
            icon:         isBar ? '🍹' : '🍽️',
            badge: null, badgeType: null, tags: [],
            branch: 'plaza', trackKey: 'dining',
            image:  resolveImg(restaurant?.id, restaurant?.card_image),
            rawData: restaurant,
          });
        } else {
          menu.forEach((item, mi) => {
            cards.push({
              id:          `dining-${restaurant?.id ?? `r${ri}`}-${item?.id ?? mi}`,
              title:        item?.name ?? restaurant?.name ?? 'Dish',
              description:  [item?.description, restaurant?.cuisine].filter(Boolean).join(' · ') || 'Curated dining.',
              price:        item?.price != null ? `${Number(item.price).toLocaleString()} ${currency}` : fbPrice,
              meta:         item?.category ? `${item.category} · ${restaurant?.name ?? ''}`.trim() : (restaurant?.name ?? null),
              icon:         isBar ? '🍹' : '🍽️',
              badge: null, badgeType: null, tags: [],
              branch: 'plaza', trackKey: 'dining',
              image:  resolveImg(item?.id, item?.card_image ?? restaurant?.card_image),
              rawData: { ...item, _restaurant: restaurant },
            });
          });
        }
      });

      // room_service items
      const rsMenu = Array.isArray(data.room_service?.menu) ? data.room_service.menu : [];
      rsMenu.forEach((item, i) => {
        cards.push({
          id:          `rs-${item?.id ?? i}`,
          title:        item?.name ?? `Room Service Item ${i + 1}`,
          description:  item?.description ?? '24-hour in-room dining, delivered to your suite.',
          price:        item?.price != null ? `${Number(item.price).toLocaleString()} ${currency}` : 'See menu',
          meta:         item?.category ? `Room Service · ${item.category}` : 'Room Service · 24hrs',
          icon: '🔔',
          badge: i === 0 ? '24/7' : null, badgeType: 'launch-offer', tags: [],
          branch: 'plaza', trackKey: 'dining',
          image:  resolveImg(item?.id, item?.card_image),
          rawData: item,
        });
      });

      return cards;
    }

    // PATH B — flat array (backwards-compat)
    if (Array.isArray(data)) {
      return data.map((outlet, i) => ({
        id:          `dining-${outlet?.id ?? i}`,
        title:        outlet?.name ?? 'Dining Outlet',
        description:  [outlet?.cuisine, outlet?.service_hours && `Open ${outlet.service_hours}`].filter(Boolean).join(' · ') || 'Curated dining.',
        price:        outlet?.average_meal_price != null
                        ? `From ${Number(outlet.average_meal_price).toLocaleString()} ${currency}`
                        : 'See menu',
        meta:         outlet?.seating_capacity ? `Seats ${outlet.seating_capacity}` : null,
        icon:         /bar|beverage|drink/i.test(`${outlet?.name} ${outlet?.cuisine}`) ? '🍹' : '🍽️',
        badge: null, badgeType: null, tags: [],
        branch: 'plaza', trackKey: 'dining',
        image:  resolveImg(outlet?.id, outlet?.card_image),
        rawData: outlet,
      }));
    }

    return [];
  } catch (err) {
    console.warn('[normalizePlazaDining]', err.message);
    return [];
  }
}

// ── Stopover Restaurant ───────────────────────────────────────────────────────
// DATA PATH: stopoverData.units.restaurant.menu_categories
// Each category: { category_id, name, items: [{ id, dish, price, prep_time_minutes, description, availability }] }
function normalizeStopoverRestaurant(data, currency = 'KES') {
  if (!data) return [];
  try {
    const cats = Array.isArray(data) ? data : [];
    const cards = [];

    cats.forEach((cat) => {
      const catName = cat?.name ?? '';
      const isCafe  = /café|cafe|beverage|coffee|drink|juice|smoothie/i.test(catName);
      const items   = Array.isArray(cat?.items) ? cat.items : [];

      items.forEach((item) => {
        const isAvailable = item?.availability !== false;
        cards.push({
          id:          `food-${cat?.category_id ?? 'c'}-${item?.id ?? cards.length}`,
          title:        item?.dish ?? 'Menu Item',
          description:  item?.description
                          ?? (isAvailable
                            ? `Ready in ~${item?.prep_time_minutes ?? '?'} min`
                            : 'Currently unavailable'),
          price:        item?.price != null
                          ? `${Number(item.price).toLocaleString()} ${currency}`
                          : 'Ask at counter',
          meta:         catName
                          ? `${catName}${item?.prep_time_minutes ? ` · ~${item.prep_time_minutes} min` : ''}`
                          : null,
          icon:         isCafe ? '☕' : '🍛',
          badge:        !isAvailable ? 'Unavailable' : null,
          badgeType:    'default',
          tags:         [],
          branch:       'stopover',
          trackKey:     'restaurant',
          image:        resolveImg(item?.id, item?.card_image),
          rawData:      item,
        });
      });
    });

    return cards;
  } catch (err) {
    console.warn('[normalizeStopoverRestaurant]', err.message);
    return [];
  }
}

// ── Stopover Supermarket ──────────────────────────────────────────────────────
// DATA PATH: stopoverData.units.supermarket.categories
// Each category: { category_id, name, items: [{ id, product, price, stock, description }] }
function normalizeStopoverSupermarket(data, currency = 'KES') {
  if (!data) return [];
  try {
    const cats = Array.isArray(data) ? data : [];
    const cards = [];

    cats.forEach((cat) => {
      const label    = cat?.name ?? '';
      const isCraft  = /craft|souvenir/i.test(label);
      const isTravel = /travel|essential/i.test(label);
      const isFresh  = /fresh|grocer/i.test(label);
      const isSnack  = /snack|beverage/i.test(label);
      const items    = Array.isArray(cat?.items) ? cat.items : [];

      items.forEach((item) => {
        const lowStock = item?.stock != null && item.stock < 30;
        cards.push({
          id:          `retail-${cat?.category_id ?? 'c'}-${item?.id ?? cards.length}`,
          title:        item?.product ?? 'Item',
          description:  item?.description ?? label,
          price:        item?.price != null
                          ? `${Number(item.price).toLocaleString()} ${currency}`
                          : 'In-store pricing',
          meta:         item?.stock != null
                          ? `${item.stock} in stock · ${label}`
                          : label || null,
          icon:         isCraft  ? '🪆'
                        : isTravel ? '🎒'
                        : isFresh  ? '🥑'
                        : isSnack  ? '🍫'
                        : '🛒',
          badge:        lowStock ? 'Low Stock' : null,
          badgeType:    'launch-offer',
          tags:         [],
          branch:       'stopover',
          trackKey:     'supermarket',
          image:        resolveImg(item?.id, item?.card_image),
          rawData:      item,
        });
      });
    });

    return cards;
  } catch (err) {
    console.warn('[normalizeStopoverSupermarket]', err.message);
    return [];
  }
}

// ── Stopover Service Bay ──────────────────────────────────────────────────────
// DATA PATH: stopoverData.units.service_bay.services
// Each service: { service_id, service_name, service_fee, duration_minutes, suitable_for, description }
function normalizeServiceBay(data, currency = 'KES') {
  if (!data) return [];
  try {
    const services = Array.isArray(data) ? data : [];
    return services.map((svc, i) => {
      const name = svc?.service_name ?? '';
      return {
        id:          `svc-${svc?.service_id ?? i}`,
        title:        name || `Service ${i + 1}`,
        description:  svc?.description ?? svc?.suitable_for ?? 'All vehicles',
        price:        svc?.service_fee != null
                        ? `${Number(svc.service_fee).toLocaleString()} ${currency}`
                        : 'Contact for pricing',
        meta:         [
                        svc?.duration_minutes && `~${svc.duration_minutes} min`,
                        svc?.suitable_for,
                      ].filter(Boolean).join(' · ') || null,
        icon:         /oil/i.test(name)         ? '🛢️'
                      : /battery/i.test(name)   ? '🔋'
                      : /tyre|tire|wheel/i.test(name) ? '🔩'
                      : /brake/i.test(name)     ? '🚨'
                      : /air|ac|a\/c/i.test(name) ? '❄️'
                      : '🔧',
        badge:        i === 0 ? 'Express' : null,
        badgeType:    i === 0 ? 'member' : 'launch-offer',
        tags:         [],
        branch:       'stopover',
        trackKey:     'servicebay',
        image:        resolveImg(svc?.service_id, svc?.card_image),
        rawData:      svc,
      };
    });
  } catch (err) {
    console.warn('[normalizeServiceBay]', err.message);
    return [];
  }
}

// ── Stopover Car Wash ─────────────────────────────────────────────────────────
// DATA PATH: stopoverData.units.car_wash.services
// Each service: { service_id, service_name, service_fee, duration_minutes, suitable_for, description }
function normalizeCarWash(data, currency = 'KES') {
  if (!data) return [];
  try {
    const services = Array.isArray(data) ? data : [];
    return services.map((svc, i) => ({
      id:          `wash-${svc?.service_id ?? i}`,
      title:        svc?.service_name ?? `Wash ${i + 1}`,
      description:  svc?.description ?? svc?.suitable_for ?? 'All vehicles',
      price:        svc?.service_fee != null
                      ? `${Number(svc.service_fee).toLocaleString()} ${currency}`
                      : 'Contact for pricing',
      meta:         [
                      svc?.duration_minutes && `~${svc.duration_minutes} min`,
                      svc?.suitable_for,
                    ].filter(Boolean).join(' · ') || null,
      icon:         '🚿',
      badge:        i === 0 ? 'Popular' : null,
      badgeType:    i === 0 ? 'member' : 'launch-offer',
      tags:         [],
      branch:       'stopover',
      trackKey:     'carwash',
      image:        resolveImg(svc?.service_id, svc?.card_image),
      rawData:      svc,
    }));
  } catch (err) {
    console.warn('[normalizeCarWash]', err.message);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// ── Empire hero card ──────────────────────────────────────────────────────────
const EmpireCard = ({ cat, onDrillDown }) => (
  <article
    className="emp-card"
    style={{ background: cat.gradient }}
    onClick={() => onDrillDown(cat.branch, cat.trackKey)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onDrillDown(cat.branch, cat.trackKey)}
    aria-label={`Explore ${cat.label}`}
  >
    <div className="emp-card__noise" aria-hidden="true" />
    <span className="emp-card__badge">{cat.badge}</span>
    <div className="emp-card__icon"  aria-hidden="true">{cat.icon}</div>
    <h3 className="emp-card__label">{cat.label}</h3>
    <p  className="emp-card__tagline">{cat.tagline}</p>
    {cat.count > 0 && <span className="emp-card__count">{cat.count} items</span>}
    <div className="emp-card__cta">
      Explore <ChevronRight size={14} aria-hidden="true" />
    </div>
  </article>
);

// ── Service (Netflix) card ────────────────────────────────────────────────────
const ServiceCard = ({ item, index }) => {
  const navigate = useNavigate();
  const [imgErr, setImgErr] = useState(false);

  const handleClick = () => navigate(`/product/${item.id}`, { state: { item } });
  const showImg     = !!item.image && !imgErr;

  const heroStyle = showImg
    ? { backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: PLACEHOLDERS[item.branch ?? 'empire'] };

  return (
    <article
      className={`scard scard--aura-${item.branch ?? 'empire'}`}
      onClick={handleClick}
      style={{ '--stagger': index }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`View ${item.title}`}
    >
      <div className="scard__hero" style={heroStyle}>
        {/* Hidden sentinel: detects 404 → falls back to gradient */}
        {item.image && !imgErr && (
          <img
            src={item.image}
            alt=""
            aria-hidden="true"
            style={{ display: 'none' }}
            onError={() => setImgErr(true)}
          />
        )}
        <div className="scard__hero-overlay" aria-hidden="true" />
        {item.badge && (
          <span className={`scard__badge scard__badge--${item.badgeType ?? 'default'}`}>
            {item.badge}
          </span>
        )}
        <div className="scard__icon-over" aria-hidden="true">{item.icon}</div>
      </div>

      <div className="scard__body">
        <h4 className="scard__title">{item.title}</h4>
        <p  className="scard__desc">{item.description}</p>
        {item.meta && <span className="scard__meta">{item.meta}</span>}
        {item.tags?.length > 0 && (
          <ul className="scard__tags" aria-label="Features">
            {item.tags.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        )}
        <div className="scard__footer">
          <span className="scard__price">{item.price}</span>
          <span className="scard__arrow" aria-hidden="true">
            <ChevronRight size={15} />
          </span>
        </div>
      </div>
    </article>
  );
};

// ── Netflix auto-scroll track ─────────────────────────────────────────────────
const SlideshowSection = ({ title, emoji, items = [], accentClass = '', trackId = '' }) => {
  const trackRef  = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || items.length < 2) return;
    const tick = () => {
      if (pausedRef.current) return;
      const max = el.scrollWidth - el.clientWidth;
      el.scrollLeft >= max - 10
        ? el.scrollTo({ left: 0, behavior: 'smooth' })
        : el.scrollBy({ left: 318, behavior: 'smooth' });
    };
    const timer = setInterval(tick, 4000);
    return () => clearInterval(timer);
  }, [items.length]);

  const pause  = () => { pausedRef.current = true;  };
  const resume = () => { pausedRef.current = false; };
  const scroll = useCallback((dir) => {
    trackRef.current?.scrollBy({ left: dir === 'prev' ? -636 : 636, behavior: 'smooth' });
  }, []);

  if (!items.length) return null;

  return (
    <section className="slideshow" id={trackId} aria-labelledby={`sh-${trackId}`}>
      <div className="slideshow__header">
        <div className="slideshow__title-group">
          <span className="slideshow__icon" aria-hidden="true">{emoji}</span>
          <h3
            id={`sh-${trackId}`}
            className={`slideshow__title gradient-text ${accentClass}`}
          >
            {title}
          </h3>
          <span className="slideshow__count">{items.length}</span>
        </div>
        <div className="slideshow__arrows">
          <button className="arrow-btn" onClick={() => scroll('prev')} aria-label="Scroll left">
            <ChevronLeft size={15} aria-hidden="true" />
          </button>
          <button className="arrow-btn" onClick={() => scroll('next')} aria-label="Scroll right">
            <ChevronRight size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        className="slideshow__track"
        ref={trackRef}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onTouchStart={pause}
        onTouchEnd={resume}
      >
        {items.map((item, idx) => (
          <ServiceCard key={item.id} item={item} index={idx} />
        ))}
        <div className="slideshow__sentinel" aria-hidden="true" />
      </div>
    </section>
  );
};

// ── Brand section wrapper ─────────────────────────────────────────────────────
const BrandSection = ({ name, emoji, tagline, location, children }) => (
  <div className="brand-sect">
    <header className="brand-sect__head">
      <span className="brand-sect__emoji" aria-hidden="true">{emoji}</span>
      <div className="brand-sect__copy">
        <h2 className="brand-sect__name">{name}</h2>
        {tagline && <p className="brand-sect__tagline">{tagline}</p>}
        <p className="brand-sect__loc">
          <MapPin size={12} aria-hidden="true" /> {location}
        </p>
      </div>
    </header>
    <div className="brand-sect__rule" aria-hidden="true" />
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// CATALOGUE ROOT
// ─────────────────────────────────────────────────────────────────────────────
const Catalogue = () => {
  const { activeBranch, toggleBranch, getBranchInfo, plazaData, stopoverData }
    = useBusinessContext();

  const branchInfo = getBranchInfo?.() ?? {};
  const currency   = plazaData?.currency ?? stopoverData?.currency ?? 'KES';

  // ── Memoised normalizations ───────────────────────────────────────────────
  const plazaRooms = useMemo(
    () => normalizePlazaRooms(plazaData?.rooms, currency),
    [plazaData?.rooms, currency],
  );
  const plazaDining = useMemo(
    () => normalizePlazaDining(plazaData?.dining, currency),
    [plazaData?.dining, currency],
  );

  // TASK 2 — corrected paths matching stopover.json exactly
  const stopRestaurant = useMemo(
    () => normalizeStopoverRestaurant(
      stopoverData?.units?.restaurant?.menu_categories,
      currency,
    ),
    [stopoverData?.units?.restaurant, currency],
  );
  const stopSupermarket = useMemo(
    () => normalizeStopoverSupermarket(
      stopoverData?.units?.supermarket?.categories,
      currency,
    ),
    [stopoverData?.units?.supermarket, currency],
  );
  const stopServiceBay = useMemo(
    () => normalizeServiceBay(
      stopoverData?.units?.service_bay?.services,
      currency,
    ),
    [stopoverData?.units?.service_bay, currency],
  );
  const stopCarWash = useMemo(
    () => normalizeCarWash(
      stopoverData?.units?.car_wash?.services,
      currency,
    ),
    [stopoverData?.units?.car_wash, currency],
  );

  const trackCounts = {
    rooms:       plazaRooms.length,
    dining:      plazaDining.length,
    restaurant:  stopRestaurant.length,
    supermarket: stopSupermarket.length,
    servicebay:  stopServiceBay.length,
    carwash:     stopCarWash.length,
  };

  // ── Reliable drill-down scroll (pendingScrollRef pattern) ─────────────────
  // handleDrillDown stores the target id, then toggleBranch triggers a re-render.
  // The useEffect fires AFTER activeBranch state commits and React has painted
  // the new branch's DOM, then scrolls with a double-rAF to ensure paint.
  const pendingScrollRef = useRef(null);

  const handleDrillDown = useCallback((branch, trackKey) => {
    pendingScrollRef.current = `track-${trackKey}`;
    toggleBranch(branch);
  }, [toggleBranch]);

  useEffect(() => {
    const target = pendingScrollRef.current;
    if (!target) return;
    pendingScrollRef.current = null;
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(() => {
        document.getElementById(target)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return () => cancelAnimationFrame(r2);
    });
    return () => cancelAnimationFrame(r1);
  }, [activeBranch]);

  // ── Hero copy per branch ──────────────────────────────────────────────────
  const HERO = {
    empire:   { eyebrow: 'The Full Empire',  heading: 'Empire Portfolio', sub: 'One holding company. Two worlds. Infinite possibilities.' },
    plaza:    { eyebrow: 'Penuel Plaza',      heading: 'Stay & Dine',      sub: 'Five-star luxury in the heart of Amboseli — browse and book.' },
    stopover: { eyebrow: 'Penuel Stopover',   heading: 'Highway Services', sub: 'Your all-in-one highway hub — food, groceries, vehicle services, 24/7.' },
  };
  const { eyebrow, heading, sub } = HERO[activeBranch] ?? HERO.empire;

  const accentClass  = `accent--${activeBranch}`;
  const displayName  = activeBranch === 'empire' ? 'The Penuel Empire' : (branchInfo?.branch ?? '');
  const displayLoc   = activeBranch === 'empire' ? 'East Africa Portfolio' : (branchInfo?.location ?? '');

  const allCards = [
    ...plazaRooms, ...plazaDining,
    ...stopRestaurant, ...stopSupermarket, ...stopServiceBay, ...stopCarWash,
  ];

  return (
    <div className={`catalogue catalogue--${activeBranch} page-with-floater`}>

      {/* ── HERO ── */}
      <header className="cat-hero">
        <div className="cat-hero__glow"  aria-hidden="true" />
        <div className="cat-hero__noise" aria-hidden="true" />
        <div className="cat-hero__content">
          <p className={`cat-hero__eyebrow gradient-text ${accentClass}`}>{eyebrow}</p>
          <h1 className="cat-hero__heading">{heading}</h1>
          <p className="cat-hero__sub">{sub}</p>
        </div>
      </header>

      {/* ── STICKY AURA STRIP ── */}
      <nav className="aura-strip" aria-label="Branch navigation">
        <div className="aura-strip__inner">
          <div className="aura-strip__meta">
            <span className="aura-strip__name">{displayName}</span>
            <span className="aura-strip__loc">
              <MapPin size={11} aria-hidden="true" /> {displayLoc}
            </span>
          </div>
          <div className="aura-strip__btns" role="group" aria-label="Switch brand view">
            {[
              { key: 'empire',   icon: '🔥', label: 'Empire'   },
              { key: 'plaza',    icon: '🏨', label: 'Plaza'    },
              { key: 'stopover', icon: '⛽', label: 'Stopover' },
            ].map(({ key, icon, label }) => (
              <button
                key={key}
                className={`aura-btn aura-btn--${key}${activeBranch === key ? ' is-active' : ''}`}
                onClick={() => toggleBranch(key)}
                aria-pressed={activeBranch === key}
              >
                <span aria-hidden="true">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="cat-body">

        {/* EMPIRE — discovery grid */}
        {activeBranch === 'empire' && (
          <div className="empire-grid">
            <p className="empire-grid__intro">
              Select a category to explore — or switch to Plaza / Stopover for the full catalogue.
            </p>
            <div className="empire-grid__cards">
              {EMPIRE_CATEGORIES.map((cat) => (
                <EmpireCard
                  key={cat.id}
                  cat={{ ...cat, count: trackCounts[cat.trackKey] }}
                  onDrillDown={handleDrillDown}
                />
              ))}
            </div>
          </div>
        )}

        {/* PLAZA — rooms + dining tracks */}
        {activeBranch === 'plaza' && (
          <div className="brand-view">
            <BrandSection
              name="Penuel Plaza"
              emoji="🏨"
              tagline="Luxury Amboseli · 5-Star"
              location={plazaData?.location ?? 'Amboseli National Park Region'}
            >
              <SlideshowSection
                title="Rooms & Suites"
                emoji="🛏️"
                items={plazaRooms}
                accentClass={accentClass}
                trackId="track-rooms"
              />
              <SlideshowSection
                title="Restaurant & Bar"
                emoji="🍽️"
                items={plazaDining}
                accentClass={accentClass}
                trackId="track-dining"
              />
            </BrandSection>
          </div>
        )}

        {/* STOPOVER — all four service tracks */}
        {activeBranch === 'stopover' && (
          <div className="brand-view">
            <BrandSection
              name="Penuel Stopover"
              emoji="⛽"
              tagline="Multi-Service Hub · 24/7"
              location={stopoverData?.location ?? 'Highway Rest Stop — Amboseli Corridor, A109'}
            >
              <SlideshowSection
                title="Restaurant & Café"
                emoji="🍛"
                items={stopRestaurant}
                accentClass={accentClass}
                trackId="track-restaurant"
              />
              <SlideshowSection
                title="Supermarket"
                emoji="🛒"
                items={stopSupermarket}
                accentClass={accentClass}
                trackId="track-supermarket"
              />
              <SlideshowSection
                title="Service Bay"
                emoji="🔧"
                items={stopServiceBay}
                accentClass={accentClass}
                trackId="track-servicebay"
              />
              <SlideshowSection
                title="Car Wash"
                emoji="🚿"
                items={stopCarWash}
                accentClass={accentClass}
                trackId="track-carwash"
              />
            </BrandSection>
          </div>
        )}

        {/* Empty state — shown only on non-empire branch with no data */}
        {activeBranch !== 'empire' && allCards.length === 0 && (
          <div className="cat-empty" role="alert">
            <span className="cat-empty__icon" aria-hidden="true">🔍</span>
            <h3>No data loaded</h3>
            <p>
              Confirm <code>plaza.json</code> and <code>stopover.json</code> are
              imported in <code>BusinessContext.jsx</code>.
            </p>
          </div>
        )}
      </main>

      {/* ── FOOTER CTA ── */}
      <section className="cat-cta">
        <div className="cat-cta__glow" aria-hidden="true" />
        <div className="cat-cta__inner">
          <h2 className={`gradient-text ${accentClass}`}>
            Ready to Experience the Empire?
          </h2>
          <p>Luxury stays, fresh meals, precision vehicle services — one portfolio, one vision.</p>
          <div className="cat-cta__btns">
            <button className="cta-primary" type="button">Book Now</button>
            <button className="cta-ghost"   type="button">Contact Us</button>
          </div>
        </div>
      </section>

      {/*
        FloatingSwitcher has been REMOVED from here.
        It now lives in App.jsx as <FloatingAuraController /> and persists on
        every public page. No duplicate switcher needed in Catalogue.
      */}
    </div>
  );
};

export default Catalogue;
