# Google Analytics 4 and Google Tag Manager Setup

## Overview

This project includes Google Analytics 4 (GA4) and Google Tag Manager (GTM) integration. The implementation includes:

- Automatic page view tracking
- Event tracking utilities
- E-commerce tracking functions
- Consent management

## Configuration

### Updating Tracking IDs

To use your own tracking IDs:

1. Open `app/root.tsx`
2. Replace `G-XXXXXXXXXX` with your GA4 Measurement ID
3. Replace `GTM-XXXXXXX` with your Google Tag Manager Container ID

```tsx
// In app/root.tsx
// Update these lines:
j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX'); // Replace GTM-XXXXXXX

// And:
gtag('config', 'G-XXXXXXXXXX', {  // Replace G-XXXXXXXXXX
  page_path: window.location.pathname,
  send_page_view: false
});
```

## Usage

### Using the Hook

To track events in your components, use the `useGoogleAnalytics` hook:

```tsx
import { useGoogleAnalytics } from '~/utils/use-google-analytics';

const MyComponent = () => {
  const { trackEvent, trackCustomEvent } = useGoogleAnalytics();
  
  const handleClick = () => {
    trackEvent('button_click', 'engagement', 'my_button');
  };
  
  return (
    <button onClick={handleClick}>Click me</button>
  );
};
```

### Available Tracking Functions

The implementation includes these tracking functions:

- `trackEvent(action, category, label, value)` - Track standard events
- `trackCustomEvent(eventName, params)` - Track custom events
- `trackPurchase(transactionId, value, currency, params)` - Track purchases
- `trackAddToCart(itemId, itemName, value, params)` - Track add-to-cart events
- `updateConsent(consentSettings)` - Update consent settings
- `disableTracking()` - Disable tracking completely

## Component Demo

A demo component has been created at `app/components/AnalyticsDemo.tsx` to demonstrate usage of the analytics functions.

## Testing

To verify that analytics is working:

1. Build and run your application
2. Open browser developer tools
3. Check the Network tab for requests to Google Analytics
4. Watch the Console tab for tracking events
5. Use Google Analytics Real-Time reports to see active users