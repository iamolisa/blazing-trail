/* Blazing Trail Engineering - shared page shell.
   Injects navbar + footer (populated from GET /api/business), then wires
   up all the interaction behaviours that used to live in main.js:
   loader, scroll progress, power line, nav toggle, reveal-on-scroll,
   counters, magnetic buttons, flash auto-dismiss. */

window.BTE_SHELL = (function () {
  var businessCache = null;

  async function getBusiness() {
    if (businessCache) return businessCache;
    try {
      businessCache = await window.BTE_API.get('/business');
    } catch (err) {
      // Fallback so the page still renders something sensible if /business
      // can't be reached (CORS misconfig, the API being briefly down, a
      // network hiccup). These are real numbers, not placeholders - a
      // fallback that shows a fake WhatsApp number is worse than no
      // fallback at all, since the visitor has no way to know it's dead.
      // Keep these in sync with BUSINESS_WHATSAPP / BUSINESS_WHATSAPP_SUPPORT
      // in the backend's config.py if either ever changes.
      businessCache = {
        business_name: 'Blazing Trail Engineering',
        business_tagline: 'Powering your world with reliable solutions',
        business_phone: '+234 808 557 8080',
        business_phone_secondary: '+234 810 869 0802',
        business_whatsapp: '2348085578080',
        business_whatsapp_support: '2348108690802',
        business_email: 'info@blazingtrailengineering.com',
        business_address: 'Lagos, Nigeria',
        current_year: new Date().getFullYear(),
      };
    }
    return businessCache;
  }

  function navbarHtml(activePage, onDark) {
    var links = [
      ['about.html', 'about', 'About'],
      ['services.html', 'services', 'Services'],
      ['solar.html', 'solar', 'Solar'],
      ['products.html', 'products', 'Products'],
      ['packages.html', 'packages', 'Packages'],
      ['gallery.html', 'gallery', 'Gallery'],
      ['tools.html', 'tools', 'Tools'],
      ['contact.html', 'contact', 'Contact'],
    ];
    var linksHtml = links.map(function (l) {
      var active = l[1] === activePage ? ' active' : '';
      return '<a href="' + l[0] + '" class="' + active.trim() + '">' + l[2] + '</a>';
    }).join('\n');

    return (
      '<nav class="navbar' + (onDark ? ' on-dark' : '') + '">' +
      '  <div class="container">' +
      '    <a href="index.html" class="brand">' +
      '      <span class="brand-mark"><img src="images/blazing-trail-icon.png" alt="Blazing Trail Engineering"></span>' +
      '      <span class="brand-name">Blazing Trail<span>Engineering</span></span>' +
      '    </a>' +
      '    <div class="nav-links" id="nav-links-menu">' + linksHtml + '</div>' +
      '    <div class="nav-cta">' +
      '      <a href="quote.html" class="btn btn-primary btn-sm magnetic">Request a Quote</a>' +
      '      <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links-menu"><span></span><span></span><span></span></button>' +
      '    </div>' +
      '  </div>' +
      '</nav>'
    );
  }

  function footerHtml(biz) {
    return (
      '<footer class="footer"><div class="container"><div class="footer-grid">' +
      '  <div>' +
      '    <div class="brand" style="margin-bottom:22px;">' +
      '      <span class="brand-mark"><img src="images/blazing-trail-icon.png" alt="Blazing Trail Engineering"></span>' +
      '      <span class="brand-name" style="color:#fff;">Blazing Trail<span>Engineering</span></span>' +
      '    </div>' +
      '    <p style="max-width:34ch; font-size:14px;">' + biz.business_tagline + '. Solar infrastructure, industrial panels and PLC automation across Nigeria.</p>' +
      '    <div class="footer-socials" style="margin-top:26px;">' +
      '      <a href="https://wa.me/' + biz.business_whatsapp + '" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="#fff"><path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5C10.1 9 9.6 7.7 9.4 7.2c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3z"/><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm0 18.2c-1.7 0-3.4-.5-4.8-1.4l-.3-.2-3 .9.9-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg></a>' +
      '      <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="#fff"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2 3.77-2 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.2c0-1.24-.02-2.83-1.73-2.83-1.73 0-2 1.35-2 2.75V21H9z"/></svg></a>' +
      '      <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2.2c3.2 0 3.6 0 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.25.07 1.63.07 4.81s-.01 3.56-.07 4.81c-.15 3.23-1.66 4.77-4.92 4.92-1.25.06-1.62.07-4.85.07s-3.6 0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.15 15.56 2.14 15.19 2.14 12s.01-3.56.07-4.81C2.36 3.96 3.88 2.42 7.14 2.27 8.4 2.21 8.77 2.2 12 2.2zM12 0C8.7 0 8.3 0 7.05.07c-4.35.2-6.78 2.62-6.98 6.98C0 8.3 0 8.7 0 12s0 3.7.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.3 24 8.7 24 12 24s3.7 0 4.95-.07c4.35-.2 6.79-2.62 6.98-6.98.07-1.25.07-1.65.07-4.95s0-3.7-.07-4.95c-.19-4.35-2.62-6.78-6.98-6.98C15.7 0 15.3 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg></a>' +
      '    </div>' +
      '  </div>' +
      '  <div><h4>Company</h4><ul>' +
      '    <li><a href="about.html">About us</a></li>' +
      '    <li><a href="gallery.html">Project gallery</a></li>' +
      '    <li><a href="testimonials.html">Testimonials</a></li>' +
      '    <li><a href="contact.html">Contact</a></li>' +
      '  </ul></div>' +
      '  <div><h4>Offerings</h4><ul>' +
      '    <li><a href="services.html">Services</a></li>' +
      '    <li><a href="products.html">Products</a></li>' +
      '    <li><a href="packages.html">Packages &amp; pricing</a></li>' +
      '    <li><a href="tools.html">Sizing tools</a></li>' +
      '  </ul></div>' +
      '  <div><h4>Get in touch</h4><ul>' +
      '    <li><a href="tel:' + biz.business_phone + '">' + biz.business_phone + '</a></li>' +
      (biz.business_phone_secondary ? '    <li><a href="tel:' + biz.business_phone_secondary + '">' + biz.business_phone_secondary + '</a></li>' : '') +
      '    <li><a href="mailto:' + biz.business_email + '">' + biz.business_email + '</a></li>' +
      '    <li><span>' + biz.business_address + '</span></li>' +
      '    <li><a href="quote.html">Request a quote →</a></li>' +
      '  </ul></div>' +
      '</div>' +
      '<div class="footer-bottom">' +
      '  <span>© ' + biz.current_year + ' ' + biz.business_name + '. All rights reserved.</span>' +
      '  <div class="flex gap-12"><a href="privacy.html">Privacy Policy</a><a href="terms.html">Terms of Service</a></div>' +
      '</div></div></footer>'
    );
  }

  function initLoader() {
    var loader = document.querySelector('.page-loader');
    if (!loader) return;
    window.requestAnimationFrame(function () {
      setTimeout(function () { loader.classList.add('hidden'); }, 420);
    });
  }

  function initScrollProgress() {
    var bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    var update = function () {
      var h = document.documentElement;
      var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = scrolled + '%';
    };
    document.addEventListener('scroll', update, { passive: true });
    update();
  }


  var INTENT_MODAL_LINKS = [
    ['products.html', 'Products'],
    ['services.html', 'Services'],
    ['tools.html', 'Size my system'],
    ['packages.html', 'Packages'],
  ];

  function intentModalHtml() {
    var linksHtml = INTENT_MODAL_LINKS.map(function (l) {
      return '<a href="' + l[0] + '">' + l[1] + '</a>';
    }).join('');
    return (
      '<div class="intent-modal-backdrop" id="intent-modal-backdrop">' +
      '  <div class="intent-modal">' +
      '    <button class="intent-modal-close" id="intent-modal-close" aria-label="Close">' + window.BTE_ICON('close') + '</button>' +
      '    <h3>What brings you here today?</h3>' +
      '    <p>Jump straight to what you need, or keep browsing, either way works.</p>' +
      '    <div class="intent-modal-grid">' + linksHtml + '</div>' +
      '    <a href="#" class="intent-modal-skip" id="intent-modal-skip">Continue browsing</a>' +
      '  </div>' +
      '</div>'
    );
  }

  var LAST_VISIT_KEY = 'bte_last_visit';
  var SESSION_SEEN_KEY = 'bte_session_started';
  var INACTIVITY_RESET_MS = 60 * 60 * 1000; // 1 hour

  function initIntentModal() {
    var now = Date.now();
    var lastVisit = parseInt(localStorage.getItem(LAST_VISIT_KEY), 10);
    var wasInactiveLongEnough = !lastVisit || (now - lastVisit) > INACTIVITY_RESET_MS;

    // sessionStorage is scoped to this one tab and is wiped the moment the
    // tab (or browser) closes - unlike localStorage, which survives that.
    // So "no flag yet" means this tab has never shown the modal, which
    // covers a closed-and-reopened tab even if it's well within the hour.
    var isNewTabSession = !sessionStorage.getItem(SESSION_SEEN_KEY);

    var isFreshEntrance = wasInactiveLongEnough || isNewTabSession;

    // Every page view counts as activity, whether or not the modal ends
    // up showing - this is what makes it an *inactivity* timer rather
    // than a fixed "once every hour" clock: browsing continuously keeps
    // pushing the reset point forward, and it only fires again after a
    // full hour with no page views at all.
    localStorage.setItem(LAST_VISIT_KEY, String(now));
    sessionStorage.setItem(SESSION_SEEN_KEY, '1');

    if (!isFreshEntrance) return;

    setTimeout(function () {
      var wrap = document.createElement('div');
      wrap.innerHTML = intentModalHtml();
      var backdrop = wrap.firstElementChild;
      document.body.appendChild(backdrop);

      // Dismissing or picking a choice only closes this instance - it
      // never navigates away or reloads the page underneath it, so
      // whoever triggered it stays exactly where they were.
      var dismiss = function () {
        backdrop.classList.remove('open');
        setTimeout(function () { backdrop.remove(); }, 300);
      };

      requestAnimationFrame(function () { backdrop.classList.add('open'); });
      backdrop.querySelector('#intent-modal-close').addEventListener('click', dismiss);
      backdrop.querySelector('#intent-modal-skip').addEventListener('click', function (e) { e.preventDefault(); dismiss(); });
      backdrop.addEventListener('click', function (e) { if (e.target === backdrop) dismiss(); });
      document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') { dismiss(); document.removeEventListener('keydown', escHandler); }
      });
    }, 1600);
  }

  function initNavbar() {
    var nav = document.querySelector('.navbar');
    if (!nav) return;
    var toggle = nav.querySelector('.nav-toggle');
    var links = nav.querySelector('.nav-links');
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 40); };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        var isOpen = toggle.classList.toggle('open');
        links.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
      links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          toggle.classList.remove('open');
          links.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (typeof IntersectionObserver === 'undefined') {
      items.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  function initCounters() {
    var counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;
    var animate = function (el) {
      var target = parseFloat(el.dataset.counter);
      var decimals = el.dataset.counter.indexOf('.') > -1 ? 1 : 0;
      var duration = 1400;
      var start = performance.now();
      var step = function (now) {
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals);
      };
      requestAnimationFrame(step);
    };
    if (typeof IntersectionObserver === 'undefined') {
      counters.forEach(animate);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animate(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { io.observe(el); });
  }

  function initMagnetic() {
    var items = document.querySelectorAll('.magnetic');
    if (typeof window.matchMedia !== 'function' || !window.matchMedia('(pointer: fine)').matches) return;
    items.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = 'translate(' + (x * 0.18) + 'px, ' + (y * 0.3) + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = 'translate(0,0)'; });
    });
  }

  function initSpotlight() {
    var items = document.querySelectorAll('.spotlight');
    if (typeof window.matchMedia !== 'function' || !window.matchMedia('(pointer: fine)').matches) return;
    items.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        el.style.setProperty('--my', (e.clientY - rect.top) + 'px');
      });
    });
  }

  function initFlashDismiss() {
    document.querySelectorAll('.flash').forEach(function (el) {
      setTimeout(function () {
        el.style.transition = 'opacity 0.5s ease';
        el.style.opacity = '0';
      }, 5000);
    });
  }

  /** Show a dismissible flash message inside the given slot element. */
  function flash(container, message, category) {
    if (!container) return;
    var isError = category === 'error';
    var div = document.createElement('div');
    div.className = 'flash flash-' + (category || 'success');
    div.setAttribute('role', isError ? 'alert' : 'status');
    div.setAttribute('aria-live', isError ? 'assertive' : 'polite');
    div.textContent = message;
    container.innerHTML = '';
    container.appendChild(div);
    setTimeout(function () {
      div.style.transition = 'opacity 0.5s ease';
      div.style.opacity = '0';
    }, 5000);
  }

  /** Re-run the reveal observer for content injected after initial mount. */
  function refreshReveal() { initReveal(); initCounters(); initMagnetic(); initSpotlight(); }

  /**
   * Replaces the static #whatsapp-fab anchor (markup lives once in each
   * page's HTML) with a small expanding menu: clicking the round button
   * reveals two numbered options above it instead of linking straight out.
   * Built here, once, so every page gets it automatically rather than
   * needing the same menu markup pasted into all 15 HTML files.
   */
  function initWhatsappFab(biz) {
    var oldFab = document.getElementById('whatsapp-fab');
    if (!oldFab) return;

    var iconSvg = oldFab.innerHTML;

    var wrapper = document.createElement('div');
    wrapper.className = 'whatsapp-fab-wrapper';
    wrapper.innerHTML =
      '<div class="whatsapp-fab-menu" id="whatsapp-fab-menu">' +
      '  <a class="whatsapp-fab-option" href="https://wa.me/' + biz.business_whatsapp + '" target="_blank" rel="noopener">Project &amp; Support</a>' +
      '  <a class="whatsapp-fab-option" href="https://wa.me/' + biz.business_whatsapp_support + '" target="_blank" rel="noopener">Business &amp; Sales</a>' +
      '</div>' +
      '<button type="button" class="whatsapp-fab" id="whatsapp-fab" aria-label="Chat on WhatsApp" aria-haspopup="true" aria-expanded="false">' + iconSvg + '</button>';

    oldFab.replaceWith(wrapper);

    var toggleBtn = wrapper.querySelector('#whatsapp-fab');
    var menu = wrapper.querySelector('#whatsapp-fab-menu');

    function closeMenu() {
      menu.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }

    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = menu.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Clicking anywhere outside the button/menu, or pressing Escape,
    // closes it - same pattern as the nav dropdown elsewhere on the site.
    document.addEventListener('click', function (e) {
      if (!wrapper.contains(e.target)) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  async function mount(opts) {
    opts = opts || {};
    var biz = await getBusiness();

    var navSlot = document.getElementById('navbar-slot');
    if (navSlot) navSlot.innerHTML = navbarHtml(opts.activePage, opts.onDark);

    var footerSlot = document.getElementById('footer-slot');
    if (footerSlot) footerSlot.innerHTML = footerHtml(biz);

    initWhatsappFab(biz);

    document.title = (opts.title ? opts.title + ' - ' : '') + biz.business_name;

    initLoader();
    initScrollProgress();
    initNavbar();
    initReveal();
    initCounters();
    initMagnetic();
    initSpotlight();
    initFlashDismiss();
    initIntentModal();

    return biz;
  }

  return { mount: mount, getBusiness: getBusiness, flash: flash, refreshReveal: refreshReveal };
})();