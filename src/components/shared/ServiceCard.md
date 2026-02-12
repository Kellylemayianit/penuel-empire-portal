# ServiceCard Component Documentation

## Overview

`ServiceCard` is a versatile, production-grade React component that intelligently displays different types of business items: hotel rooms, retail products, automotive services, dining menu items, and experiences.

**Key Features:**
- 🎯 Smart type detection based on data properties
- 🎨 Theme-aware styling with dynamic colors
- 📱 Fully responsive design
- ♿ Accessibility-first implementation
- 🚀 Performance optimized with memoization
- 🎭 Multiple visual variants (default, premium, compact)
- 🎪 Lucide icon integration for features
- 💬 Intelligent console logging with service requests

---

## Installation

1. Place `ServiceCard.js` in `src/components/shared/`
2. Place `ServiceCard.css` in `src/components/shared/`
3. Ensure Lucide-React is installed: `npm install lucide-react`

---

## Basic Usage

```jsx
import ServiceCard from '@/components/shared/ServiceCard';

function MyComponent() {
  const item = {
    id: 'room_001',
    type: 'Safari View Standard',
    rate_nightly: 120,
    capacity: 2,
    amenities: ['WiFi', 'Air conditioning', 'Ensuite bathroom'],
    description: 'Comfortable entry-level accommodation'
  };

  return (
    <ServiceCard 
      item={item}
      onRequestService={(item) => console.log('Booked:', item)}
    />
  );
}
```

