/* Blazing Trail Engineering - services index + detail renderer. */
(function () {
  function indexView(services) {
    var cards = services.map(function (s, i) {
      return (
        '<a href="services.html?slug=' + s.slug + '" class="card reveal reveal-delay-' + (i % 3 + 1) + '">' +
        '  <span class="card-number">' + String(i + 1).padStart(2, '0') + '</span>' +
        '  <h3>' + s.title + '</h3><p>' + s.summary + '</p>' +
        '  <span class="card-link">Learn more <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>' +
        '  <span class="card-underline"></span>' +
        '</a>'
      );
    }).join('');

    return (
      '<section class="page-header"><div class="hero-grid-overlay"></div><div class="container" style="position:relative;">' +
      '  <div class="breadcrumb"><a href="index.html">Home</a> / Services</div>' +
      '  <div class="eyebrow on-dark">Services</div><h1>Engineering services built around uptime</h1>' +
      '  <p class="lead">From load assessment to commissioning and after-sales support, every service exists to keep power flowing without interruption.</p>' +
      '</div></section>' +
      '<section class="section"><div class="container"><div class="grid grid-3">' + (cards || '<p>No services yet.</p>') + '</div></div></section>' +
      '<section class="section section-ice" style="padding-top:0;"><div class="container"><div class="cta-band reveal">' +
      '  <div><h2>Not sure which service fits your site?</h2><p>Tell us what you\'re running and where. We\'ll recommend the right combination.</p></div>' +
      '  <a href="quote.html" class="btn btn-primary magnetic">Request a Quote</a>' +
      '</div></div></section>'
    );
  }

  function paragraphsHtml(text, style) {
    return (text || '').split('\n\n').filter(Boolean)
      .map(function (para) { return '<p style="' + style + '">' + para + '</p>'; }).join('');
  }

  function detailView(service, related) {
    var relatedCards = related.map(function (s, i) {
      return (
        '<a href="services.html?slug=' + s.slug + '" class="card reveal reveal-delay-' + (i + 1) + '">' +
        '  <div class="card-accent"></div><h3>' + s.title + '</h3><p>' + s.summary + '</p>' +
        '  <span class="card-underline"></span>' +
        '</a>'
      );
    }).join('');

    var relatedSection = related.length ? (
      '<section class="section section-ice"><div class="container">' +
      '  <div class="section-head reveal"><div class="eyebrow">Related</div><h2>Other services</h2></div>' +
      '  <div class="grid grid-3 grid-scroll">' + relatedCards + '</div>' +
      '</div></section>'
    ) : '';

    return (
      '<section class="page-header" style="padding:180px 0 70px;"><div class="hero-grid-overlay"></div><div class="container" style="position:relative;">' +
      '  <div class="breadcrumb"><a href="index.html">Home</a> / <a href="services.html">Services</a> / ' + service.title + '</div>' +
      '  <div class="eyebrow on-dark">Service</div><h1 style="font-size:clamp(30px,4.4vw,48px);">' + service.title + '</h1>' +
      '</div></section>' +
      '<section class="section"><div class="container"><div class="grid grid-2" style="gap:64px;">' +
      '  <div class="reveal">' +
      '    <div class="card-accent" style="margin-bottom:22px;"></div>' +
      '    <p style="font-size:17px; color:var(--white); margin-bottom:24px;">' + service.summary + '</p>' +
      paragraphsHtml(service.description, 'font-size:15.5px; margin-bottom:16px;') +
      '  </div>' +
      '  <div class="reveal reveal-delay-1"><div class="card" style="padding:36px;">' +
      '    <h3 style="margin-bottom:20px;">Request this service</h3>' +
      '    <p style="margin-bottom:24px; font-size:14px;">Tell us about your site and we\'ll follow up with next steps and pricing.</p>' +
      '    <a href="quote.html" class="btn btn-primary magnetic" style="width:100%;">Request a Quote</a>' +
      '    <a href="#" id="service-whatsapp" target="_blank" rel="noopener" class="btn btn-outline magnetic" style="width:100%; margin-top:14px;">Chat on WhatsApp</a>' +
      '  </div></div>' +
      '</div></div></section>' +
      relatedSection
    );
  }

  document.addEventListener('DOMContentLoaded', async function () {
    var params = new URLSearchParams(window.location.search);
    var slug = params.get('slug');
    var content = document.getElementById('page-content');

    var biz = await window.BTE_SHELL.mount({ activePage: 'services', onDark: true, title: slug ? null : 'Services' });

    try {
      if (slug) {
        var data = await window.BTE_API.get('/services/' + encodeURIComponent(slug));
        document.title = data.service.title + ' - ' + biz.business_name;
        content.innerHTML = detailView(data.service, data.related || []);
        var wa = document.getElementById('service-whatsapp');
        if (wa) wa.setAttribute('href', 'https://wa.me/' + biz.business_whatsapp);
      } else {
        var listData = await window.BTE_API.get('/services/');
        content.innerHTML = indexView(listData.services);
      }
    } catch (err) {
      if (err.status === 404) {
        content.innerHTML = '<section class="section" style="padding-top:200px; padding-bottom:160px; text-align:center;"><div class="container"><div class="eyebrow" style="justify-content:center;">404</div><h1 style="font-size:clamp(34px,5vw,56px); margin-bottom:20px;">Service not found.</h1><p style="max-width:44ch; margin:0 auto 34px;">This service may have been renamed or removed.</p><a href="services.html" class="btn btn-primary magnetic">Back to services</a></div></section>';
      } else {
        content.innerHTML = '<section class="section" style="padding-top:200px; text-align:center;"><div class="container"><p>Could not load this page right now. Please refresh.</p></div></section>';
      }
    }

    window.BTE_SHELL.refreshReveal();
  });
})();
