/**
 * ProductDetail.jsx — Immersive Branch-Aware Product Detail
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * TASK 3 FIX — if (!item) returns <LoadingScreen /> instead of crashing
 *
 * Branch-aware UI:
 *   plaza items    → Hotel Booking (check-in/out dates, amenity grid, "Book Stay")
 *   stopover items → Express Ticket (ETA badge, M-Pesa STK push)
 *
 * Background: strictly #1e1e1e — never cream
 * Route: /product/:id  |  Item via react-router location.state.item
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Clock, Users, Star, Wifi, Coffee,
  Zap, CheckCircle, Phone, Calendar, ChevronRight, Shield,
  Loader2,
} from 'lucide-react';
import { useBusinessContext } from '../context/BusinessContext';
import '../styles/ProductDetail.css';

// ─────────────────────────────────────────────────────────────────────────────
// HERO GRADIENTS  (Deep Phoenix palette — no cream)
// ─────────────────────────────────────────────────────────────────────────────
const HERO_GRADIENT = {
  plaza:    'linear-gradient(175deg,#1a1a1a 0%,#2c2000 40%,#d4af37 100%)',
  stopover: 'linear-gradient(175deg,#071525 0%,#0a192f 40%,#0074d9 100%)',
  empire:   'linear-gradient(175deg,#1e1e1e 0%,#2d1a00 40%,#ff4500 100%)',
};

const AMENITY_ICONS = {
  'king-size bed':      '🛏️', 'twin beds':          '🛏️',
  'wifi':               '📶', 'air conditioning':   '❄️',
  'smart tv':           '📺', 'mini bar':           '🍸',
  'premium bar':        '🥃', 'concierge service':  '🎩',
  'breakfast included': '🍳', 'jacuzzi':            '🛁',
  'marble ensuite':     '🛁', 'balcony':            '🌿',
  'private terrace':    '🌅', 'laundry service':    '👔',
  'housekeeping':       '🧹', 'entertainment':      '🎵',
};

function amenityIcon(str) {
  const lower = (str ?? '').toLowerCase();
  const key   = Object.keys(AMENITY_ICONS).find((k) => lower.includes(k));
  return key ? AMENITY_ICONS[key] : '✓';
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING SCREEN — shown when item is null (page refresh / direct URL)
// ─────────────────────────────────────────────────────────────────────────────
const LoadingScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="pd-loading">
      <div className="pd-loading__ring">
        <Loader2 size={38} className="pd-loading__spinner" aria-hidden="true" />
      </div>
      <h2 className="pd-loading__title">Loading item…</h2>
      <p className="pd-loading__sub">
        This page was opened directly. Navigate via the catalogue to load item data.
      </p>
      <button className="pd-loading__btn" onClick={() => navigate('/', { replace: true })}>
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Catalogue
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DATE PICKER
// ─────────────────────────────────────────────────────────────────────────────
const DatePicker = ({ label, value, onChange, min }) => (
  <div className="date-picker">
    <label className="date-picker__label">
      <Calendar size={13} aria-hidden="true" /> {label}
    </label>
    <input className="date-picker__input" type="date"
      value={value} min={min} onChange={(e) => onChange(e.target.value)} />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PLAZA BOOKING PANEL
// ─────────────────────────────────────────────────────────────────────────────
const PlazaBookingPanel = ({ item }) => {
  const today    = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [checkIn,  setCheckIn]  = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guests,   setGuests]   = useState(1);
  const [booked,   setBooked]   = useState(false);

  const nights   = Math.max(1, (new Date(checkOut) - new Date(checkIn)) / 86400000);
  const rawPrice = item?.rawData?.rate_nightly ?? 0;
  const total    = rawPrice * nights;

  const handleBook = () => { setBooked(true); setTimeout(() => setBooked(false), 4200); };

  return (
    <div className="booking-panel booking-panel--plaza">
      <div className="booking-panel__header">
        <span className="booking-panel__tag">Hotel Booking</span>
        <h3 className="booking-panel__price">{item.price}</h3>
      </div>

      <div className="booking-panel__dates">
        <DatePicker label="Check-in"  value={checkIn}  onChange={setCheckIn}  min={today}   />
        <DatePicker label="Check-out" value={checkOut} onChange={setCheckOut} min={checkIn} />
      </div>

      <div className="booking-panel__guests">
        <p className="booking-panel__guest-label"><Users size={13} aria-hidden="true" /> Guests</p>
        <div className="booking-panel__guest-row">
          <button className="guest-btn" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="Decrease guests">−</button>
          <span className="guest-count">{guests}</span>
          <button className="guest-btn" onClick={() => setGuests((g) => Math.min(item?.rawData?.capacity ?? 4, g + 1))} aria-label="Increase guests">+</button>
        </div>
      </div>

      {rawPrice > 0 && (
        <div className="booking-panel__summary">
          <div className="booking-summary-row">
            <span>{rawPrice.toLocaleString()} KES × {nights} night{nights !== 1 ? 's' : ''}</span>
            <span>{total.toLocaleString()} KES</span>
          </div>
          <div className="booking-summary-row booking-summary-row--total">
            <span>Total</span>
            <span className="booking-total">{total.toLocaleString()} KES</span>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {booked ? (
          <motion.div key="confirm" className="booking-confirm"
            initial={{ opacity:0, scale:0.88 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
          >
            <CheckCircle size={20} aria-hidden="true" /> Reservation request sent!
          </motion.div>
        ) : (
          <motion.button key="book" className="book-btn book-btn--plaza"
            onClick={handleBook} whileTap={{ scale:0.96 }}
          >
            Book Stay
          </motion.button>
        )}
      </AnimatePresence>

      <p className="booking-panel__note">
        <Shield size={11} aria-hidden="true" /> Free cancellation · Secure checkout
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STOPOVER EXPRESS TICKET PANEL
// ─────────────────────────────────────────────────────────────────────────────
const StopoverTicketPanel = ({ item }) => {
  const [phone,   setPhone]   = useState('');
  const [paid,    setPaid]    = useState(false);
  const [loading, setLoading] = useState(false);

  const eta = item?.rawData?.duration_minutes ?? item?.rawData?.prep_time_minutes ?? null;

  const handlePay = () => {
    if (!phone.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setPaid(true); }, 2000);
  };

  return (
    <div className="booking-panel booking-panel--stopover">
      <div className="booking-panel__header">
        <span className="booking-panel__tag booking-panel__tag--express">Express Service</span>
        <h3 className="booking-panel__price">{item.price}</h3>
      </div>

      {eta && (
        <div className="ticket-eta">
          <Clock size={16} aria-hidden="true" />
          <span>ETA <strong>~{eta} min</strong></span>
        </div>
      )}

      {item.meta && <p className="ticket-meta">{item.meta}</p>}

      <div className="ticket-phone">
        <p className="ticket-phone__label"><Phone size={13} aria-hidden="true" /> M-Pesa Number</p>
        <div className="ticket-phone__row">
          <span className="ticket-phone__prefix">+254</span>
          <input className="ticket-phone__input" type="tel" placeholder="7XX XXX XXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
            maxLength={9} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {paid ? (
          <motion.div key="paid" className="booking-confirm booking-confirm--stopover"
            initial={{ opacity:0, scale:0.88 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
          >
            <Zap size={20} aria-hidden="true" /> Payment initiated via M-Pesa!
          </motion.div>
        ) : (
          <motion.button key="pay"
            className={`book-btn book-btn--stopover${loading ? ' book-btn--loading' : ''}`}
            onClick={handlePay} disabled={loading || !phone} whileTap={{ scale:0.96 }}
          >
            {loading
              ? <><span className="spinner" aria-hidden="true" /> Processing…</>
              : <><Zap size={15} aria-hidden="true" /> Pay via M-Pesa</>
            }
          </motion.button>
        )}
      </AnimatePresence>

      <p className="booking-panel__note">
        <Shield size={11} aria-hidden="true" /> M-Pesa STK push · Secure & instant
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT DETAIL — main page
// ─────────────────────────────────────────────────────────────────────────────
const ProductDetail = () => {
  const { id }     = useParams();
  const location   = useLocation();
  const navigate   = useNavigate();
  const { activeBranch, toggleBranch } = useBusinessContext();

  const item = location?.state?.item ?? null;

  useEffect(() => {
    if (!item?.branch) return;
    if (item.branch !== activeBranch) toggleBranch(item.branch);
  }, [item?.branch]); // eslint-disable-line

  // ── TASK 3 FIX: guard against null item (page refresh / direct URL) ───────
  if (!item) return <LoadingScreen />;

  const branch      = item.branch ?? activeBranch ?? 'empire';
  const isPlaza     = branch === 'plaza';
  const accentClass = `accent--${branch}`;
  const gradient    = HERO_GRADIENT[branch] ?? HERO_GRADIENT.empire;
  const amenities   = item?.rawData?.amenities ?? [];

  const heroStyle = item.image
    ? { backgroundImage:`url(${item.image}), ${gradient}`, backgroundSize:'cover', backgroundPosition:'center' }
    : { background: gradient };

  return (
    <motion.div
      className={`pd pd--${branch}`}
      layoutId={`card-${item.id}`}
      initial={{ opacity:0, scale:0.96 }}
      animate={{ opacity:1, scale:1 }}
      exit={{ opacity:0, scale:0.94 }}
      transition={{ duration:0.38, ease:[0.4,0,0.2,1] }}
    >
      {/* HERO */}
      <div className="pd-hero" style={heroStyle} role="img" aria-label={item.title}>
        <div className="pd-hero__overlay" />
        <div className="pd-hero__noise"   aria-hidden="true" />

        <button className="pd-back" onClick={() => navigate(-1)} aria-label="Back to catalogue">
          <ArrowLeft size={18} aria-hidden="true" /> <span>Back</span>
        </button>

        <div className="pd-hero__branch">
          <span className={`pd-branch-tag pd-branch-tag--${branch}`}>
            {isPlaza ? '🏨 Plaza' : '⛽ Stopover'}
          </span>
        </div>

        <div className="pd-hero__content">
          <p className={`pd-hero__emoji gradient-text ${accentClass}`}>{item.icon}</p>
          <h1 className="pd-hero__title">{item.title}</h1>
          {item.meta && (
            <p className="pd-hero__meta"><MapPin size={13} aria-hidden="true" /> {item.meta}</p>
          )}
        </div>
      </div>

      {/* BODY */}
      <div className="pd-body">
        <div className="pd-body__main">

          <motion.section className="pd-section"
            initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.12 }}
          >
            <h2 className={`pd-section__heading gradient-text ${accentClass}`}>About</h2>
            <p className="pd-desc">{item.description}</p>
          </motion.section>

          {amenities.length > 0 && (
            <motion.section className="pd-section"
              initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.18 }}
            >
              <h2 className={`pd-section__heading gradient-text ${accentClass}`}>
                {isPlaza ? 'Room Features' : "What's Included"}
              </h2>
              <ul className="pd-amenities" aria-label="Amenities">
                {amenities.map((a, i) => (
                  <motion.li key={i} className="pd-amenity"
                    initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay:0.2 + i * 0.04 }}
                  >
                    <span className="pd-amenity__icon" aria-hidden="true">{amenityIcon(a)}</span>
                    <span>{a}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.section>
          )}

          {item.tags?.length > 0 && (
            <motion.section className="pd-section"
              initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.24 }}
            >
              <h2 className={`pd-section__heading gradient-text ${accentClass}`}>Highlights</h2>
              <ul className="pd-tags" aria-label="Highlights">
                {item.tags.map((t, i) => (
                  <li key={i} className="pd-tag">
                    <ChevronRight size={12} aria-hidden="true" /> {t}
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          {isPlaza && item?.rawData?.capacity && (
            <motion.div className="pd-quick-facts"
              initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
            >
              <div className="pd-fact"><Users  size={16} aria-hidden="true" /><span>Up to {item.rawData.capacity} guests</span></div>
              <div className="pd-fact"><Star   size={16} aria-hidden="true" /><span>5-Star Rated</span></div>
              <div className="pd-fact"><Wifi   size={16} aria-hidden="true" /><span>Free WiFi</span></div>
              <div className="pd-fact"><Coffee size={16} aria-hidden="true" /><span>Daily Breakfast</span></div>
            </motion.div>
          )}

          {!isPlaza && (item?.rawData?.suitable_for || item?.rawData?.duration_minutes || item?.rawData?.prep_time_minutes) && (
            <motion.div className="pd-quick-facts"
              initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
            >
              {item?.rawData?.suitable_for && (
                <div className="pd-fact"><CheckCircle size={16} aria-hidden="true" /><span>{item.rawData.suitable_for}</span></div>
              )}
              {item?.rawData?.duration_minutes && (
                <div className="pd-fact"><Clock size={16} aria-hidden="true" /><span>~{item.rawData.duration_minutes} min duration</span></div>
              )}
              {item?.rawData?.prep_time_minutes && (
                <div className="pd-fact"><Clock size={16} aria-hidden="true" /><span>Ready in ~{item.rawData.prep_time_minutes} min</span></div>
              )}
            </motion.div>
          )}

        </div>

        <motion.aside className="pd-sidebar"
          initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}
          transition={{ delay:0.16, ease:[0.4,0,0.2,1] }}
        >
          {isPlaza
            ? <PlazaBookingPanel   item={item} />
            : <StopoverTicketPanel item={item} />
          }
        </motion.aside>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
