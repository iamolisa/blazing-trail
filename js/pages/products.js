/* Blazing Trail Engineering - products index + detail renderer. */
(function () {
  function productCard(product, i) {
    var img = product.image_url ? '<img src="' + product.image_url + '" alt="' + product.name + '" loading="lazy">' : '';
    return (
      '<a href="products.html?slug=' + product.slug + '" class="product-card reveal reveal-delay-' + (i % 3 + 1) + '" data-product-name="' + product.name.toLowerCase() + '">' +
      '  <div class="product-media">' + img + '<span class="product-tag">' + (product.category ? product.category.name : 'Product') + '</span></div>' +
      '  <div class="product-body"><h3>' + product.name + '</h3><p>' + (product.short_description || '') + '</p>' +
      '    <div class="product-meta"><span>' + (product.spec_summary || '') + '</span><span class="product-price">' + product.formatted_price + '</span></div>' +
      '  </div>' +
      '</a>'
    );
  }

  function indexView(data) {
    var pills = '<a href="products.html" class="filter-pill' + (!data.active_category ? ' active' : '') + '">All</a>' +
      data.categories.map(function (c) {
        return '<a href="products.html?category=' + c.slug + '" class="filter-pill' + (data.active_category === c.slug ? ' active' : '') + '">' + c.name + '</a>';
      }).join('');

    var cards = data.products.map(productCard).join('') || '<p>No products found. Try a different category or search term.</p>';

    return (
      '<section class="page-header"><div class="hero-grid-overlay"></div><div class="container" style="position:relative;">' +
      '  <div class="breadcrumb"><a href="index.html">Home</a> / Products</div>' +
      '  <div class="eyebrow on-dark">Products</div><h1>Equipment we supply and install</h1>' +
      '  <p class="lead">Solar panels, inverters, batteries, panels and protection devices, resold and distributed from trusted manufacturers.</p>' +
      '</div></section>' +
      '<section class="section" style="padding-top:70px;"><div class="container">' +
      '  <div class="flex" style="justify-content:space-between; align-items:center; gap:20px; flex-wrap:wrap; margin-bottom:36px;">' +
      '    <div class="filter-bar" style="margin-bottom:0;">' + pills + '</div>' +
      '    <input type="search" id="product-search" class="input" placeholder="Search products…" style="max-width:240px;" value="' + (data.search_query || '') + '">' +
      '  </div>' +
      '  <div class="grid grid-3" id="product-grid">' + cards + '</div>' +
      '</div></section>' +
      '<section class="section section-ice" style="padding-top:0;"><div class="container"><div class="cta-band reveal">' +
      '  <div><h2>Buying in bulk, or need something not listed?</h2><p>We source and supply industrial electrical materials beyond this catalog. Ask us directly.</p></div>' +
      '  <a href="quote.html" class="btn btn-primary magnetic">Request a Quote</a>' +
      '</div></div></section>'
    );
  }

  function detailView(product, whatsapp) {
    var img = product.image_url ? '<img src="' + product.image_url + '" alt="' + product.name + '" style="width:100%;height:100%;object-fit:cover;">' : '';
    var descriptionHtml = (product.description || '').split('\n\n').filter(Boolean)
      .map(function (para) { return '<p style="margin-bottom:18px;">' + para + '</p>'; }).join('');
    return (
      '<section class="section" style="padding-top:150px;"><div class="container">' +
      '  <div class="breadcrumb" style="color:var(--steel-light);"><a href="index.html">Home</a> / <a href="products.html">Products</a> / ' + product.name + '</div>' +
      '  <div class="grid grid-2" style="gap:64px; margin-top:26px;">' +
      '    <div class="reveal" style="border-radius:var(--radius-lg); overflow:hidden; aspect-ratio:4/3;">' + img + '</div>' +
      '    <div class="reveal reveal-delay-1">' +
      '      <span class="badge">' + (product.category ? product.category.name : 'Product') + '</span>' +
      '      <h1 style="font-size:clamp(28px,3.6vw,38px); margin:18px 0 14px;">' + product.name + '</h1>' +
      '      <p style="font-size:16px; margin-bottom:22px;">' + (product.short_description || '') + '</p>' +
      '      <div class="flex" style="gap:28px; margin-bottom:30px; font-family:var(--font-mono); font-size:14px;">' +
      '        <div><div style="color:var(--steel-light); font-size:11.5px; margin-bottom:4px;">SPEC</div>' + (product.spec_summary || 'Not specified') + '</div>' +
      '        <div><div style="color:var(--steel-light); font-size:11.5px; margin-bottom:4px;">PRICE</div><span style="color:var(--red);">' + product.formatted_price + '</span></div>' +
      '      </div>' +
      (descriptionHtml ? '      <div style="margin-bottom:12px;">' + descriptionHtml + '</div>' : '') +
      '      <div class="flex gap-12" style="flex-wrap:wrap;">' +
      '        <a href="quote.html" class="btn btn-primary magnetic">Request a Quote</a>' +
      '        <a href="https://wa.me/' + whatsapp + '" target="_blank" rel="noopener" class="btn btn-outline magnetic">Ask on WhatsApp</a>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div></section>'
    );
  }

  function wireIndexInteractions(data) {
    var search = document.getElementById('product-search');
    if (!search) return;
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase();
      document.querySelectorAll('#product-grid [data-product-name]').forEach(function (card) {
        var match = card.getAttribute('data-product-name').indexOf(q) > -1;
        card.style.display = match ? '' : 'none';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', async function () {
    var params = new URLSearchParams(window.location.search);
    var slug = params.get('slug');
    var category = params.get('category');
    var content = document.getElementById('page-content');

    var biz = await window.BTE_SHELL.mount({ activePage: 'products', onDark: true, title: slug ? null : 'Products' });

    try {
      if (slug) {
        var data = await window.BTE_API.get('/products/' + encodeURIComponent(slug));
        document.title = data.product.name + ' - ' + biz.business_name;
        content.innerHTML = detailView(data.product, biz.business_whatsapp);
      } else {
        var query = category ? ('?category=' + encodeURIComponent(category)) : '';
        var listData = await window.BTE_API.get('/products/' + query);
        content.innerHTML = indexView(listData);
        wireIndexInteractions(listData);
      }
    } catch (err) {
      if (err.status === 404) {
        content.innerHTML = '<section class="section" style="padding-top:200px; padding-bottom:160px; text-align:center;"><div class="container"><div class="eyebrow" style="justify-content:center;">404</div><h1 style="font-size:clamp(34px,5vw,56px); margin-bottom:20px;">Product not found.</h1><a href="products.html" class="btn btn-primary magnetic">Back to products</a></div></section>';
      } else {
        content.innerHTML = '<section class="section" style="padding-top:200px; text-align:center;"><div class="container"><p>Could not load this page right now. Please refresh.</p></div></section>';
      }
    }

    window.BTE_SHELL.refreshReveal();
  });
})();
