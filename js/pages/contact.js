/* Blazing Trail Engineering - contact page renderer. */
(function () {
  var FAQS = [
    ['Do you serve locations outside Lagos, Ogun and Imo?', 'Yes. We serve all of Nigeria, with the most focused delivery across Lagos, Ogun and Imo states.'],
    ['Can I get a fixed price, or is everything a custom quote?', 'Both. We offer fixed KVA packages with transparent pricing, and fully custom quotes for larger or industrial sites.'],
    ['Do you offer installment or financing plans?', 'Not as a standing offer, but arrangements can sometimes be worked out depending on the project. Ask us directly.'],
    ['Do you only sell products, or install too?', 'Both. We design, supply, install and maintain. We also fabricate panels and program PLC automation in-house.'],
  ];

  function faqHtml() {
    return FAQS.map(function (f) {
      return '<details class="card" style="padding:22px 26px;"><summary style="cursor:pointer; font-weight:600; font-size:14.5px;">' + f[0] + '</summary><p style="margin-top:12px; font-size:14px;">' + f[1] + '</p></details>';
    }).join('');
  }

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
        window.BTE_SHELL.flash(flashSlot, res.message || 'Message sent. Thank you!', 'success');
        if (window.BTE_ANALYTICS) window.BTE_ANALYTICS.trackLead('contact_form');
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
    var biz = await window.BTE_SHELL.mount({ activePage: 'contact', onDark: true, title: 'Contact' });

    content.innerHTML =
      '<section class="page-header"><div class="hero-grid-overlay"></div><div class="container" style="position:relative;">' +
      '  <div class="breadcrumb"><a href="index.html">Home</a> / Contact</div>' +
      '  <div class="eyebrow on-dark">Contact</div><h1>Let\'s talk about your power infrastructure</h1>' +
      '  <p class="lead">Reach us directly, or send a message and we\'ll follow up.</p>' +
      '</div></section>' +
      '<section class="section" style="padding-top:70px;"><div class="container">' +
      '  <div class="grid grid-3" style="margin-bottom:64px;">' +
      '    <a href="tel:' + biz.business_phone + '" class="card reveal"><div class="card-accent"></div><h3>Call us</h3><p>' + biz.business_phone + (biz.business_phone_secondary ? '<br>' + biz.business_phone_secondary : '') + '</p></a>' +
      '    <a href="https://wa.me/' + biz.business_whatsapp + '" target="_blank" rel="noopener" class="card reveal reveal-delay-1"><div class="card-accent"></div><h3>WhatsApp</h3><p>Fastest way to reach us. Chat directly.</p></a>' +
      '    <a href="mailto:' + biz.business_email + '" class="card reveal reveal-delay-2"><div class="card-accent"></div><h3>Email</h3><p>' + biz.business_email + '</p></a>' +
      '  </div>' +
      '  <div class="grid grid-2" style="gap:56px;">' +
      '    <div class="reveal">' +
      '      <h3 style="margin-bottom:24px;">Send a message</h3>' +
      '      <div id="contact-flash"></div>' +
      '      <form id="contact-form">' +
      '        <div class="form-row"><div class="field"><label>Full name</label><input type="text" name="full_name" class="input" required></div><div class="field"><label>Phone</label><input type="tel" name="phone" class="input" required></div></div>' +
      '        <div class="form-row"><div class="field"><label>Email</label><input type="email" name="email" class="input"></div><div class="field"><label>City</label><input type="text" name="city" class="input" placeholder="e.g. Lagos"></div></div>' +
      '        <div class="field"><label>What are you interested in?</label><select name="interest" class="input"><option>Solar installation</option><option>Industrial panel fabrication</option><option>PLC automation</option><option>Energy audit</option><option>General enquiry</option></select></div>' +
      '        <div class="field"><label>Message</label><textarea name="message" class="input" rows="5"></textarea></div>' +
      '        <div class="hp-field" aria-hidden="true"><label>Website</label><input type="text" name="website" tabindex="-1" autocomplete="off"></div>' +
      '        <button type="submit" class="btn btn-primary magnetic">Send message</button>' +
      '      </form>' +
      '    </div>' +
      '    <div class="reveal reveal-delay-1"><h3 style="margin-bottom:24px;">Frequently asked</h3><div style="display:flex; flex-direction:column; gap:14px;">' + faqHtml() + '</div></div>' +
      '  </div>' +
      '</div></section>';

    wireForm(document.getElementById('contact-form'), '/contact/', document.getElementById('contact-flash'));
    window.BTE_SHELL.refreshReveal();
  });
})();
