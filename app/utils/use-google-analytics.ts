import { useEffect } from 'react';
import { 
  trackPageView, 
  trackEvent, 
  trackCustomEvent,
  trackPurchase,
  trackAddToCart,
  updateConsent,
  disableTracking 
} from './google-analytics';

// Custom hook for Google Analytics
export const useGoogleAnalytics = () => {
  // Track initial page view and handle route changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: number | undefined;

    const handleRouteChange = () => {
      // Add a small delay to ensure the title and path have updated
      timeoutId = setTimeout(() => {
        trackPageView(window.location.pathname + window.location.search, document.title);
      }, 100);
    };

    // Track initial page load
    handleRouteChange();

    // For React Router 7, we'll monitor for URL changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    const pushStateWrapper = function (this: History, ...args: [data: any, title: string, url?: string | null | undefined]) {
      const result = originalPushState.apply(this, args);
      handleRouteChange();
      return result;
    };

    const replaceStateWrapper = function (this: History, ...args: [data: any, title: string, url?: string | null | undefined]) {
      const result = originalReplaceState.apply(this, args);
      handleRouteChange();
      return result;
    };

    history.pushState = pushStateWrapper as typeof history.pushState;
    history.replaceState = replaceStateWrapper as typeof history.replaceState;

    // Listen for popstate events (back/forward button)
    window.addEventListener('popstate', handleRouteChange);

    // Fallback for any other URL changes
    const urlChangeObserver = new MutationObserver(handleRouteChange);
    urlChangeObserver.observe(document, { childList: true, subtree: true });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', handleRouteChange);
      urlChangeObserver.disconnect();
    };
  }, []);

  return {
    trackEvent,
    trackCustomEvent,
    trackPurchase,
    trackAddToCart,
    updateConsent,
    disableTracking
  };
};