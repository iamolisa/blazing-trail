/* Blazing Trail Engineering - quote request page renderer. */
(function () {
  function wireForm(form, endpoint, flashSlot) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var payload = Object.fromEntries(new FormData(form).entries());
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      try {
        var res = await window.BTE_API.post(endpoint, payload);
        window.BTE_SHELL.flash(flashSlot, res.message || 'Quote request sent. Thank you!', 'success');
        if (window.BTE_ANALYTICS) window.BTE_ANALYTICS.trackLead('quote_form');
        form.reset();
      } catch (err) {
        var message = (err.data && err.data.errors)
          ? Object.values(err.data.errors).join(' ')
          : (err.message || 'Something went wrong. Please try again.');
        window.BTE_SHELL.flash(flashSlot, message, 'error');
      }
      btn.textContent = original;
      btn.disabled = false;
    });
  }

  document.addEventListener('DOMContentLoaded', async function () {
    var content = document.getElementById('page-content');
    var biz = await window.BTE_SHELL.mount({ activePage: 'contact', onDark: true, title: 'Request a Quote' });

    content.innerHTML =
      '<section class="page-header" style="padding-bottom:60px;"><div class="hero-grid-overlay"></div><div class="container" style="position:relative;">' +
      '  <div class="breadcrumb"><a href="index.html">Home</a> / Request a Quote</div>' +
      '  <div class="eyebrow on-dark">Quote request</div><h1>Tell us about your project</h1>' +
      '  <p class="lead">The more detail you give us, the more accurate your first quote will be.</p>' +
      '</div></section>' +
      '<section class="section" style="padding-top:60px;"><div class="container"><div class="grid grid-2" style="gap:56px;">' +
      '  <div class="reveal" style="max-width:640px;">' +
      '    <div id="quote-flash"></div>' +
      '    <form id="quote-form">' +
      '      <div class="form-row"><div class="field"><label>Full name</label><input type="text" name="full_name" class="input" required></div><div class="field"><label>Phone</label><input type="tel" name="phone" class="input" required></div></div>' +
      '      <div class="form-row"><div class="field"><label>Email</label><input type="email" name="email" class="input"></div><div class="field"><label>City / State</label><input type="text" name="city" class="input" placeholder="e.g. Lagos"></div></div>' +
      '      <div class="field"><label>What do you need?</label><select name="interest" class="input">' +
      '        <option>Solar installation: residential</option><option>Solar installation: commercial</option><option>Solar installation: industrial</option>' +
      '        <option>Industrial panel fabrication</option><option>PLC automation</option><option>Backup power / hybrid system</option>' +
      '        <option>Energy audit</option><option>Bulk / wholesale procurement</option><option>Other</option>' +
      '      </select></div>' +
      '      <div class="field"><label>Tell us about the site</label><textarea name="message" class="input" rows="5" placeholder="Property type, appliances/loads, current power situation, timeline…"></textarea>' +
      '        <p class="hint">Not sure on load details? Try the <a href="tools.html" style="color:var(--red);">sizing calculator</a> first.</p>' +
      '      </div>' +
      '      <div class="hp-field" aria-hidden="true"><label>Website</label><input type="text" name="website" tabindex="-1" autocomplete="off"></div>' +
      '      <button type="submit" class="btn btn-primary magnetic">Submit Quote Request</button>' +
      '    </form>' +
      '  </div>' +
      '  <div class="reveal reveal-delay-1">' +
      '    <div class="card" style="padding:36px; margin-bottom:20px;"><h4 style="font-size:15px; margin-bottom:12px;">What happens next</h4>' +
      '      <div class="timeline" style="padding-left:36px;">' +
      '        <div class="timeline-item" style="padding-bottom:26px;"><span class="timeline-dot" style="left:-36px; width:20px; height:20px;"></span><p style="font-size:13.5px;">We review your request within one business day.</p></div>' +
      '        <div class="timeline-item" style="padding-bottom:26px;"><span class="timeline-dot" style="left:-36px; width:20px; height:20px;"></span><p style="font-size:13.5px;">A team member calls or WhatsApps to confirm details.</p></div>' +
      '        <div class="timeline-item"><span class="timeline-dot" style="left:-36px; width:20px; height:20px;"></span><p style="font-size:13.5px;">You receive a fixed package or custom quote.</p></div>' +
      '      </div>' +
      '    </div>' +
      '    <a href="https://wa.me/' + biz.business_whatsapp + '" target="_blank" rel="noopener" class="btn btn-outline magnetic" style="width:100%;">Prefer WhatsApp? Chat now</a>' +
      '  </div>' +
      '</div></div></section>';

    wireForm(document.getElementById('quote-form'), '/contact/quote', document.getElementById('quote-flash'));
    window.BTE_SHELL.refreshReveal();
  });
})();
