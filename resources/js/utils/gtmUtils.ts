import TagManager from '@sooro-io/react-gtm-module';

// Extend the Window interface to include dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}

interface GTMDataLayerEvent {
  event: string;
  [key: string]: any;
}

/**
 * Initializes Google Tag Manager.
 * Safe for SSR environments.
 * @param gtmId - The GTM ID to use. If not provided, falls back to environment variable.
 * @param initialDataLayer - Optional initial data layer object to include during initialization.
 */
export const initializeGTM = (gtmId?: string, initialDataLayer?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    const tagManagerArgs = {
      gtmId: gtmId || import.meta.env.VITE_GTM_ID || 'GTM-XXXXXXX', // Use provided GTM ID or fallback
      ...(initialDataLayer && { dataLayer: initialDataLayer }),
    };
    TagManager.initialize(tagManagerArgs);
    console.log('GTM Initialized with ID:', tagManagerArgs.gtmId);
  } else {
    console.log('GTM initialization skipped on server-side.');
  }
};

/**
 * Pushes an event to the GTM data layer.
 * Safe for SSR environments.
 * @param data - The event data to push.
 */
export const pushToDataLayer = (data: GTMDataLayerEvent) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
    console.log('Pushed to dataLayer:', data);
  } else if (typeof window !== 'undefined' && !window.dataLayer) {
    console.warn('dataLayer is not initialized. Event not pushed:', data);
    // Optionally, queue the event or handle it differently
  } else {
    console.log('Data layer push skipped on server-side:', data);
  }
};

/**
 * Tracks a button click event.
 * @param buttonName - The name or identifier of the button.
 * @param additionalData - Optional additional data for the event.
 */
export const trackButtonClick = (buttonName: string, additionalData: Record<string, any> = {}) => {
  pushToDataLayer({
    event: 'button_click',
    button_name: buttonName,
    ...additionalData,
  });
};

/**
 * Tracks a subscription success event.
 * @param planName - The name of the subscribed plan.
 * @param userId - The ID of the user.
 * @param additionalData - Optional additional data for the event.
 */
export const trackSubscriptionSuccess = (planName: string, userId?: string | number, additionalData: Record<string, any> = {}) => {
  pushToDataLayer({
    event: 'subscription_success',
    plan_name: planName,
    user_id: userId,
    ...additionalData,
  });
};

/**
 * Tracks a page load event.
 * This can be called on route changes in a SPA.
 * @param pagePath - The path of the page loaded.
 * @param pageTitle - The title of the page loaded.
 * @param additionalData - Optional additional data for the event.
 */
export const trackPageLoad = (pagePath: string, pageTitle?: string, additionalData: Record<string, any> = {}) => {
  pushToDataLayer({
    event: 'page_view_custom', // Using 'page_view_custom' to avoid conflict with GTM's automatic page_view
    page_path: pagePath,
    page_title: pageTitle || document.title, // Fallback to document.title if available
    ...additionalData,
  });
};

// Ensure dataLayer is initialized if not already present (for SPAs or late GTM init)
if (typeof window !== 'undefined' && !window.dataLayer) {
  window.dataLayer = [];
}