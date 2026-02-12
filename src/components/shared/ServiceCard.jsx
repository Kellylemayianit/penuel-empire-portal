import React, { useState, useMemo } from 'react';
import { useBusinessContext } from '../../context/BusinessContext';
import {
  Wifi,
  Wind,
  Tv,
  Utensils,
  Clock,
  DollarSign,
  MapPin,
  Star,
  CheckCircle,
  AlertCircle,
  Users,
  Zap,
  Package,
  Wrench,
} from 'lucide-react';
import './ServiceCard.css';

/**
 * ServiceCard Component
 * Versatile card component for displaying:
 * - Hotel Rooms (with rate_nightly)
 * - Retail Items (with price)
 * - Services (with price and duration)
 * - Experiences (with price_per_person)
 *
 * Features:
 * - Dynamic type detection based on item properties
 * - Conditional rendering with Lucide icons
 * - Interactive hover states
 * - 'Request Service' button with console logging
 * - Theme-aware styling
 * - Bootstrap 5 compatible
 *
 * @param {Object} props
 * @param {Object} props.item - Data object containing item details
 * @param {string} [props.item.id] - Unique identifier
 * @param {string} [props.item.type] - Room type (for rooms)
 * @param {string} [props.item.name] - Item/Service name
 * @param {string} [props.item.dish] - Dish name (for dining)
 * @param {string} [props.item.product] - Product name (for retail)
 * @param {string} [props.item.service] - Service name
 * @param {number} [props.item.rate_nightly] - Nightly rate (hotel)
 * @param {number} [props.item.price] - Item/Service price
 * @param {number} [props.item.price_per_person] - Per-person price (experiences)
 * @param {number} [props.item.capacity] - Room capacity
 * @param {number} [props.item.stock] - Inventory stock
 * @param {number} [props.item.duration_minutes] - Service duration
 * @param {number} [props.item.prep_time_minutes] - Preparation time
 * @param {Array} [props.item.amenities] - List of amenities (rooms)
 * @param {Array} [props.item.features] - List of features
 * @param {string} [props.item.description] - Item description
 * @param {boolean} [props.item.availability] - Stock/availability status
 * @param {string} [props.variant] - Card style variant ('default', 'premium', 'compact')
 * @param {Function} [props.onRequestService] - Callback for request button click
 * @param {string} [props.className] - Additional CSS classes
 */
