/**
 * ServiceCard Component - Usage Examples
 * 
 * This file demonstrates how to use the ServiceCard component
 * in different scenarios (rooms, retail, services, dining)
 */

import ServiceCard from './ServiceCard';
import { useBusinessContext } from '../../context/BusinessContext';

/**
 * Example 1: Hotel Room Card
 * Using data from plaza.json
 */
export function RoomCardExample() {
  const { plazaData } = useBusinessContext();
  const room = plazaData.rooms?.[0]; // First room

  return (
    <ServiceCard
      item={room}
      variant="default"
      onRequestService={(item) => {
        console.log('Room booking requested:', item);
      }}
    />
  );
}

/**
 * Example 2: Experience Card
 * Using Amboseli experience data
 */
export function ExperienceCardExample() {
  const { plazaData } = useBusinessContext();
  const experience = plazaData.experiences?.[0]; // First experience

  return (
    <ServiceCard
      item={experience}
      variant="default"
      onRequestService={(item) => {
        console.log('Experience booking:', item);
      }}
    />
  );
}

/**
 * Example 3: Retail Item Card
 * Using stopover retail data
 */
export function RetailCardExample() {
  const { stopoverData } = useBusinessContext();
  const retailItem = stopoverData.units?.retail?.categories?.[0]?.items?.[0];

  return (
    <ServiceCard
      item={retailItem}
      variant="default"
      onRequestService={(item) => {
        console.log('Item added to cart:', item);
      }}
    />
  );
}

/**
 * Example 4: Automotive Service Card
 * Using stopover automotive data
 */
export function AutoServiceCardExample() {
  const { stopoverData } = useBusinessContext();
  const service = stopoverData.units?.automotive?.services?.[0];

  return (
    <ServiceCard
      item={service}
      variant="default"
      onRequestService={(item) => {
        console.log('Service requested:', item);
      }}
    />
  );
}

/**
 * Example 5: Dining/Menu Item Card
 * Using stopover dining data
 */
export function DiningCardExample() {
  const { stopoverData } = useBusinessContext();
  const menuItem = stopoverData.units?.dining?.menu_categories?.[0]?.items?.[0];

  return (
    <ServiceCard
      item={menuItem}
      variant="default"
      onRequestService={(item) => {
        console.log('Dish ordered:', item);
      }}
    />
  );
}

/**
 * Example 6: Grid of Room Cards
 * Display multiple rooms from Plaza
 */
