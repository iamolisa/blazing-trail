/* Blazing Trail Engineering - testimonials page renderer.
   Featured reviews get full cards (with the owner's reply shown as a
   thread); the rest render as a compact grid so 20+ real reviews don't
   turn into a wall of identical big cards. */
(function () {
  function escapeHtml(s) {
    return (s || '').toString().replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function starsSvg(rating, small) {
    var svg = small
      ? '<svg viewBox="0 0 24 24"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3 1.2-6.8-5-4.9 6.9-1z"/></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3 1.2-6.8-5-4.9 6.9-1z"/></svg>';
    return Array.from({ length: rating || 0 }).map(function () { return svg; }).join('');
  }

  function featuredCard(t, i) {
    var reply = t.owner_reply
      ? '<div class="testimonial-reply"><div class="testimonial-reply-label">Response from Blazing Trail Engineering</div><p>' + escapeHtml(t.owner_reply) + '</p></div>'
      : '';
    var meta = [t.reviewer_meta, t.review_date_label].filter(Boolean).map(escapeHtml).join(' · ');
    return (
      '<div class="testimonial-card reveal reveal-delay-' + (i % 3 + 1) + '">' +
      '  <div class="stars">' + starsSvg(t.rating) + '</div><p class="testimonial-quote">"' + escapeHtml(t.quote) + '"</p>' +
      '  <div class="testimonial-author"><div class="testimonial-avatar">' + escapeHtml(t.client_name.charAt(0)) + '</div>' +
      '    <div><div class="testimonial-name">' + escapeHtml(t.client_name) + '</div><div class="testimonial-role">' + (meta || escapeHtml(t.client_role || '')) + '</div></div>' +
      '  </div>' +
      reply +
      '</div>'
    );
  }

  function compactCard(t) {
    var reply = t.owner_reply ? '<div class="review-compact-reply-tag">↳ Owner replied</div>' : '';
    var quote = t.quote.length > 150 ? t.quote.slice(0, 147) + '…' : t.quote;
    return (
      '<div class="review-compact reveal">' +
      '  <div class="review-compact-head"><span class="review-compact-name">' + escapeHtml(t.client_name) + '</span><span class="review-compact-date">' + escapeHtml(t.review_date_label || '') + '</span></div>' +
      '  <div class="stars">' + starsSvg(t.rating, true) + '</div>' +
      '  <p class="review-compact-quote">"' + escapeHtml(quote) + '"</p>' +
      reply +
      '</div>'
    );
  }

  document.addEventListener('DOMContentLoaded', async function () {
    var content = document.getElementById('page-content');
    await window.BTE_SHELL.mount({ activePage: 'testimonials', onDark: true, title: 'Testimonials' });

    try {
      var data = await window.BTE_API.get('/testimonials/');
      var all = data.testimonials || [];
      var featured = all.filter(function (t) { return t.is_featured; });
      if (!featured.length) featured = all.slice(0, 3);
      var rest = all.filter(function (t) { return featured.indexOf(t) === -1; });

      var featuredHtml = featured.map(featuredCard).join('') || '<p>No testimonials yet.</p>';
      var restSection = rest.length
        ? '<section class="section section-ice"><div class="container">' +
          '  <div class="section-head reveal"><div class="eyebrow">More reviews</div><h2>From Google, in clients\' own words</h2></div>' +
          '  <div class="review-compact-grid reveal">' + rest.map(compactCard).join('') + '</div>' +
          '</div></section>'
        : '';

      var submitSection =
        '<section class="section"><div class="container"><div class="grid grid-2" style="gap:56px; align-items:start;">' +
        '  <div class="reveal">' +
        '    <div class="eyebrow">Share your experience</div><h2 style="margin-bottom:16px;">Worked with us? Leave a review</h2>' +
        '    <p style="margin-bottom:0;">Submitted reviews are checked by our team before they go live. Expect it to appear within a couple of days, not instantly.</p>' +
        '  </div>' +
        '  <div class="reveal reveal-delay-1">' +
        '    <div id="testimonial-flash"></div>' +
        '    <form id="testimonial-form" class="card" style="padding:32px;">' +
        '      <div class="form-row">' +
        '        <div class="field"><label>Your name</label><input type="text" name="client_name" class="input" required></div>' +
        '        <div class="field"><label>Company / role (optional)</label><input type="text" name="client_role" class="input"></div>' +
        '      </div>' +
        '      <div class="field"><label>Rating</label><select name="rating" class="input">' +
        '        <option value="5">★★★★★ Excellent</option><option value="4">★★★★ Good</option>' +
        '        <option value="3">★★★ Average</option><option value="2">★★ Below average</option><option value="1">★ Poor</option>' +
        '      </select></div>' +
        '      <div class="field"><label>Your review</label><textarea name="quote" class="input" rows="5" maxlength="2000" required placeholder="What did we help you with, and how did it go?"></textarea></div>' +
        '      <div class="hp-field" aria-hidden="true"><label>Website</label><input type="text" name="website" tabindex="-1" autocomplete="off"></div>' +
        '      <button type="submit" class="btn btn-primary magnetic">Submit review</button>' +
        '    </form>' +
        '  </div>' +
        '</div></div></section>';

      content.innerHTML =
        '<section class="page-header"><div class="hero-grid-overlay"></div><div class="container" style="position:relative;">' +
        '  <div class="breadcrumb"><a href="index.html">Home</a> / Testimonials</div>' +
        '  <div class="eyebrow on-dark">Client feedback</div><h1>What clients say after the system is running</h1>' +
        '  <p class="lead">Real reviews from Google, newest first, including our replies.</p>' +
        '</div></section>' +
        '<section class="section"><div class="container"><div class="grid grid-3 grid-scroll">' + featuredHtml + '</div></div></section>' +
        restSection +
        submitSection +
        '<section class="section" style="padding-top:0;"><div class="container"><div class="cta-band reveal">' +
        '  <div><h2>Ready to become the next success story?</h2><p>Start with a load assessment. We\'ll take it from there.</p></div>' +
        '  <a href="quote.html" class="btn btn-primary magnetic">Request a Quote</a>' +
        '</div></div></section>';

      var form = document.getElementById('testimonial-form');
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        var payload = Object.fromEntries(new FormData(form).entries());
        var btn = form.querySelector('button[type="submit"]');
        var original = btn.textContent;
        btn.textContent = 'Sending…';
        btn.disabled = true;
        try {
          var res = await window.BTE_API.post('/testimonials/', payload);
          window.BTE_SHELL.flash(document.getElementById('testimonial-flash'), res.message || 'Thanks. Your review will appear once reviewed.', 'success');
          if (window.BTE_ANALYTICS) window.BTE_ANALYTICS.trackLead('testimonial_submission');
          form.reset();
        } catch (err) {
          var message = (err.data && err.data.message) || err.message || 'Something went wrong. Please try again.';
          window.BTE_SHELL.flash(document.getElementById('testimonial-flash'), message, 'error');
        }
        btn.textContent = original;
        btn.disabled = false;
      });
    } catch (err) {
      content.innerHTML = '<section class="section" style="padding-top:200px; text-align:center;"><div class="container"><p>Could not load testimonials right now. Please refresh.</p></div></section>';
    }

    window.BTE_SHELL.refreshReveal();
  });
})();
