import React from 'react';
import { useGoogleAnalytics } from '../utils/use-google-analytics';

const AnalyticsDemo: React.FC = () => {
  const { trackEvent, trackCustomEvent, trackPurchase, trackAddToCart } = useGoogleAnalytics();

  const handleButtonClick = () => {
    trackEvent('button_click', 'engagement', 'demo_button');
    console.log('Button click tracked in Google Analytics');
  };

  const handleCustomEvent = () => {
    trackCustomEvent('custom_demo_event', {
      action: 'demo',
      category: 'engagement',
      label: 'custom_demo'
    });
    console.log('Custom event tracked in Google Analytics');
  };

  const handlePurchase = () => {
    trackPurchase('demo_transaction_id', 99.99, 'USD', {
      currency: 'USD',
      items: [{
        item_id: 'demo_item_1',
        item_name: 'Demo Product',
        price: 99.99
      }]
    });
    console.log('Purchase tracked in Google Analytics');
  };

  const handleAddToCart = () => {
    trackAddToCart('demo_item_1', 'Demo Product', 99.99, {
      currency: 'USD'
    });
    console.log('Add to cart tracked in Google Analytics');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Google Analytics Demo</h2>
      <p className="mb-4">This section demonstrates how Google Analytics events are tracked in your React application.</p>
      
      <div className="space-y-3">
        <button 
          onClick={handleButtonClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 mb-2"
        >
          Track Button Click
        </button>
        
        <button 
          onClick={handleCustomEvent}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2 mb-2"
        >
          Track Custom Event
        </button>
        
        <button 
          onClick={handleAddToCart}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-2 mb-2"
        >
          Track Add to Cart
        </button>
        
        <button 
          onClick={handlePurchase}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2 mb-2"
        >
          Track Purchase
        </button>
      </div>
      
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Implementation Notes:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Google Analytics 4 (GA4) and Google Tag Manager (GTM) scripts are loaded in the root.tsx file</li>
          <li>Update your tracking IDs in root.tsx (G-XXXXXXXXXX and GTM-XXXXXXX)</li>
          <li>Use the useGoogleAnalytics hook to track events in your components</li>
          <li>All tracking is client-side only and will not affect server-side rendering</li>
        </ul>
      </div>
    </div>
  );
};

export default AnalyticsDemo;