export function RoomGridExample() {
  const { plazaData } = useBusinessContext();

  return (
    <div className="row">
      {plazaData.rooms?.map((room) => (
        <div key={room.id} className="col-md-4 mb-4">
          <ServiceCard
            item={room}
            variant="default"
            onRequestService={(item) => {
              console.log('Booking:', item.type);
            }}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Example 7: Premium Variant
 * Showcase a featured room
 */
export function FeaturedRoomCardExample() {
  const { plazaData } = useBusinessContext();
  const featuredRoom = plazaData.rooms?.[plazaData.rooms.length - 1]; // Last (premium) room

  return (
    <ServiceCard
      item={featuredRoom}
      variant="premium"
      className="featured-card"
      onRequestService={(item) => {
        console.log('Premium room booked:', item);
      }}
    />
  );
}

/**
 * Example 8: Compact Variant
 * For sidebar or condensed layouts
 */
export function CompactServiceCardExample() {
  const { stopoverData } = useBusinessContext();
  const service = stopoverData.units?.automotive?.services?.[2];

  return (
    <ServiceCard
      item={service}
      variant="compact"
      onRequestService={(item) => {
        console.log('Service requested:', item);
      }}
    />
  );
}

/**
 * Example 9: Retail Items Grid
 * Display all items from Express Shop
 */
export function RetailGridExample() {
  const { stopoverData } = useBusinessContext();
  const categories = stopoverData.units?.retail?.categories || [];

  return (
    <div className="retail-grid">
      {categories.map((category) => (
        <div key={category.category_id}>
          <h3>{category.name}</h3>
          <div className="row">
            {category.items?.map((item) => (
              <div key={item.id} className="col-sm-6 col-md-4 mb-4">
                <ServiceCard
                  item={item}
                  variant="default"
                  onRequestService={(item) => {
                    console.log('Added to cart:', item.product);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Example 10: Auto Services Grid
 * Display all automotive services
 */
export function AutoServicesGridExample() {
  const { stopoverData } = useBusinessContext();
  const services = stopoverData.units?.automotive?.services || [];

  return (
    <div className="services-grid">
      <h2>Our Services</h2>
      <div className="row">
        {services.map((service) => (
          <div key={service.service_id} className="col-md-4 mb-4">
            <ServiceCard
              item={service}
              variant="default"
              onRequestService={(item) => {
                console.log('Service booking initiated:', item.name);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Example 11: Menu Items Display
 * Show dining menu items with availability
 */
export function MenuItemsExample() {
  const { stopoverData } = useBusinessContext();
  const categories = stopoverData.units?.dining?.menu_categories || [];

  return (
    <div className="menu-display">
      {categories.map((category) => (
        <section key={category.category_id} className="menu-section">
          <h3>{category.name}</h3>
          <div className="row">
            {category.items?.map((item) => (
              <div key={item.id} className="col-sm-6 col-md-4 mb-4">
                <ServiceCard
                  item={item}
                  variant="default"
                  onRequestService={(item) => {
                    console.log('Order placed:', item.dish || item.drink);
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/**
 * Complete Dashboard Example
 * Shows ServiceCard in a realistic dashboard layout
 */
export function ServiceCardDashboardExample() {
  const { activeBranch, plazaData, stopoverData } = useBusinessContext();

  if (activeBranch === 'plaza') {
    return (
      <div className="dashboard">
        <section className="dashboard-section">
          <h2>Our Rooms</h2>
          <div className="row">
            {plazaData.rooms?.map((room) => (
              <div key={room.id} className="col-lg-4 col-md-6 mb-4">
                <ServiceCard
                  item={room}
                  variant="default"
                  onRequestService={(item) => {
                    // Handle booking
                    console.log('Room booking:', item);
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Experiences</h2>
          <div className="row">
            {plazaData.experiences?.map((exp) => (
              <div key={exp.id} className="col-lg-4 col-md-6 mb-4">
                <ServiceCard
                  item={exp}
                  variant="default"
                  onRequestService={(item) => {
                    console.log('Experience booking:', item);
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  } else {
    return (
      <div className="dashboard">
        <section className="dashboard-section">
          <h2>Express Shop</h2>
          <div className="row">
            {stopoverData.units?.retail?.categories?.flatMap((cat) =>
              cat.items?.map((item) => (
                <div key={item.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                  <ServiceCard
                    item={item}
                    variant="compact"
                    onRequestService={(item) => {
                      console.log('Cart updated:', item);
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Auto Services</h2>
          <div className="row">
            {stopoverData.units?.automotive?.services?.map((svc) => (
              <div key={svc.service_id} className="col-lg-4 col-md-6 mb-4">
                <ServiceCard
                  item={svc}
                  variant="default"
                  onRequestService={(item) => {
                    console.log('Service request:', item.name);
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }
}

/**
 * Usage Notes:
 * 
 * 1. IMPORT THE COMPONENT:
 *    import ServiceCard from '@/components/shared/ServiceCard';
 * 
 * 2. PASS DATA PROPS:
 *    - For hotel rooms: item with 'rate_nightly' and 'amenities'
 *    - For services: item with 'price' and 'duration_minutes'
 *    - For retail: item with 'price' and 'stock'
 *    - For dining: item with 'price' and 'availability'
 * 
 * 3. OPTIONAL PROPS:
 *    - variant: 'default' | 'premium' | 'compact'
 *    - onRequestService: callback function
 *    - className: additional CSS classes
 * 
 * 4. CONSOLE LOGGING:
 *    The component logs requests to console with:
 *    console.log('🔔 Service Request Logged:', logData);
 *    console.table(logData);
 * 
 * 5. RESPONSIVE:
 *    Component adapts to mobile/tablet/desktop automatically
 *    Use Bootstrap grid (col-md-4, col-lg-3, etc.) for wrapping
 */

export default ServiceCard;