---

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `item` | `Object` | The data object to display. See [Item Structure](#item-structure) below. |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'premium' \| 'compact'` | `'default'` | Visual style variant |
| `onRequestService` | `Function` | `undefined` | Callback when button is clicked |
| `className` | `String` | `''` | Additional CSS classes |

---

## Item Structure

The `item` object is flexible and adapts based on available properties:

### Hotel Room Item
```javascript
{
  id: 'room_001',
  type: 'Elephant Suite Luxury',
  rate_nightly: 200,        // Triggers 'room' type detection
  capacity: 4,
  amenities: ['WiFi', 'Air conditioning', 'TV', 'Mini bar'],
  description: 'Premium suite with exclusive amenities'
}
```

### Service/Experience Item
```javascript
{
  id: 'exp_001',
  name: 'Sunrise Safari Game Drive',
  price_per_person: 85,
  duration_minutes: 180,     // Triggers 'experience' type
  group_size: '1-6 persons',
  description: 'Guided tour with professional wildlife guides'
}
```

### Retail Item
```javascript
{
  id: 'item_001',
  product: 'Water (500ml)',
  price: 50,                 // Triggers 'retail' type
  stock: 250,
  description: 'Pure drinking water'
}
```

### Automotive Service
```javascript
{
  id: 'svc_003',
  service: 'Oil & Filter Change',
  price: 1500,
  duration_minutes: 30,      // Triggers 'service' type
  suitable_for: 'All vehicles',
  description: 'Complete oil and filter replacement'
}
```

### Dining/Menu Item
```javascript
{
  id: 'menu_item_001',
  dish: 'Grilled Chicken with Chapati',
  price: 380,
  prep_time_minutes: 20,     // Triggers 'menu-item' type
  availability: true,
  description: 'Perfectly grilled with fresh vegetables'
}
```

---

## Type Detection Logic

The component automatically detects the item type:

```
rate_nightly?  → 'room'
dish?          → 'dining'
product?       → 'retail'
service?       → 'service'
duration_minutes && price? → 'experience'
prep_time_minutes? → 'menu-item'
else           → 'generic' (falls back to service rendering)
```

---

## Conditional Rendering

### Room Cards Display:
- Room type and capacity badge
- Description
- Amenities with icons (max 3)
- Nightly rate with "$" currency
- "Book Now" button

### Service/Experience Cards Display:
- Service/experience name
- Duration badge with clock icon
- Description
- Group size or suitable-for information
- Price (with per-person indicator if applicable)
- "Request Service" button

### Retail Cards Display:
- Product name
- Stock status badge (in-stock/out-of-stock)
- Description
- KES price
- "Add to Cart" button (disabled if out of stock)

### Dining Cards Display:
- Dish name
- Prep time badge
- Description
- Availability status
- KES price
- "Order Now" button (disabled if unavailable)

---

## Lucide Icons Used

The component automatically maps amenity/feature names to icons:

| Feature Name (partial match) | Icon |
|-----|------|
| wifi | Wifi |
| air, ac | Wind |
| tv, smart | Tv |
| bar, kitchen | Utensils |
| housekeeping, service | CheckCircle |
| power, electric | Zap |
| parking, storage | Package |
| maintenance, repair | Tool |
| (default) | Star |

**Custom icon mapping example:**
```javascript
// In amenity lists:
amenities: [
  'WiFi',           // → Wifi icon
  'Air conditioning', // → Wind icon
  'Smart TV',       // → Tv icon
  'Mini bar'        // → Utensils icon
]
```

---

## Variants

### `variant="default"`
Standard card with balanced styling. Best for normal layouts.

```jsx
<ServiceCard item={item} variant="default" />
```

### `variant="premium"`
Highlighted card with gold border, gradient header, and star badge. Perfect for featured/flagship items.

```jsx
<ServiceCard item={item} variant="premium" />
```

### `variant="compact"`
Condensed version with no shadow, minimal padding. Ideal for sidebars and tight spaces.

```jsx
<ServiceCard item={item} variant="compact" />
```

---

## Callbacks

### `onRequestService(item)`

Triggered when the action button is clicked (Book Now, Order Now, Add to Cart, etc.)

```jsx
<ServiceCard 
  item={room}
  onRequestService={(item) => {
    // Handle the request
    console.log('User requested:', item);
    
    // Open booking modal
    // Add to cart
    // Process payment
    // etc.
  }}
/>
```

The component also automatically logs to console:
```
🔔 Service Request Logged: {itemId, itemType, itemName, price, timestamp}
```

---

## Styling & Theming

### CSS Variables (Auto-Applied)

The component uses CSS custom properties that respect your `BusinessContext` theme:

```css
--primary-color: #8b4513      /* Accent color */
--accent-color: #e8dcc4       /* Light accent */
--secondary-color: #d4af37    /* Secondary color */
--dark-color: #2c2416         /* Text color */
--success-color: #2d5016      /* Success indicator */
--warning-color: #c9302c      /* Warning/error color */
--light-color: #f5f5dc        /* Light background */
--font-family: 'Playfair Display', serif  /* Display font */
```

### Custom Styling

Add additional classes via the `className` prop:

```jsx
<ServiceCard 
  item={item}
  className="custom-spacing featured-card"
/>
```

Override in your CSS:
```css
.service-card.custom-spacing {
  margin: 2rem;
}

.service-card.featured-card {
  border: 2px solid gold;
}
```

---

## Responsive Behavior

| Breakpoint | Changes |
|-----------|---------|
| **Desktop** (> 768px) | Full layout with 3-column amenities |
| **Tablet** (480px - 768px) | 2-column amenities, flexible footer |
| **Mobile** (< 480px) | Stacked layout, full-width button |

The component automatically adapts. Use Bootstrap grid for the wrapper:

```jsx
<div className="row">
  <div className="col-lg-4 col-md-6 col-sm-12">
    <ServiceCard item={item1} />
  </div>
  <div className="col-lg-4 col-md-6 col-sm-12">
    <ServiceCard item={item2} />
  </div>
</div>
```

---

## Accessibility

✅ WCAG 2.1 Level AA compliant

- Semantic HTML structure
- ARIA labels on buttons
- Focus states for keyboard navigation
- Color contrast ratios > 4.5:1
- Reduced motion support via `prefers-reduced-motion`
- Screen reader friendly

---

## Performance

- **Memoization**: `useMemo` for expensive calculations
- **Shallow comparisons**: Props optimized for re-render prevention
- **Event delegation**: Efficient click handling
- **CSS-only animations**: No JavaScript animation overhead

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Complete Example: Room Grid

```jsx
import ServiceCard from '@/components/shared/ServiceCard';
import { useBusinessContext } from '@/context/BusinessContext';

export function RoomGallery() {
  const { plazaData } = useBusinessContext();

  return (
    <section className="rooms-gallery">
      <h1>Our Rooms</h1>
      <div className="row">
        {plazaData.rooms.map((room) => (
          <div key={room.id} className="col-lg-4 col-md-6 mb-4">
            <ServiceCard
              item={room}
              variant={room.rate_nightly === 200 ? 'premium' : 'default'}
              onRequestService={(room) => {
                handleBooking(room);
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
```

---

## Console Output Example

When a user clicks the request button:

```
🔔 Service Request Logged: {
  itemId: "room_003",
  itemType: "room",
  itemName: "Elephant Suite Luxury",
  price: 200,
  timestamp: "2025-02-05T10:30:45.123Z"
}
```

---

## Troubleshooting

### Card not displaying the correct type
- Verify the item has the required property (e.g., `rate_nightly` for rooms)
- Check the property spelling exactly

### Icons not showing
- Ensure lucide-react is installed: `npm install lucide-react`
- Check the feature name matches partial matches in `getFeatureIcon()`

### Styling not applying
- Verify `ServiceCard.css` is imported
- Check CSS variable values in your theme
- Ensure no conflicting Bootstrap classes

### Button callback not firing
- Verify `onRequestService` is a function
- Check browser console for errors
- Confirm button is not disabled (for out-of-stock items)

---

## Future Enhancements (Milestone 2+)

- [ ] Image carousel for items
- [ ] Rating/review display
- [ ] Quick add-to-cart animations
- [ ] Quantity selector
- [ ] Wishlist/favorites
- [ ] Real-time inventory updates
- [ ] Multi-currency support
- [ ] Quick preview modal
- [ ] Social sharing buttons
- [ ] Compare functionality

---

## License

MIT - Part of Penuel Empire Portal

---

## Support

For issues or questions, please refer to the component's JSDoc comments or the examples file.
