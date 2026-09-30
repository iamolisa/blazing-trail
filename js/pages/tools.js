/* Blazing Trail Engineering - sizing tools page.
   Calculator collects appliance quantity + hours-of-use per time block
   (morning/afternoon/evening/night) rather than a single flat "backup
   hours" slider, so two very different usage patterns (someone who only
   needs power in the evening vs. someone running everything all day)
   don't get sized identically. The actual math + package matching runs
   server-side (see backend app/core/solar_sizing.py) since matching
   against real package pricing needs the database anyway - see that
   file's docstring for the full method. */
(function () {
  var APPLIANCE_LABELS = {
    bulbs: 'Energy-saving bulbs',
    fan: 'Ceiling / standing fans',
    fridge: 'Refrigerator',
    tv: 'Television',
    ac_1hp: '1HP Air Conditioner',
    ac_1_5hp: '1.5HP Air Conditioner',
    washing_machine: 'Washing machine',
    freezer: 'Freezer',
    pumping_machine: 'Water pumping machine',
    iron: 'Electric iron',
  };

  // [quantity, morning, afternoon, evening, night] - a fridge-like
  // always-on default for continuous appliances, lighter/evening-biased
  // defaults for things people mostly use after work.
  var APPLIANCE_DEFAULTS = {
    bulbs: [6, 0, 0, 3, 4],
    fan: [3, 2, 3, 3, 6],
    fridge: [1, 6, 5, 4, 9],
    tv: [1, 0, 2, 3, 1],
    ac_1hp: [0, 0, 0, 4, 6],
    ac_1_5hp: [0, 0, 0, 4, 6],
    washing_machine: [0, 1, 0, 0, 0],
    freezer: [0, 6, 5, 4, 9],
    pumping_machine: [0, 1, 1, 0, 0],
    iron: [0, 0, 1, 0, 0],
  };

  var BLOCK_KEYS = ['morning', 'afternoon', 'evening', 'night'];

  function applianceRowHtml(key, defaults) {
    var label = APPLIANCE_LABELS[key] || key;
    return (
      '<tr data-appliance-row="' + key + '">' +
      '  <td class="calc-appliance-name">' + label + '</td>' +
      '  <td><input type="number" min="0" max="30" value="' + defaults[0] + '" class="input calc-input" data-field="quantity"></td>' +
      '  <td><input type="number" min="0" max="6" step="0.5" value="' + defaults[1] + '" class="input calc-input" data-field="morning"></td>' +
      '  <td><input type="number" min="0" max="5" step="0.5" value="' + defaults[2] + '" class="input calc-input" data-field="afternoon"></td>' +
      '  <td><input type="number" min="0" max="4" step="0.5" value="' + defaults[3] + '" class="input calc-input" data-field="evening"></td>' +
      '  <td><input type="number" min="0" max="9" step="0.5" value="' + defaults[4] + '" class="input calc-input" data-field="night"></td>' +
      '</tr>'
    );
  }

  var applianceRowsHtml = Object.keys(APPLIANCE_LABELS).map(function (key) {
    return applianceRowHtml(key, APPLIANCE_DEFAULTS[key]);
  }).join('');

  var STATIC_HTML =
    '<section class="page-header"><div class="hero-grid-overlay"></div><div class="container" style="position:relative;">' +
    '  <div class="breadcrumb"><a href="index.html">Home</a> / Tools</div>' +
    '  <div class="eyebrow on-dark">Sizing tools</div><h1>Work out roughly what you need, before you talk pricing</h1>' +
    '  <p class="lead">Tell us when you actually use each appliance, not just how many you have. Someone who only needs power in the evening needs a very different system from someone running everything all day, and this tool sizes for that difference instead of assuming the worst case.</p>' +
    '</div></section>' +
    '<section class="section" style="padding-top:70px;"><div class="container"><div class="grid grid-2" style="gap:56px; align-items:flex-start;">' +
    '  <div class="card reveal" style="padding:40px;">' +
    '    <h3 style="margin-bottom:6px;">Solar Sizing Calculator</h3>' +
    '    <p style="font-size:13.5px; margin-bottom:10px;">Set how many of each appliance you have, and roughly how many hours you use them within each part of the day.</p>' +
    '    <p style="font-size:12.5px; color:var(--steel-light); margin-bottom:24px;">Morning 6am-12pm (max 6h) &middot; Afternoon 12-5pm (max 5h) &middot; Evening 5-9pm (max 4h) &middot; Night 9pm-6am (max 9h). Evening and night hours are the ones your battery has to cover alone, since there is no sunlight then.</p>' +
    '    <div style="overflow-x:auto; margin-bottom:26px;">' +
    '      <table class="calc-table" style="width:100%; border-collapse:collapse; min-width:560px;">' +
    '        <thead><tr style="text-align:left;">' +
    '          <th style="padding:0 8px 10px 0; font-size:11.5px; color:var(--steel-light); font-family:var(--font-mono); text-transform:uppercase; letter-spacing:0.04em;">Appliance</th>' +
    '          <th style="padding:0 6px 10px; font-size:11.5px; color:var(--steel-light); font-family:var(--font-mono); text-transform:uppercase;">Qty</th>' +
    '          <th style="padding:0 6px 10px; font-size:11.5px; color:var(--steel-light); font-family:var(--font-mono); text-transform:uppercase;">Morning</th>' +
    '          <th style="padding:0 6px 10px; font-size:11.5px; color:var(--steel-light); font-family:var(--font-mono); text-transform:uppercase;">Afternoon</th>' +
    '          <th style="padding:0 6px 10px; font-size:11.5px; color:var(--steel-light); font-family:var(--font-mono); text-transform:uppercase;">Evening</th>' +
    '          <th style="padding:0 6px 10px; font-size:11.5px; color:var(--steel-light); font-family:var(--font-mono); text-transform:uppercase;">Night</th>' +
    '        </tr></thead>' +
    '        <tbody id="calc-appliance-body">' + applianceRowsHtml + '</tbody>' +
    '      </table>' +
    '    </div>' +
    '    <div class="form-row">' +
    '      <div class="field"><label>Battery type</label>' +
    '        <select id="calc-battery-type" class="input">' +
    '          <option value="tubular" selected>Tubular (budget-friendly)</option>' +
    '          <option value="lithium">Lithium (deeper discharge, smaller bank)</option>' +
    '        </select>' +
    '      </div>' +
    '      <div class="field"><label>Backup autonomy</label>' +
    '        <select id="calc-autonomy-days" class="input">' +
    '          <option value="1" selected>1 day (typical, some grid backup)</option>' +
    '          <option value="2">2 days</option>' +
    '          <option value="3">3 days (relying mainly on solar)</option>' +
    '        </select>' +
    '      </div>' +
    '    </div>' +
    '    <button type="button" id="calc-submit-btn" class="btn btn-primary magnetic" style="width:100%; margin-top:6px;">Calculate my system</button>' +
    '    <div id="calc-error" style="margin-top:16px;"></div>' +
    '  </div>' +
    '  <div class="reveal reveal-delay-1 sticky-aside">' +
    '    <div class="card" style="padding:40px; margin-bottom:24px;"><div class="eyebrow" style="margin-bottom:20px;">Your estimate</div><div id="calculator-result"></div></div>' +
    '    <div class="card" id="calc-lead-card" style="padding:32px; display:none;"><h4 style="font-size:15px; margin-bottom:16px;">Get this estimate sent to our team</h4>' +
    '      <form id="calculator-lead-form">' +
    '        <div class="field"><input type="text" name="full_name" class="input" placeholder="Full name" required></div>' +
    '        <div class="field"><input type="tel" name="phone" class="input" placeholder="Phone number" required></div>' +
    '        <div class="hp-field" aria-hidden="true"><label>Website</label><input type="text" name="website" tabindex="-1" autocomplete="off"></div>' +
    '        <button type="submit" class="btn btn-primary magnetic" style="width:100%;">Send my estimate</button>' +
    '      </form>' +
    '    </div>' +
    '  </div>' +
    '</div></div></section>' +
    '<section class="section section-ice"><div class="container"><div class="grid grid-2" style="gap:56px; align-items:flex-start;">' +
    '  <div class="reveal">' +
    '    <div class="card-accent"></div>' +
    '    <h2 style="margin-bottom:14px;">Financing &amp; Installment Advisor</h2>' +
    '    <p style="margin-bottom:16px;">Tell it your budget, timeline, or what you want to run, and it will recommend a package and a rough monthly breakdown, grounded in our real current pricing, not guesses.</p>' +
    '    <p style="font-size:13px; color:var(--steel-light);">Installment arrangements are considered case-by-case, not a standing offer. This tool gives you a starting point, our team confirms the real terms.</p>' +
    '  </div>' +
    '  <div class="reveal reveal-delay-1">' +
    '    <div class="card" style="padding:32px;">' +
    '      <form id="financing-form">' +
    '        <div class="field"><label>Describe your situation</label><textarea name="message" class="input" rows="4" maxlength="800" required placeholder="e.g. I run a small shop, want to cover 2 fridges, lights and a fan, and would like to spread the cost over 6 months."></textarea></div>' +
    '        <div class="field"><label>Phone number (optional, so our team can follow up)</label><input type="tel" name="phone" class="input" placeholder="For a callback about real terms"></div>' +
    '        <div class="hp-field" aria-hidden="true"><label>Website</label><input type="text" name="website" tabindex="-1" autocomplete="off"></div>' +
    '        <button type="submit" class="btn btn-primary magnetic" style="width:100%;">Get a recommendation</button>' +
    '      </form>' +
    '      <div id="financing-result" style="margin-top:22px;"></div>' +
    '    </div>' +
    '  </div>' +
    '</div></div></section>';

  function readAppliances() {
    var rows = document.querySelectorAll('[data-appliance-row]');
    var appliances = [];
    rows.forEach(function (row) {
      var key = row.dataset.applianceRow;
      var quantity = parseInt(row.querySelector('[data-field="quantity"]').value, 10) || 0;
      var hours = {};
      BLOCK_KEYS.forEach(function (block) {
        hours[block] = parseFloat(row.querySelector('[data-field="' + block + '"]').value) || 0;
      });
      appliances.push({ key: key, quantity: quantity, hours: hours });
    });
    return appliances;
  }

  function formatWattHoursAsKwh(wh) {
    return (wh / 1000).toFixed(1);
  }

  function priceRangeText(priceRange) {
    if (!priceRange) return 'Request quote';
    return '\u20a6' + priceRange.low.toLocaleString() + ' \u2013 \u20a6' + priceRange.high.toLocaleString();
  }

  function packageBlockHtml(pkg) {
    var includesHtml = (pkg.includes || []).slice(0, 5).map(function (line) {
      return '<li style="font-size:13px; padding:3px 0; color:var(--steel);">' + line + '</li>';
    }).join('');
    var panelNote = pkg.price_includes_panels ? '' :
      '<p style="font-size:12px; color:var(--steel-light); margin-top:6px;">Panels priced separately for this tier.</p>';
    var batteryNote = pkg.battery_capacity_unconfirmed ?
      '<p style="font-size:12px; color:var(--steel-light); margin-top:4px;">Exact battery capacity for this tier is confirmed with our team based on your evening/night load.</p>' : '';
    return (
      '<div style="border:1px solid var(--line); border-radius:var(--radius-md); padding:22px; flex:1; min-width:220px;">' +
      '  <div style="font-family:var(--font-mono); font-size:11px; color:var(--red); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px;">' + (pkg.kva_rating || '') + '</div>' +
      '  <h4 style="font-size:16.5px; margin-bottom:6px;">' + pkg.name + '</h4>' +
      '  <div style="font-family:var(--font-display); font-size:20px; font-weight:600; margin-bottom:10px;">' + priceRangeText(pkg.price_range) + '</div>' +
      '  <ul style="list-style:none; padding:0; margin:0 0 6px;">' + includesHtml + '</ul>' +
      panelNote + batteryNote +
      '</div>'
    );
  }

  function renderResult(data) {
    var box = document.getElementById('calculator-result');
    var r = data.result;
    var match = data.match;

    var numbersHtml =
      '<div class="grid grid-3" style="gap:14px; margin-bottom:26px;">' +
      '  <div class="stat-block" style="border-top-color:var(--line);"><div class="stat-number" style="font-size:26px;">' + r.recommended_kva + '<span class="unit">kVA</span></div><div class="stat-label">Inverter</div></div>' +
      '  <div class="stat-block" style="border-top-color:var(--line);"><div class="stat-number" style="font-size:26px;">' + r.battery_kwh_required + '<span class="unit">kWh</span></div><div class="stat-label">Battery (' + r.battery_type + ')</div></div>' +
      '  <div class="stat-block" style="border-top-color:var(--line);"><div class="stat-number" style="font-size:26px;">' + r.panel_count_suggested + '<span class="unit">&times;</span></div><div class="stat-label">350W panels</div></div>' +
      '</div>' +
      '<p style="font-size:13px; margin-bottom:24px;">Daily use: ' + formatWattHoursAsKwh(r.total_daily_wh) + 'kWh &middot; evening/night (battery-only): ' + formatWattHoursAsKwh(r.evening_night_wh) + 'kWh &middot; busiest window: ' + r.peak_block + '. This is an estimate; our team confirms exact sizing during a site load assessment.</p>';

    var matchHtml = '';
    if (match.type === 'single') {
      matchHtml =
        '<div class="eyebrow" style="margin-bottom:14px;">Closest package</div>' +
        '<div style="display:flex; gap:16px; flex-wrap:wrap;">' + packageBlockHtml(match.packages[0]) + '</div>';
    } else if (match.type === 'compare') {
      matchHtml =
        '<div class="eyebrow" style="margin-bottom:6px;">Your needs sit between two packages</div>' +
        '<p style="font-size:13px; margin-bottom:14px;">The smaller tier doesn\'t quite cover this load; the larger one does, with some headroom to spare. Compare the trade-off:</p>' +
        '<div style="display:flex; gap:16px; flex-wrap:wrap;">' + match.packages.map(packageBlockHtml).join('') + '</div>';
    } else {
      matchHtml =
        '<div class="flash flash-warning" role="status">Your usage needs a custom-engineered system beyond our standard packages. No price range applies here, we\'ll size and quote it directly from the numbers above.</div>';
    }

    box.innerHTML = numbersHtml + matchHtml;
    box.dataset.summaryText = data.summary_text || '';

    document.getElementById('calc-lead-card').style.display = 'block';

    var existingWaBtn = document.getElementById('calc-whatsapp-btn');
    if (existingWaBtn) existingWaBtn.remove();
    window.BTE_SHELL.getBusiness().then(function (biz) {
      var waBtn = document.createElement('a');
      waBtn.id = 'calc-whatsapp-btn';
      waBtn.target = '_blank';
      waBtn.rel = 'noopener';
      waBtn.className = 'btn magnetic';
      waBtn.style.cssText = 'width:100%; background:#25D366; color:#fff; margin-top:4px;';
      waBtn.href = 'https://wa.me/' + biz.business_whatsapp + '?text=' + encodeURIComponent(data.summary_text || '');
      waBtn.innerHTML = 'Continue on WhatsApp';
      box.parentNode.insertBefore(waBtn, box.nextSibling);
    });
  }

  function renderEmptyState() {
    var box = document.getElementById('calculator-result');
    box.innerHTML =
      '<p style="font-size:14px; color:var(--steel);">No estimate yet. Fill in your appliances on the left and click <strong>Calculate my system</strong> to see a recommended inverter, battery and panel size.</p>';
  }

  function showCalcError(message) {
    var slot = document.getElementById('calc-error');
    slot.innerHTML = '<div class="flash flash-error" role="alert" aria-live="assertive">' + message + '</div>';
  }

  function clearCalcError() {
    document.getElementById('calc-error').innerHTML = '';
  }

  function initCalculator() {
    var btn = document.getElementById('calc-submit-btn');
    if (!btn) return;
    renderEmptyState();

    btn.addEventListener('click', async function () {
      clearCalcError();
      var payload = {
        appliances: readAppliances(),
        battery_type: document.getElementById('calc-battery-type').value,
        autonomy_days: parseInt(document.getElementById('calc-autonomy-days').value, 10),
      };

      var original = btn.textContent;
      btn.textContent = 'Calculating\u2026';
      btn.disabled = true;

      try {
        var data = await window.BTE_API.post('/tools/solar-sizing', payload);
        renderResult(data);
        if (window.BTE_ANALYTICS) window.BTE_ANALYTICS.trackLead('sizing_calculator');
      } catch (err) {
        var message = (err.data && err.data.message) || err.message || 'Something went wrong, please try again.';
        showCalcError(message);
      }

      btn.textContent = original;
      btn.disabled = false;
    });

    var leadForm = document.getElementById('calculator-lead-form');
    if (leadForm) {
      leadForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        var formData = new FormData(leadForm);
        var payload = Object.fromEntries(formData.entries());
        var resultBox = document.getElementById('calculator-result');
        payload.system_summary = resultBox.dataset.summaryText || '';
        var submitBtn = leadForm.querySelector('button[type="submit"]');
        var originalLabel = submitBtn.textContent;
        submitBtn.textContent = 'Sending\u2026';
        submitBtn.disabled = true;
        try {
          await window.BTE_API.post('/tools/sizing-result', payload);
          submitBtn.textContent = "Sent, we'll be in touch";
          if (window.BTE_ANALYTICS) window.BTE_ANALYTICS.trackLead('sizing_calculator_lead');
          leadForm.querySelectorAll('input').forEach(function (i) { if (i.type !== 'hidden') i.value = ''; });
        } catch (err) {
          submitBtn.textContent = err.network ? 'Network error, try again' : 'Something went wrong, try again';
          submitBtn.disabled = false;
        }
        setTimeout(function () { submitBtn.textContent = originalLabel; submitBtn.disabled = false; }, 3500);
      });
    }
  }

  function initFinancingAdvisor() {
    var form = document.getElementById('financing-form');
    if (!form) return;
    var resultBox = document.getElementById('financing-result');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var payload = Object.fromEntries(new FormData(form).entries());
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = 'Thinking\u2026';
      btn.disabled = true;
      resultBox.innerHTML = '';

      try {
        var res = await window.BTE_API.post('/tools/financing-advice', payload);
        if (res.reply) {
          resultBox.innerHTML =
            '<div class="flash flash-success" role="status" aria-live="polite" style="white-space:pre-line;">' + res.reply + '</div>';
        }
        if (res.lead_id && window.BTE_ANALYTICS) window.BTE_ANALYTICS.trackLead('financing_advisor');
      } catch (err) {
        var status = err.status;
        var message = (err.data && err.data.message) || err.message || 'Something went wrong, please try again.';
        if (status === 503) {
          resultBox.innerHTML =
            '<div class="flash flash-warning" role="status" aria-live="polite">' + message + ' In the meantime, <a href="quote.html" style="color:inherit; text-decoration:underline;">request a quote</a> and we\'ll talk through payment options directly.</div>';
        } else if (status === 429) {
          resultBox.innerHTML = '<div class="flash flash-error" role="alert" aria-live="assertive">Too many requests, please wait a moment and try again.</div>';
        } else {
          resultBox.innerHTML = '<div class="flash flash-error" role="alert" aria-live="assertive">' + message + '</div>';
        }
      }
      btn.textContent = original;
      btn.disabled = false;
    });
  }

  document.addEventListener('DOMContentLoaded', async function () {
    var content = document.getElementById('page-content');
    await window.BTE_SHELL.mount({ activePage: 'tools', onDark: true, title: 'Sizing Tools' });
    content.innerHTML = STATIC_HTML;

    initCalculator();
    initFinancingAdvisor();
    window.BTE_SHELL.refreshReveal();
  });
})();
