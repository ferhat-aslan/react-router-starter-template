// Google Analytics 4 and Google Tag Manager Utilities
// Replace 'G-XXXXXXXXXX' and 'GTM-XXXXXXX' with your actual tracking IDs

declare global {
  interface Window {
    gtag: Function;
    dataLayer: any[];
  }
}

// Check if we're in the browser environment
const isBrowser = typeof window !== 'undefined';

// Initialize Google Analytics if not already initialized
export const initGA = () => {
  if (!isBrowser) return;
  
  // Initialize dataLayer if it doesn't exist
  if (typeof window.dataLayer === 'undefined') {
    window.dataLayer = [];
  }
  
  // Create gtag function if it doesn't exist
  if (typeof window.gtag === 'undefined') {
    window.gtag = function() {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(arguments);
    };
  }
  
  // Create gtag function if it doesn't exist
  if (typeof window.gtag === 'undefined') {
    window.gtag = function() {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(arguments);
    };
  }
};

// Page view tracking
export const trackPageView = (url: string, title?: string) => {
  if (!isBrowser) return;
  
  initGA();
  
  window.gtag('config', 'G-HRC6G6L65K', {
    page_path: url,
    page_title: title || document.title,
  });
};

// Event tracking
export const trackEvent = (
  action: string, 
  category: string, 
  label?: string, 
  value?: number
) => {
  if (!isBrowser) return;
  
  initGA();
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Custom event tracking with more parameters
export const trackCustomEvent = (eventName: string, params?: Record<string, any>) => {
  if (!isBrowser) return;
  
  initGA();
  
  window.gtag('event', eventName, {
    ...params,
  });
};

// E-commerce tracking functions
export const trackPurchase = (transactionId: string, value: number, currency: string = 'USD', params?: Record<string, any>) => {
  if (!isBrowser) return;
  
  initGA();
  
  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: value,
    currency: currency,
    ...params,
  });
};

export const trackAddToCart = (itemId: string, itemName: string, value: number, params?: Record<string, any>) => {
  if (!isBrowser) return;
  
  initGA();
  
  window.gtag('event', 'add_to_cart', {
    items: [{
      item_id: itemId,
      item_name: itemName,
      value: value,
      ...params,
    }]
  });
};

// Consent management
export const updateConsent = (consentSettings: Record<string, boolean>) => {
  if (!isBrowser) return;
  
  initGA();
  
  window.gtag('consent', 'update', consentSettings);
};

// Opt-out of tracking
export const disableTracking = () => {
  if (!isBrowser) return;
  
  // Disable Google Analytics
  (window as any)['ga-disable-G-XXXXXXXXXX'] = true;
};