/* Blazing Trail Engineering - packages page renderer.
   Each system is priced two ways (with solar panels bundled, or inverter +
   battery only), rendered as a toggle on the card instead of duplicate
   cards, to keep the page scannable. */
(function () {
  function packageCard(pkg, i) {
    var includes = (pkg.includes || []).map(function (item) {
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
      '  <p style="font-size:12.5px; color:var(--steel-light); margin-bottom:22px;">Best for: ' + (pkg.best_for || '') + '</p>' +
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

  function packageGroup(title, note, pkgs, startIndex) {
    if (!pkgs.length) return '';
    var cards = pkgs.map(function (p, i) { return packageCard(p, startIndex + i); }).join('');
    return (
      '<div class="package-group reveal">' +
      '  <div class="package-group-head"><h3>' + title + '</h3>' + (note ? '<p>' + note + '</p>' : '') + '</div>' +
      '  <div class="grid grid-4">' + cards + '</div>' +
      '</div>'
    );
  }

  document.addEventListener('DOMContentLoaded', async function () {
    var content = document.getElementById('page-content');
    await window.BTE_SHELL.mount({ activePage: 'packages', onDark: true, title: 'Packages & Pricing' });

    try {
      var data = await window.BTE_API.get('/packages/');
      var lithium = data.packages.filter(function (p) { return p.battery_type === 'Lithium'; });
      var tubular = data.packages.filter(function (p) { return p.battery_type === 'Tubular'; });
      var other = data.packages.filter(function (p) { return p.battery_type !== 'Lithium' && p.battery_type !== 'Tubular'; });

      var groupsHtml =
        packageGroup('Lithium battery systems', 'Longer lifespan, more compact, deeper discharge.', lithium, 0) +
        packageGroup('Tubular battery systems', 'Proven technology, lower upfront cost.', tubular, lithium.length) +
        packageGroup('Other', '', other, lithium.length + tubular.length);

      content.innerHTML =
        '<section class="page-header"><div class="hero-grid-overlay"></div><div class="container" style="position:relative;">' +
        '  <div class="breadcrumb"><a href="index.html">Home</a> / Packages</div>' +
        '  <div class="eyebrow on-dark">Packages &amp; pricing</div><h1>Fixed packages, or a system built for your load</h1>' +
        '  <p class="lead">Every system below is priced two ways. Use the toggle on each card to compare with and without solar panels included.</p>' +
        '</div></section>' +
        '<section class="section">' +
        '  <div class="container">' +
        groupsHtml +
        '  </div>' +
        '</section>' +
        '<section class="section section-ice"><div class="container">' +
        '  <div class="section-head center reveal"><div class="eyebrow">Financing</div><h2>Flexible on installment options</h2>' +
        '  <p class="lead">We don\'t advertise standing financing plans, but installment arrangements can sometimes be worked out depending on the project. Talk to us directly.</p></div>' +
        '  <div class="text-center reveal reveal-delay-1"><a href="contact.html" class="btn btn-primary magnetic">Discuss payment options</a></div>' +
        '</div></section>';

      wirePackageToggles(content);
    } catch (err) {
      content.innerHTML = '<section class="section" style="padding-top:200px; text-align:center;"><div class="container"><p>Could not load packages right now. Please refresh.</p></div></section>';
    }

    window.BTE_SHELL.refreshReveal();
  });
})();