const ServiceCard = ({
  item,
  variant = 'default',
  onRequestService,
  className = '',
}) => {
  const { getActiveBranchTheme } = useBusinessContext();
  const theme = getActiveBranchTheme();
  const [isHovered, setIsHovered] = useState(false);

  // Determine item type based on properties
  const itemType = useMemo(() => {
    if (item.rate_nightly) return 'room';
    if (item.dish) return 'dining';
    if (item.product) return 'retail';
    if (item.service) return 'service';
    if (item.duration_minutes && item.price) return 'experience';
    if (item.prep_time_minutes) return 'menu-item';
    return 'generic';
  }, [item]);

  // Get price/rate based on type
  const getPrice = () => {
    if (item.rate_nightly) return item.rate_nightly;
    if (item.price_per_person) return item.price_per_person;
    return item.price || 0;
  };

  // Get price label based on type
  const getPriceLabel = () => {
    if (item.rate_nightly) return '/night';
    if (item.price_per_person) return 'pp';
    return '';
  };

  // Get main title based on item type
  const getTitle = () => {
    return item.type || item.name || item.dish || item.product || item.service || 'Item';
  };

  // Get amenities/features to display
  const getFeaturesToDisplay = () => {
    const features = item.amenities || item.features || [];
    return features.slice(0, 3); // Show max 3 features
  };

  // Map amenity/feature names to Lucide icons
  const getFeatureIcon = (feature) => {
    const featureLower = feature.toLowerCase();

    if (featureLower.includes('wifi')) return <Wifi size={16} />;
    if (featureLower.includes('air') || featureLower.includes('ac'))
      return <Wind size={16} />;
    if (featureLower.includes('tv') || featureLower.includes('smart'))
      return <Tv size={16} />;
    if (featureLower.includes('bar') || featureLower.includes('kitchen'))
      return <Utensils size={16} />;
    if (featureLower.includes('housekeeping') || featureLower.includes('service'))
      return <CheckCircle size={16} />;
    if (featureLower.includes('power') || featureLower.includes('electric'))
      return <Zap size={16} />;
    if (featureLower.includes('parking') || featureLower.includes('storage'))
      return <Package size={16} />;
    if (featureLower.includes('maintenance') || featureLower.includes('repair'))
      return <Tool size={16} />;

    return <Star size={16} />; // Default icon
  };

  // Handle request service button click
  const handleRequestService = () => {
    const logData = {
      itemId: item.id,
      itemType,
      itemName: getTitle(),
      price: getPrice(),
      timestamp: new Date().toISOString(),
    };

    console.log('🔔 Service Request Logged:', logData);
    console.table(logData);

    // Call optional callback
    if (onRequestService && typeof onRequestService === 'function') {
      onRequestService(item);
    }
  };

  // Render room-specific card
  const renderRoomCard = () => (
    <div className={`service-card room-card ${variant} ${isHovered ? 'hovered' : ''} ${className}`}>
      <div className="card-header room-header">
        <div className="header-content">
          <h5 className="card-title">{getTitle()}</h5>
          <span className="capacity-badge">
            <Users size={14} /> {item.capacity} Guests
          </span>
        </div>
      </div>

      <div className="card-body">
        {item.description && (
          <p className="card-description">{item.description}</p>
        )}

        {getFeaturesToDisplay().length > 0 && (
          <div className="amenities-section">
            <h6 className="section-title">Amenities</h6>
            <div className="amenities-grid">
              {getFeaturesToDisplay().map((amenity, idx) => (
                <div key={idx} className="amenity-item">
                  <span className="amenity-icon">
                    {getFeatureIcon(amenity)}
                  </span>
                  <span className="amenity-text">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card-footer room-footer">
        <div className="price-section">
          <span className="price-label">Rate</span>
          <div className="price-display">
            <span className="currency">$</span>
            <span className="amount">{getPrice()}</span>
            <span className="period">{getPriceLabel()}</span>
          </div>
        </div>
        <button
          className="btn-request-service"
          onClick={handleRequestService}
          aria-label={`Request ${getTitle()} room`}
        >
          Book Now
        </button>
      </div>
    </div>
  );

  // Render service/experience card
  const renderServiceCard = () => (
    <div className={`service-card service-type ${variant} ${isHovered ? 'hovered' : ''} ${className}`}>
      <div className="card-header service-header">
        <div className="header-content">
          <h5 className="card-title">{getTitle()}</h5>
          {item.duration_minutes && (
            <span className="duration-badge">
              <Clock size={14} /> {item.duration_minutes}m
            </span>
          )}
          {item.prep_time_minutes && (
            <span className="duration-badge">
              <Clock size={14} /> {item.prep_time_minutes}m
            </span>
          )}
        </div>
      </div>

      <div className="card-body">
        {item.description && (
          <p className="card-description">{item.description}</p>
        )}

        {item.group_size && (
          <div className="meta-info">
            <span className="meta-label">Group Size:</span>
            <span className="meta-value">{item.group_size}</span>
          </div>
        )}

        {item.suitable_for && (
          <div className="meta-info">
            <span className="meta-label">Suitable For:</span>
            <span className="meta-value">{item.suitable_for}</span>
          </div>
        )}
      </div>

      <div className="card-footer service-footer">
        <div className="price-section">
          <span className="price-label">
            {item.price_per_person ? 'Per Person' : 'Price'}
          </span>
          <div className="price-display">
            <span className="currency">
              {item.price_per_person ? '$' : 'KES'}
            </span>
            <span className="amount">{getPrice()}</span>
            <span className="period">{getPriceLabel()}</span>
          </div>
        </div>
        <button
          className="btn-request-service"
          onClick={handleRequestService}
          aria-label={`Request ${getTitle()} service`}
        >
          Request Service
        </button>
      </div>
    </div>
  );

  // Render retail/product card
  const renderRetailCard = () => (
    <div className={`service-card retail-card ${variant} ${isHovered ? 'hovered' : ''} ${className}`}>
      <div className="card-header retail-header">
        <div className="header-content">
          <h5 className="card-title">{getTitle()}</h5>
          {item.stock !== undefined && (
            <span className={`stock-badge ${item.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {item.stock > 0 ? (
                <>
                  <CheckCircle size={14} /> {item.stock} in stock
                </>
              ) : (
                <>
                  <AlertCircle size={14} /> Out of stock
                </>
              )}
            </span>
          )}
        </div>
      </div>

      <div className="card-body">
        {item.description && (
          <p className="card-description">{item.description}</p>
        )}
      </div>

      <div className="card-footer retail-footer">
        <div className="price-section">
          <span className="price-label">Price</span>
          <div className="price-display">
            <span className="currency">KES</span>
            <span className="amount">{getPrice()}</span>
          </div>
        </div>
        <button
          className="btn-request-service"
          onClick={handleRequestService}
          disabled={item.stock === 0}
          aria-label={`Request ${getTitle()} item`}
        >
          {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );

  // Render dining/menu card
  const renderDiningCard = () => (
    <div className={`service-card dining-card ${variant} ${isHovered ? 'hovered' : ''} ${className}`}>
      <div className="card-header dining-header">
        <div className="header-content">
          <h5 className="card-title">{getTitle()}</h5>
          {item.prep_time_minutes && (
            <span className="prep-badge">
              <Clock size={14} /> {item.prep_time_minutes} min
            </span>
          )}
        </div>
      </div>

      <div className="card-body">
        {item.description && (
          <p className="card-description">{item.description}</p>
        )}

        {item.availability !== undefined && (
          <div className="availability">
            {item.availability ? (
              <span className="available">
                <CheckCircle size={14} /> Available
              </span>
            ) : (
              <span className="unavailable">
                <AlertCircle size={14} /> Not available
              </span>
            )}
          </div>
        )}
      </div>

      <div className="card-footer dining-footer">
        <div className="price-section">
          <span className="price-label">Price</span>
          <div className="price-display">
            <span className="currency">KES</span>
            <span className="amount">{getPrice()}</span>
          </div>
        </div>
        <button
          className="btn-request-service"
          onClick={handleRequestService}
          disabled={!item.availability}
          aria-label={`Order ${getTitle()}`}
        >
          {item.availability !== false ? 'Order Now' : 'Not Available'}
        </button>
      </div>
    </div>
  );

  // Choose render function based on type
  const renderCard = () => {
    switch (itemType) {
      case 'room':
        return renderRoomCard();
      case 'service':
      case 'experience':
        return renderServiceCard();
      case 'retail':
        return renderRetailCard();
      case 'dining':
      case 'menu-item':
        return renderDiningCard();
      default:
        return renderServiceCard();
    }
  };

  return (
    <div
      className="service-card-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {renderCard()}
    </div>
  );
};

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;
