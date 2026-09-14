/* Blazing Trail Engineering - analytics loader.
   Loads GA4 and/or Meta Pixel only if their IDs are set in config.js;
   each is fully independent of the other. Also exposes a small
   trackLead() helper so form-submit handlers across the site can report
   conversions consistently without duplicating gtag/fbq calls everywhere. */
(function () {
  var cfg = (window.BTE_CONFIG && window.BTE_CONFIG.ANALYTICS) || {};

  function injectScript(src, attrs) {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    Object.keys(attrs || {}).forEach(function (k) { s[k] = attrs[k]; });
    document.head.appendChild(s);
    return s;
  }

  // ---- Google Search Console (HTML tag verification) ----------------------
  if (cfg.GSC_VERIFICATION) {
    var meta = document.createElement('meta');
    meta.name = 'google-site-verification';
    meta.content = cfg.GSC_VERIFICATION;
    document.head.appendChild(meta);
  }

  // ---- Google Analytics 4 --------------------------------------------------
  var gaReady = false;
  if (cfg.GA4_MEASUREMENT_ID) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    // Nigeria's NDPA and most privacy-conscious defaults call for IP
    // anonymization on analytics; GA4 does this by default, no config
    // needed, but noted here for anyone auditing this file.
    window.gtag('config', cfg.GA4_MEASUREMENT_ID);
    injectScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.GA4_MEASUREMENT_ID));
    gaReady = true;
  }

  // ---- Meta Pixel -----------------------------------------------------------
  var fbReady = false;
  if (cfg.META_PIXEL_ID) {
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = true; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', cfg.META_PIXEL_ID);
    window.fbq('track', 'PageView');
    fbReady = true;
  }

  /**
   * Report a lead-generating conversion (form submit) to whichever
   * analytics providers are configured. Call this from a form's success
   * handler, e.g.: window.BTE_ANALYTICS.trackLead('contact_form').
   * Silently does nothing if neither provider is configured; callers
   * never need to check whether analytics is enabled before calling this.
   */
  function trackLead(source) {
    if (gaReady) window.gtag('event', 'generate_lead', { lead_source: source });
    if (fbReady) window.fbq('track', 'Lead', { content_name: source });
  }

  window.BTE_ANALYTICS = { trackLead: trackLead };
})();
