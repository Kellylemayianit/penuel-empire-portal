/**
 * Penuel Empire Portal - Main App Component (Milestone 1)
 * Demonstrates:
 * - Business context integration with global state management
 * - Dynamic theme switching with CSS variables
 * - Branch-specific UI rendering (Plaza/Stopover)
 * - React 18 hooks and functional components
 * - ServiceCard component integration with data mapping
 * - Toast notification system from context
 * - Active tab visual feedback
 */

import React, { useEffect } from "react";
import { useBusinessContext } from "./context/BusinessContext";
import ServiceCard from "./components/shared/ServiceCard";
import "./styles/App.css";

function App() {
  const {
    activeBranch,
    toggleBranch,
    getActiveBranchTheme,
    getBranchInfo,
    toast,
    showNotification,
    plazaData,
    stopoverData
  } = useBusinessContext();

  // Get current theme and branch info
  const theme = getActiveBranchTheme();
  const branchInfo = getBranchInfo();

  // Apply theme CSS variables to document root when branch changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary-color", theme.primary);
    root.style.setProperty("--secondary-color", theme.secondary);
    root.style.setProperty("--accent-color", theme.accent);
    root.style.setProperty("--dark-color", theme.dark);
    root.style.setProperty("--success-color", theme.success);
    root.style.setProperty("--warning-color", theme.warning);
    root.style.setProperty("--light-color", theme.light);
    root.style.setProperty("--font-family", theme.fontFamily);
  }, [theme]);

  // Handle branch switch
  const handleSwitchBranch = () => {
    const newBranch = activeBranch === "plaza" ? "stopover" : "plaza";
    toggleBranch(newBranch);
    showNotification(`✅ Switched to ${newBranch === "plaza" ? "🏨 Penuel Plaza" : "🛑 Penuel Stopover"}`, "success");
  };

  // Handle service request with notification from context
  const handleServiceRequest = (item, type, branch) => {
    const itemName = item.type || item.name || item.dish || item.product || item.service;

    // Log to console for debugging
    console.log(`${branch === "plaza" ? "📍" : "🛑"} ${branch.toUpperCase()} ${type} Request:`, {
      itemId: item.id,
      itemType: type,
      name: itemName,
      price: item.rate_nightly || item.price_per_person || item.price,
      timestamp: new Date().toISOString()
    });

    // Show toast notification via context (Milestone 1)
    showNotification(`✅ ${type} request sent successfully!`, "success");
  };

  return (
    <div className="app-wrapper">
      {/* Toast Notification (from Context - Milestone 1) */}
      {toast.visible && <div className={`toast-notification toast-${toast.type}`}>{toast.message}</div>}

      {/* Header */}
      <header className="app-header">
        <div className="container-fluid">
          <div className="header-content">
            <div className="logo-section">
              <h1 className="app-title">Penuel Empire Portal</h1>
              <p className="app-subtitle">Hub-and-Spoke Management System</p>
            </div>
            <button
              className={`btn-switch-branch ${activeBranch === "plaza" ? "btn-active" : ""}`}
              onClick={handleSwitchBranch}
              aria-label={`Switch to ${activeBranch === "plaza" ? "Stopover" : "Plaza"}`}>
              {activeBranch === "plaza" ? "🏨 Plaza" : "🛑 Stopover"}
              <span className="btn-indicator">●</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="container-fluid">
          {/* Active Branch Card */}
          <section className="branch-display">
            <div className="branch-card">
              <div className="branch-header">
                <h2 className="branch-name">{branchInfo.branch}</h2>
                <span className="branch-badge">{branchInfo.type}</span>
              </div>

              <div className="branch-details">
                <div className="detail-item">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{branchInfo.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Currency:</span>
                  <span className="detail-value">{branchInfo.currency}</span>
                </div>
              </div>

              <div className="branch-stats">
                {activeBranch === "plaza" ? (
                  <div className="stats-grid">
                    <div className="stat-box">
                      <span className="stat-number">{plazaData.rooms?.length || 0}</span>
                      <span className="stat-label">Room Types</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-number">{plazaData.experiences?.length || 0}</span>
                      <span className="stat-label">Experiences</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-number">{plazaData.dining?.length || 0}</span>
                      <span className="stat-label">Dining Venues</span>
                    </div>
                  </div>
                ) : (
                  <div className="stats-grid">
                    <div className="stat-box">
                      <span className="stat-number">{Object.keys(stopoverData.units || {}).length}</span>
                      <span className="stat-label">Service Units</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-number">{stopoverData.units?.automotive?.services?.length || 0}</span>
                      <span className="stat-label">Auto Services</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-number">{stopoverData.units?.dining?.menu_categories?.length || 0}</span>
                      <span className="stat-label">Menu Categories</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Branch-Specific Content */}
          <section className="branch-content">
            {activeBranch === "plaza" ? (
              <PlazaPreview data={plazaData} onServiceRequest={handleServiceRequest} />
            ) : (
              <StopoverPreview data={stopoverData} onServiceRequest={handleServiceRequest} />
            )}
          </section>

          {/* Development Info */}
          <section className="dev-info">
            <div className="info-card">
              <h3>🔧 Development Info</h3>
              <p>
                <strong>Active Branch:</strong> <code>{activeBranch}</code>
              </p>
              <p>
                <strong>Theme Colors:</strong>
              </p>
              <div className="color-palette">
                <div className="color-swatch">
                  <div className="swatch" style={{ backgroundColor: theme.primary }}></div>
                  <span>Primary</span>
                </div>
                <div className="color-swatch">
                  <div className="swatch" style={{ backgroundColor: theme.secondary }}></div>
                  <span>Secondary</span>
                </div>
                <div className="color-swatch">
                  <div className="swatch" style={{ backgroundColor: theme.accent }}></div>
                  <span>Accent</span>
                </div>
                <div className="color-swatch">
                  <div className="swatch" style={{ backgroundColor: theme.success }}></div>
                  <span>Success</span>
                </div>
              </div>
              <p>
                <strong>Font Family:</strong> <code>{theme.fontFamily}</code>
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container-fluid">
          <p>&copy; 2025 Penuel Empire. All rights reserved. | Version 1.0.0 | Milestone 1 Complete ✅</p>
        </div>
      </footer>
    </div>
  );
}

/**
 * PlazaPreview Component
 * Displays rooms, experiences, and dining from Plaza using ServiceCard grid
 */
function PlazaPreview({ data, onServiceRequest }) {
  return (
    <div className="preview-container">
      {/* Rooms Section */}
      {data.rooms && data.rooms.length > 0 && (
        <section className="plaza-section">
          <h3 className="section-heading">🏨 Our Rooms</h3>
          <div className="row g-4">
            {data.rooms.map((room) => (
              <div key={room.id} className="col-lg-4 col-md-6 col-sm-12">
                <ServiceCard
                  item={room}
                  variant={room.rate_nightly === 200 ? "premium" : "default"}
                  onRequestService={(item) => onServiceRequest(item, "Room Booking", "plaza")}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experiences Section */}
      {data.experiences && data.experiences.length > 0 && (
        <section className="plaza-section">
          <h3 className="section-heading">✨ Amboseli Experiences</h3>
          <div className="row g-4">
            {data.experiences.map((exp) => (
              <div key={exp.id} className="col-lg-4 col-md-6 col-sm-12">
                <ServiceCard
                  item={exp}
                  variant="default"
                  onRequestService={(item) => onServiceRequest(item, "Experience Booking", "plaza")}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Dining Section */}
      {data.dining && data.dining.length > 0 && (
        <section className="plaza-section">
          <h3 className="section-heading">🍽️ Dining & Culinary</h3>
          <div className="row g-4">
            {data.dining.map((venue) => (
              <div key={venue.id} className="col-lg-4 col-md-6 col-sm-12">
                <ServiceCard
                  item={{
                    ...venue,
                    price: venue.average_meal_price || 0,
                    description: `${venue.cuisine} Cuisine | ${venue.service_hours}`
                  }}
                  variant="default"
                  onRequestService={(item) => onServiceRequest(item, "Dining Reservation", "plaza")}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/**
 * StopoverPreview Component
 * Displays retail items, dining menu, and auto services using ServiceCard grid
 */
function StopoverPreview({ data, onServiceRequest }) {
  return (
    <div className="preview-container">
      {/* Retail Section */}
      {data.units?.retail?.categories && data.units.retail.categories.length > 0 && (
        <section className="stopover-section">
          <h3 className="section-heading">🛍️ Express Shop</h3>
          {data.units.retail.categories.map((category) => (
            <div key={category.category_id} className="category-block">
              <h4 className="category-title">{category.name}</h4>
              <div className="row g-4">
                {category.items?.map((item) => (
                  <div key={item.id} className="col-lg-3 col-md-4 col-sm-6">
                    <ServiceCard
                      item={item}
                      variant="default"
                      onRequestService={(item) => onServiceRequest(item, "Retail Purchase", "stopover")}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Dining Section */}
      {data.units?.dining?.menu_categories && data.units.dining.menu_categories.length > 0 && (
        <section className="stopover-section">
          <h3 className="section-heading">🔔 Food & Refreshments</h3>
          {data.units.dining.menu_categories.map((category) => (
            <div key={category.category_id} className="category-block">
              <h4 className="category-title">{category.name}</h4>
              <div className="row g-4">
                {category.items?.map((item) => (
                  <div key={item.id} className="col-lg-4 col-md-6 col-sm-12">
                    <ServiceCard
                      item={item}
                      variant="default"
                      onRequestService={(item) => onServiceRequest(item, "Food Order", "stopover")}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Automotive Services Section */}
      {data.units?.automotive?.services && data.units.automotive.services.length > 0 && (
        <section className="stopover-section">
          <h3 className="section-heading">🚗 Executive Wash & Service Bay</h3>
          <div className="row g-4">
            {data.units.automotive.services.map((service) => (
              <div key={service.service_id} className="col-lg-4 col-md-6 col-sm-12">
                <ServiceCard
                  item={service}
                  variant="default"
                  onRequestService={(item) => onServiceRequest(item, "Auto Service Request", "stopover")}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
