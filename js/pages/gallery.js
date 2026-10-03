/* Blazing Trail Engineering - gallery index + detail renderer. */
(function () {
  var CATEGORIES = [
    ['all', 'All'], ['solar', 'Solar'], ['panels', 'Panels'], ['plc', 'PLC / Automation'], ['backup', 'Backup power'],
  ];
  var CATEGORY_LABEL = { solar: 'Solar', panels: 'Panels', plc: 'PLC / Automation', backup: 'Backup power' };

  function categoryLabel(cat) { return CATEGORY_LABEL[cat] || cat; }

  function galleryTile(item, i) {
    var arrow = '<svg class="bento-tile-arrow" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    return (
      '<a href="gallery.html?id=' + item.id + '" class="bento-tile reveal reveal-delay-' + (i % 4 + 1) + (i === 0 ? ' featured' : '') + '" style="background-image:url(\'' + item.image_url + '\')">' +
      '  <div class="bento-tile-overlay"><span class="bento-tile-category">' + categoryLabel(item.category) + '</span>' +
      '    <span class="bento-tile-title">' + item.title + '</span>' +
      '    <span class="bento-tile-meta"><span>' + item.location + ' · ' + item.kva_rating + '</span>' + arrow + '</span>' +
      '  </div>' +
      '</a>'
    );
  }

  function indexView() {
    var pillsHtml = CATEGORIES.map(function (c) {
      return '<button class="filter-pill' + (c[0] === 'all' ? ' active' : '') + '" data-category="' + c[0] + '">' + c[1] + '</button>';
    }).join('');

    return (
      '<section class="page-header"><div class="hero-grid-overlay"></div><div class="container" style="position:relative;">' +
      '  <div class="breadcrumb"><a href="index.html">Home</a> / Gallery</div>' +
      '  <div class="eyebrow on-dark">Project gallery</div><h1>Systems we\'ve designed, fabricated and installed</h1>' +
      '  <p class="lead">A selection of solar arrays, backup power installs and panel fabrications completed across Lagos. Click into any project for the details.</p>' +
      '</div></section>' +
      '<section class="section" style="padding-top:70px; position:relative; overflow:hidden;">' +
      '  <span class="bento-watermark" aria-hidden="true">GALLERY</span>' +
      '  <div class="container" style="position:relative; z-index:1;">' +
      '  <div class="filter-bar" id="gallery-filter">' + pillsHtml + '</div>' +
      '  <div class="gallery-bento" id="gallery-grid"></div>' +
      '  </div>' +
      '</section>' +
      '<section class="section section-ice" style="padding-top:0;"><div class="container"><div class="cta-band reveal">' +
      '  <div><h2>Want your site featured here next?</h2><p>Every project starts with a load assessment and a quote.</p></div>' +
      '  <a href="quote.html" class="btn btn-primary magnetic">Request a Quote</a>' +
      '</div></div></section>'
    );
  }

  async function loadCategory(cat, grid, pills) {
    grid.innerHTML = '<p>Loading…</p>';
    try {
      var data = await window.BTE_API.get('/gallery/?category=' + encodeURIComponent(cat));
      grid.innerHTML = data.items.map(galleryTile).join('') || '<p>No projects in this category yet.</p>';
    } catch (err) {
      grid.innerHTML = '<p>Could not load the gallery right now. Please refresh.</p>';
    }
    pills.forEach(function (p) { p.classList.toggle('active', p.getAttribute('data-category') === cat); });
    window.BTE_SHELL.refreshReveal();
  }

  function relatedTile(item, i) {
    return (
      '<a href="gallery.html?id=' + item.id + '" class="product-card reveal reveal-delay-' + (i % 3 + 1) + '">' +
      '  <div class="product-media"><img src="' + item.image_url + '" alt="' + item.title + '" loading="lazy"></div>' +
      '  <div class="product-body"><h3 style="font-size:16px;">' + item.title + '</h3>' +
      '    <div class="product-meta"><span>' + (item.kva_rating || '') + '</span></div>' +
      '  </div>' +
      '</a>'
    );
  }

  function detailView(item, related, whatsapp) {
    var highlightsHtml = (item.highlights || []).map(function (h) {
      return '<li><svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round"><path d="M4 12l5 5L20 6"/></svg>' + h + '</li>';
    }).join('');

    var descriptionHtml = (item.description || '').split('\n\n').filter(Boolean)
      .map(function (para) { return '<p style="margin-bottom:16px; font-size:15.5px;">' + para + '</p>'; }).join('');

    var relatedSection = related.length ? (
      '<section class="section section-ice"><div class="container">' +
      '  <div class="section-head reveal"><div class="eyebrow">More like this</div><h2>Other ' + categoryLabel(item.category).toLowerCase() + ' projects</h2></div>' +
      '  <div class="grid grid-3 grid-scroll">' + related.map(relatedTile).join('') + '</div>' +
      '</div></section>'
    ) : '';

    return (
      '<section class="section" style="padding-top:150px;"><div class="container">' +
      '  <div class="breadcrumb" style="color:var(--steel-light);"><a href="index.html">Home</a> / <a href="gallery.html">Gallery</a> / ' + item.title + '</div>' +
      '  <div class="grid grid-2" style="gap:64px; margin-top:26px;">' +
      '    <div class="reveal" style="border-radius:var(--radius-lg); overflow:hidden; aspect-ratio:4/3;">' +
      '      <img src="' + item.image_url + '" alt="' + item.title + '" style="width:100%;height:100%;object-fit:cover;">' +
      '    </div>' +
      '    <div class="reveal reveal-delay-1">' +
      '      <span class="badge">' + categoryLabel(item.category) + '</span>' +
      '      <h1 style="font-size:clamp(26px,3.4vw,36px); margin:18px 0 14px;">' + item.title + '</h1>' +
      '      <div class="flex" style="gap:28px; margin-bottom:26px; font-family:var(--font-mono); font-size:14px;">' +
      '        <div><div style="color:var(--steel-light); font-size:11.5px; margin-bottom:4px;">LOCATION</div>' + (item.location || 'Nigeria') + '</div>' +
      '        <div><div style="color:var(--steel-light); font-size:11.5px; margin-bottom:4px;">SYSTEM</div>' + (item.kva_rating || 'Not specified') + '</div>' +
      '      </div>' +
      descriptionHtml +
      (highlightsHtml ? '      <ul class="package-includes" style="margin-top:22px;">' + highlightsHtml + '</ul>' : '') +
      '    </div>' +
      '  </div>' +
      '  <div class="cta-band reveal" style="margin-top:64px;">' +
      '    <div><h2>Want a system like this on your site?</h2><p>Tell us about your project and we\'ll come back with next steps and pricing.</p></div>' +
      '    <div class="flex gap-12" style="flex-wrap:wrap;">' +
      '      <a href="quote.html" class="btn btn-primary magnetic">Request a Quote</a>' +
      '      <a href="https://wa.me/' + whatsapp + '" target="_blank" rel="noopener" class="btn btn-outline on-dark magnetic">Chat on WhatsApp</a>' +
      '    </div>' +
      '  </div>' +
      '</div></section>' +
      relatedSection
    );
  }

  document.addEventListener('DOMContentLoaded', async function () {
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    var content = document.getElementById('page-content');

    var biz = await window.BTE_SHELL.mount({ activePage: 'gallery', onDark: true, title: id ? null : 'Project Gallery' });

    try {
      if (id) {
        var data = await window.BTE_API.get('/gallery/' + encodeURIComponent(id));
        document.title = data.item.title + ' - ' + biz.business_name;
        content.innerHTML = detailView(data.item, data.related || [], biz.business_whatsapp);
      } else {
        content.innerHTML = indexView();
        var grid = document.getElementById('gallery-grid');
        var pills = Array.from(document.querySelectorAll('#gallery-filter .filter-pill'));
        pills.forEach(function (p) {
          p.addEventListener('click', function () { loadCategory(p.getAttribute('data-category'), grid, pills); });
        });
        var initialCategory = params.get('category') || 'all';
        if (!CATEGORIES.some(function (c) { return c[0] === initialCategory; })) initialCategory = 'all';
        await loadCategory(initialCategory, grid, pills);
      }
    } catch (err) {
      if (err.status === 404) {
        content.innerHTML = '<section class="section" style="padding-top:200px; padding-bottom:160px; text-align:center;"><div class="container"><div class="eyebrow" style="justify-content:center;">404</div><h1 style="font-size:clamp(34px,5vw,56px); margin-bottom:20px;">Project not found.</h1><a href="gallery.html" class="btn btn-primary magnetic">Back to gallery</a></div></section>';
      } else {
        content.innerHTML = '<section class="section" style="padding-top:200px; text-align:center;"><div class="container"><p>Could not load this page right now. Please refresh.</p></div></section>';
      }
    }

    window.BTE_SHELL.refreshReveal();
  });
})();
