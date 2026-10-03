/* Blazing Trail Engineering - dedicated Solar landing page.
   Pulls real data (service description, packages, solar-tagged gallery
   items, testimonials) rather than hardcoding copy that would drift from
   the admin-managed content shown elsewhere on the site. */
(function () {
  function packageCard(pkg, i) {
    var includes = (pkg.includes || []).slice(0, 4).map(function (item) {
      return '<li><svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round"><path d="M4 12l5 5L20 6"/></svg>' + item + '</li>';
    }).join('');
    var hasWith = !!pkg.price_with_panel_naira;
    var defaultMode = hasWith ? 'with' : 'without';
    return (
      '<div class="package-card spotlight reveal reveal-delay-' + (i % 4 + 1) + (pkg.is_popular ? ' popular' : '') + '">' +
      (pkg.is_popular ? '<span class="package-badge">Most popular</span>' : '') +
      '  <div class="package-top-row"><div class="package-kva">' + pkg.kva_rating + '</div><span class="battery-tag">' + pkg.battery_type + '</span></div>' +
      '  <h3>' + pkg.name + '</h3><p class="tagline">' + (pkg.tagline || '') + '</p>' +
      '  <div class="package-price">' + (defaultMode === 'with' ? pkg.formatted_price_with_panel : pkg.formatted_price_without_panel) + '</div>' +
      '  <div class="package-note package-panel-spec">' + (defaultMode === 'with' ? (pkg.panel_spec || '') : '') + '</div>' +
      '  <ul class="package-includes">' + includes + '</ul>' +
      '  <a href="quote.html" class="btn btn-outline btn-sm magnetic" style="width:100%;">Get this package</a>' +
      '</div>'
    );
  }

  function galleryTile(item, i) {
    return (
      '<a href="gallery.html?id=' + item.id + '" class="bento-tile reveal reveal-delay-' + (i % 4 + 1) + (i === 0 ? ' featured' : '') + '" style="background-image:url(\'' + item.image_url + '\')">' +
      '  <div class="bento-tile-overlay"><span class="bento-tile-category">Solar</span>' +
      '    <span class="bento-tile-title">' + item.title + '</span>' +
      '    <span class="bento-tile-meta"><span>' + item.location + (item.kva_rating ? ' · ' + item.kva_rating : '') + '</span></span>' +
      '  </div>' +
      '</a>'
    );
  }

  function escapeHtml(s) {
    return (s || '').toString().replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function starsSvg(rating) {
    var svg = '<svg viewBox="0 0 24 24"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3 1.2-6.8-5-4.9 6.9-1z"/></svg>';
    return Array.from({ length: rating || 0 }).map(function () { return svg; }).join('');
  }

  function testimonialCard(t, i) {
    return (
      '<div class="testimonial-card reveal reveal-delay-' + (i % 3 + 1) + '">' +
      '  <div class="stars">' + starsSvg(t.rating) + '</div><p class="testimonial-quote">"' + escapeHtml(t.quote) + '"</p>' +
      '  <div class="testimonial-author"><div class="testimonial-avatar">' + escapeHtml(t.client_name.charAt(0)) + '</div>' +
      '    <div><div class="testimonial-name">' + escapeHtml(t.client_name) + '</div><div class="testimonial-role">' + escapeHtml(t.client_role || '') + '</div></div>' +
      '  </div>' +
      '</div>'
    );
  }

  function view(service, packages, gallery, testimonials) {
    var packageCards = packages.slice(0, 4).map(packageCard).join('');
    var galleryTiles = gallery.slice(0, 5).map(galleryTile).join('');
    var testimonialCards = testimonials.slice(0, 3).map(testimonialCard).join('');

    return (
      '<section class="page-header" style="padding-top:200px;"><div class="hero-grid-overlay"></div><div class="container" style="position:relative;">' +
      '  <div class="breadcrumb"><a href="index.html">Home</a> / Solar</div>' +
      '  <div class="eyebrow on-dark">Solar energy systems</div>' +
      '  <h1>Solar sized to your actual load, not a box off the shelf</h1>' +
      '  <p class="lead">' + (service ? service.summary : 'Design, supply and installation for homes, businesses and industrial sites across Nigeria, backed by installation, commissioning and after-sales support.') + '</p>' +
      '  <div class="flex gap-12" style="flex-wrap:wrap; margin-top:36px;">' +
      '    <a href="quote.html" class="btn btn-primary btn-shine magnetic">Request a Quote</a>' +
      '    <a href="tools.html" class="btn btn-outline on-dark magnetic">Size my system</a>' +
      '  </div>' +
      '</div></section>' +

      '<section class="section">' +
      '  <div class="container"><div class="grid grid-3">' +
      '    <div class="card reveal reveal-delay-1"><div class="card-accent"></div><h3>Engineered, not guessed</h3><p>Every system starts with a real load assessment: appliances, running hours, peak demand, before we spec panels, inverter and battery.</p></div>' +
      '    <div class="card reveal reveal-delay-2"><div class="card-accent"></div><h3>Lithium or tubular battery options</h3><p>Longer lifespan and deeper discharge with lithium, or lower upfront cost with tubular, priced both ways so you can compare directly.</p></div>' +
      '    <div class="card reveal reveal-delay-3"><div class="card-accent"></div><h3>After-sales that exists</h3><p>Commissioning, optimisation and troubleshooting after handover, not just installation and a goodbye.</p></div>' +
      '  </div></div>' +
      '</section>' +

      '<section class="section section-ice">' +
      '  <div class="container">' +
      '    <div class="section-head center reveal" style="margin-left:auto; margin-right:auto;">' +
      '      <div class="eyebrow">Packages</div><h2>Fixed solar packages, priced with or without panels</h2>' +
      '      <p class="lead">Every system below is priced two ways: with solar panels bundled, or inverter + battery only if you already have panels.</p>' +
      '    </div>' +
      '    <div class="grid grid-4 grid-scroll">' + (packageCards || '<p>Packages are being updated. Request a custom quote in the meantime.</p>') + '</div>' +
      '    <div class="text-center reveal" style="margin-top:48px;"><a href="packages.html" class="btn btn-outline magnetic">View all packages</a></div>' +
      '  </div>' +
      '</section>' +

      '<section class="section">' +
      '  <div class="container"><div class="grid grid-2" style="gap:64px; align-items:flex-start;">' +
      '    <div class="section-head reveal sticky-aside" style="margin-bottom:0;">' +
      '      <div class="eyebrow">How it works</div><h2>From first call to commissioned system</h2>' +
      '      <p class="lead">A structured process, because solar isn\'t something to improvise.</p>' +
      '    </div>' +
      '    <div class="timeline reveal reveal-delay-1">' +
      '      <div class="timeline-item"><span class="timeline-dot"></span><span class="timeline-step">Step 1</span><h4>Load assessment</h4><p>We size your system from real appliances and usage, on-site or via the sizing calculator.</p></div>' +
      '      <div class="timeline-item"><span class="timeline-dot"></span><span class="timeline-step">Step 2</span><h4>Design &amp; quotation</h4><p>A fixed package or a custom quote, priced with or without panels.</p></div>' +
      '      <div class="timeline-item"><span class="timeline-dot"></span><span class="timeline-step">Step 3</span><h4>Supply &amp; installation</h4><p>Panels, inverter and battery installed by our own technicians, not a subcontractor.</p></div>' +
      '      <div class="timeline-item"><span class="timeline-dot"></span><span class="timeline-step">Step 4</span><h4>Commissioning</h4><p>Tested under real load before handover, not switched on and left.</p></div>' +
      '      <div class="timeline-item"><span class="timeline-dot"></span><span class="timeline-step">Step 5</span><h4>After-sales support</h4><p>Ongoing optimisation and troubleshooting after your system is live.</p></div>' +
      '    </div>' +
      '  </div></div>' +
      '</section>' +

      (galleryTiles ? (
        '<section class="section section-ice">' +
        '  <div class="container">' +
        '    <div class="flex" style="justify-content:space-between; align-items:flex-end; margin-bottom:48px; flex-wrap:wrap; gap:20px;">' +
        '      <div class="section-head reveal" style="margin-bottom:0;"><div class="eyebrow">Recent installs</div><h2>Solar projects we\'ve delivered</h2></div>' +
        '      <a href="gallery.html?category=solar" class="btn btn-outline magnetic reveal">View full gallery</a>' +
        '    </div>' +
        '    <div class="gallery-bento reveal reveal-delay-1">' + galleryTiles + '</div>' +
        '  </div>' +
        '</section>'
      ) : '') +

      (testimonialCards ? (
        '<section class="section">' +
        '  <div class="container">' +
        '    <div class="section-head center reveal"><div class="eyebrow">Client feedback</div><h2>What clients say about their solar systems</h2></div>' +
        '    <div class="grid grid-3 grid-scroll">' + testimonialCards + '</div>' +
        '  </div>' +
        '</section>'
      ) : '') +

      '<section class="section" style="padding-top:0;">' +
      '  <div class="container"><div class="cta-band reveal">' +
      '    <div><h2>Not sure what size system you need?</h2><p>Use the sizing calculator, or tell us about your site and we\'ll size it for you. No oversold packages.</p></div>' +
      '    <div class="flex gap-12" style="flex-wrap:wrap;">' +
      '      <a href="tools.html" class="btn btn-primary magnetic">Try the sizing calculator</a>' +
      '      <a href="quote.html" class="btn btn-outline on-dark magnetic">Request a Quote</a>' +
      '    </div>' +
      '  </div></div>' +
      '</section>'
    );
  }

  document.addEventListener('DOMContentLoaded', async function () {
    var content = document.getElementById('page-content');
    await window.BTE_SHELL.mount({ activePage: 'solar', onDark: true, title: 'Solar Energy Systems' });

    try {
      var results = await Promise.allSettled([
        window.BTE_API.get('/services/solar-design-supply-installation'),
        window.BTE_API.get('/packages/'),
        window.BTE_API.get('/gallery/?category=solar'),
        window.BTE_API.get('/testimonials/'),
      ]);

      var service = results[0].status === 'fulfilled' ? results[0].value.service : null;
      var packages = results[1].status === 'fulfilled' ? results[1].value.packages : [];
      var gallery = results[2].status === 'fulfilled' ? results[2].value.items : [];
      var testimonials = results[3].status === 'fulfilled' ? results[3].value.testimonials : [];

      content.innerHTML = view(service, packages, gallery, testimonials);
    } catch (err) {
      content.innerHTML = '<section class="section" style="padding-top:200px; padding-bottom:160px; text-align:center;"><div class="container"><p>Could not load this page right now. Please refresh.</p></div></section>';
    }

    window.BTE_SHELL.refreshReveal();
  });
})();
