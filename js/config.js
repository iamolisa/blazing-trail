/* Blazing Trail Engineering - frontend configuration.
   This is the ONE place to change when you deploy: point API_BASE_URL at
   your Render backend (e.g. "https://blazingtrail-api.onrender.com/api").
   During local testing it points at a local Flask dev server. */
window.BTE_CONFIG = {
  API_BASE_URL: (function () {
    var override = localStorage.getItem('bte_api_base');
    return override || 'https://blazing-backend-t6jk.onrender.com/api';
  })(),

  // Fill these in before going live. Each one is independently optional:
  // leave any of them blank and that integration simply doesn't load
  // (see js/analytics.js). Nothing here requires a code change once set.
  ANALYTICS: {
    // Google Analytics 4: Admin > Data Streams > your stream > Measurement ID.
    GA4_MEASUREMENT_ID: '',
    // Meta Ads Manager > Events Manager > your Pixel > Pixel ID.
    META_PIXEL_ID: '',
    // Google Search Console > Settings > Ownership verification > HTML tag
    // method > just the content="..." value, not the whole tag.
    GSC_VERIFICATION: '',
  },
};