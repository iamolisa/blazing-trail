/* Blazing Trail Engineering - inline SVG icon set (ported 1:1 from the
   Flask app's app/core/icons.py so services/products render identically). */
(function () {
  var WRAP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{0}</svg>';
  function wrap(inner) { return WRAP.replace('{0}', inner); }

  var ICONS = {
    sun: wrap('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    clipboard: wrap('<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M9 11h6M9 15h6"/>'),
    grid: wrap('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'),
    cpu: wrap('<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 22v-4M15 22v-4M2 9h4M2 15h4M22 9h-4M22 15h-4"/>'),
    battery: wrap('<rect x="2" y="7" width="17" height="10" rx="2"/><path d="M22 10v4M6 10v4M10 10v4"/>'),
    tool: wrap('<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L2 19l3 3 7.3-7.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2z"/>'),
    chart: wrap('<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/>'),
    headset: wrap('<path d="M3 13a9 9 0 0 1 18 0"/><path d="M21 13v4a2 2 0 0 1-2 2h-1v-6h3zM3 13v4a2 2 0 0 0 2 2h1v-6H3z"/>'),
    shield: wrap('<path d="M12 2l8 4v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>'),
    bolt: wrap('<path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/>'),
  };

  // UI-chrome icons: not rendered anywhere server-side, so they don't need
  // to stay in sync with app/core/icons.py the way the set above does.
  var UI_ICONS = {
    close: wrap('<path d="M18 6 6 18M6 6l12 12"/>'),
    phone: wrap('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>'),
    mail: wrap('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>'),
  };

  window.BTE_ICON = function (name) {
    return ICONS[name] || UI_ICONS[name] || ICONS.bolt;
  };
})();
