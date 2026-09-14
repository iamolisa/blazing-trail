/* Blazing Trail Engineering - home page renderer. */
(function () {
  function escapeHtml(s) {
    return (s || '').toString().replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function serviceCard(service, i) {
    return (
      '<a href="services.html?slug=' + service.slug + '" class="card reveal reveal-delay-' + (i % 4 + 1) + '">' +
      '  <div class="card-icon">' + window.BTE_ICON(service.icon) + '</div>' +
      '  <h3>' + service.title + '</h3><p>' + service.summary + '</p>' +
      '  <span class="card-link">Learn more <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>' +
      '  <span class="card-underline"></span>' +
      '</a>'
    );
  }

  function productCard(product, i) {
    var img = product.image_url ? '<img src="' + product.image_url + '" alt="' + product.name + '">' : '';
    return (
      '<a href="products.html?slug=' + product.slug + '" class="product-card reveal reveal-delay-' + (i % 3 + 1) + '">' +
      '  <div class="product-media">' + img + '<span class="product-tag">' + (product.category ? product.category.name : 'Product') + '</span></div>' +
      '  <div class="product-body"><h3>' + product.name + '</h3><p>' + (product.short_description || '') + '</p>' +
      '    <div class="product-meta"><span>' + (product.spec_summary || '') + '</span><span class="product-price">' + product.formatted_price + '</span></div>' +
      '  </div>' +
      '</a>'
    );
  }

  function workCard(item) {
    return (
      '<a href="gallery.html?id=' + item.id + '" class="work-card"><img src="' + item.image_url + '" alt="' + item.title + '" loading="lazy">' +
      '  <div class="work-card-overlay"><span class="work-card-title">' + item.title + '</span>' +
      '    <span class="work-card-meta">' + item.location + ' · ' + item.kva_rating + '</span></div>' +
      '</a>'
    );
  }

  function packageCard(pkg, i) {
    var includes = (pkg.includes || []).slice(0, 4).map(function (item) {
      return '<li><svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round"><path d="M4 12l5 5L20 6"/></svg>' + item + '</li>';
    }).join('');
    var hasWith = !!pkg.price_with_panel_naira;
    var defaultMode = hasWith ? 'with' : 'without';
    return (
      '<div class="package-card spotlight reveal reveal-delay-' + (i % 4 + 1) + (pkg.is_popular ? ' popular' : '') + '"' +
      ' data-price-with="' + pkg.formatted_price_with_panel + '" data-price-without="' + pkg.formatted_price_without_panel + '"' +
      ' data-panel-spec="' + (pkg.panel_spec || '') + '" data-mode="' + defaultMode + '">' +
      (pkg.is_popular ? '<span class="package-badge">Most popular</span>' : '') +
      '  <div class="package-top-row"><div class="package-kva">' + pkg.kva_rating + '</div><span class="battery-tag">' + pkg.battery_type + '</span></div>' +
      '  <h3>' + pkg.name + '</h3><p class="tagline">' + (pkg.tagline || '') + '</p>' +
      '  <div class="price-toggle" role="group" aria-label="Price with or without solar panels">' +
      '    <button type="button" class="price-toggle-btn' + (defaultMode === 'with' ? ' active' : '') + '" data-mode="with">With panel</button>' +
      '    <button type="button" class="price-toggle-btn' + (defaultMode === 'without' ? ' active' : '') + '" data-mode="without">Without panel</button>' +
      '  </div>' +
      '  <div class="package-price">' + (defaultMode === 'with' ? pkg.formatted_price_with_panel : pkg.formatted_price_without_panel) + '</div>' +
      '  <div class="package-note package-panel-spec"' + (defaultMode === 'without' || !pkg.panel_spec ? ' style="visibility:hidden;"' : '') + '>' + (pkg.panel_spec || '') + '</div>' +
      '  <ul class="package-includes">' + includes + '</ul>' +
      '  <a href="quote.html" class="btn btn-outline btn-sm magnetic" style="width:100%;">Get this package</a>' +
      '</div>'
    );
  }

  function wirePackageToggles(scope) {
    scope.querySelectorAll('.package-card').forEach(function (card) {
      card.querySelectorAll('.price-toggle-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var mode = btn.dataset.mode;
          card.querySelectorAll('.price-toggle-btn').forEach(function (b) { b.classList.toggle('active', b === btn); });
          card.querySelector('.package-price').textContent = mode === 'with' ? card.dataset.priceWith : card.dataset.priceWithout;
          var specEl = card.querySelector('.package-panel-spec');
          var hasSpec = card.dataset.panelSpec && mode === 'with';
          specEl.textContent = hasSpec ? card.dataset.panelSpec : '';
          specEl.style.visibility = hasSpec ? 'visible' : 'hidden';
          card.dataset.mode = mode;
        });
      });
    });
  }

  function galleryItem(item, i) {
    var arrow = '<svg class="bento-tile-arrow" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    return (
      '<a href="gallery.html?id=' + item.id + '" class="bento-tile' + (i === 0 ? ' featured' : '') + '" style="background-image:url(\'' + item.image_url + '\')">' +
      '  <div class="bento-tile-overlay"><span class="bento-tile-category">' + item.category + '</span>' +
      '    <span class="bento-tile-title">' + item.title + '</span>' +
      '    <span class="bento-tile-meta"><span>' + item.location + ' · ' + item.kva_rating + '</span>' + arrow + '</span>' +
      '  </div>' +
      '</a>'
    );
  }

  function testimonialCard(t, i) {
    var stars = Array.from({ length: t.rating || 0 }).map(function () {
      return '<svg viewBox="0 0 24 24"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3 1.2-6.8-5-4.9 6.9-1z"/></svg>';
    }).join('');
    var meta = (t.reviewer_meta || t.client_role || '');
    return (
      '<div class="testimonial-card reveal reveal-delay-' + (i % 3 + 1) + '">' +
      '  <div class="stars">' + stars + '</div><p class="testimonial-quote">"' + escapeHtml(t.quote) + '"</p>' +
      '  <div class="testimonial-author"><div class="testimonial-avatar">' + escapeHtml(t.client_name.charAt(0)) + '</div>' +
      '    <div><div class="testimonial-name">' + escapeHtml(t.client_name) + '</div><div class="testimonial-role">' + escapeHtml(meta) + '</div></div>' +
      '  </div>' +
      '</div>'
    );
  }

  document.addEventListener('DOMContentLoaded', async function () {
    var biz = await window.BTE_SHELL.mount({ activePage: 'home', onDark: true, title: null });
    document.title = biz.business_name + ' - ' + biz.business_tagline;
    document.getElementById('icon-shield').innerHTML = window.BTE_ICON('shield');
    document.getElementById('icon-headset').innerHTML = window.BTE_ICON('headset');
    document.getElementById('icon-home-phone').innerHTML = window.BTE_ICON('phone');
    document.getElementById('icon-home-email').innerHTML = window.BTE_ICON('mail');
    document.getElementById('home-address').textContent = biz.business_address;
    document.getElementById('home-phone').textContent = biz.business_phone;
    document.getElementById('home-email').textContent = biz.business_email;

    var mapFrame = document.getElementById('home-map');
    if (mapFrame) {
      // No API key needed for this embed format. Query is built from the
      // business name + address in config.py: once BUSINESS_ADDRESS has
      // a real street address (not just "Lagos, Nigeria"), the pin
      // automatically becomes accurate with no other changes needed.
      var mapQuery = encodeURIComponent(biz.business_name + ', ' + biz.business_address);
      mapFrame.src = 'https://www.google.com/maps?q=' + mapQuery + '&output=embed';
    }

    try {
      var data = await window.BTE_API.get('/home');

      document.getElementById('home-services').innerHTML =
        data.services.slice(0, 8).map(serviceCard).join('') || '<p>No services yet.</p>';

      // Marquee needs a duplicated list for the seamless CSS loop (see
      // @keyframes workMarquee, which translates exactly -50%) - but only
      // on screens where that animation actually runs. Below 640px the
      // animation is switched off in favour of a manual swipeable strip
      // (see main.css), so duplicating there would just show every
      // project twice in a row while swiping.
      var isMobileMarquee = window.matchMedia('(max-width: 640px)').matches;
      var workItems = data.gallery_items.length ? data.gallery_items : [];
      var marqueeTrack = document.getElementById('work-marquee-track');
      if (workItems.length) {
        var trackItems = isMobileMarquee ? workItems : workItems.concat(workItems);
        marqueeTrack.innerHTML = trackItems.map(workCard).join('');
      } else {
        marqueeTrack.closest('.work-marquee').style.display = 'none';
      }

      document.getElementById('home-products').innerHTML =
        data.featured_products.map(productCard).join('') || '<p>No featured products yet.</p>';

      // Curated spread for the homepage teaser (small/mid/large, both
      // battery types) rather than dumping all 12 SKUs. Full list lives
      // on packages.html.
      var previewSlugs = ['tubular-2-5kva', 'lithium-6-2kva-5kwh', 'lithium-6-2kva-15kwh', 'tubular-4-2kva'];
      var preview = previewSlugs
        .map(function (slug) { return data.packages.find(function (p) { return p.slug === slug; }); })
        .filter(Boolean);
      if (!preview.length) preview = data.packages.slice(0, 4);

      document.getElementById('home-packages').innerHTML =
        preview.map(packageCard).join('') || '<p>No packages yet.</p>';
      wirePackageToggles(document.getElementById('home-packages'));

      document.getElementById('home-gallery').innerHTML =
        data.gallery_items.map(galleryItem).join('') || '<p>No gallery items yet.</p>';

      document.getElementById('home-testimonials').innerHTML =
        data.testimonials.map(testimonialCard).join('') || '<p>No testimonials yet.</p>';
    } catch (err) {
      console.error(err);
      document.getElementById('work-marquee-track').closest('.work-marquee').style.display = 'none';
      ['home-services', 'home-products', 'home-packages', 'home-gallery', 'home-testimonials'].forEach(function (id) {
        document.getElementById(id).innerHTML = '<p>Could not load this section right now. Please refresh.</p>';
      });
    }

    window.BTE_SHELL.refreshReveal();
  });
})();
