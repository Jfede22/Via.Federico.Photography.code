/* Cookie / third-party consent manager.
   Nothing optional (analytics, Google Forms, Setmore) loads until the visitor opts in. */
(function () {
  'use strict';

  var KEY = 'vfp-consent-v1';
  var gpc = !!(navigator.globalPrivacyControl);

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var c = JSON.parse(raw);
      return c && typeof c === 'object' ? c : null;
    } catch (e) { return null; }
  }

  function write(c) {
    c.ts = new Date().toISOString();
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) { /* storage blocked: choice lasts for this page view */ }
    return c;
  }

  var state = read();
  var banner = null;

  function loadAnalytics() {
    if (document.getElementById('vfp-analytics')) return;
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    var s = document.createElement('script');
    s.id = 'vfp-analytics';
    s.defer = true;
    s.src = '/_vercel/insights/script.js';
    document.head.appendChild(s);
  }

  function loadEmbeds() {
    document.querySelectorAll('iframe[data-consent-src]').forEach(function (f) {
      if (!f.getAttribute('src')) f.setAttribute('src', f.getAttribute('data-consent-src'));
      f.hidden = false;
      var ph = f.previousElementSibling;
      if (ph && ph.classList.contains('embed-placeholder')) ph.remove();
    });
  }

  function addPlaceholders() {
    document.querySelectorAll('iframe[data-consent-src]').forEach(function (f) {
      var prev = f.previousElementSibling;
      if (prev && prev.classList.contains('embed-placeholder')) return;
      f.hidden = true;
      var box = document.createElement('div');
      box.className = 'embed-placeholder';
      var p = document.createElement('p');
      p.textContent = 'This ' + (f.getAttribute('data-embed-name') || 'content') + ' is provided by a third party (' + (f.getAttribute('data-embed-vendor') || 'external service') + '), which may set cookies and receive your IP address once loaded.';
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn-dark';
      b.textContent = 'Allow and load';
      b.addEventListener('click', function () {
        state = write({ analytics: !!(state && state.analytics), embeds: true });
        apply();
      });
      box.appendChild(p);
      box.appendChild(b);
      var alt = f.getAttribute('data-fallback-href');
      if (alt) {
        var a = document.createElement('a');
        a.href = alt;
        a.rel = 'noopener noreferrer';
        if (/^https?:/.test(alt)) a.target = '_blank';
        a.textContent = f.getAttribute('data-fallback-text') || 'Open directly';
        box.appendChild(a);
      }
      f.parentNode.insertBefore(box, f);
    });
  }

  function apply() {
    if (state && state.analytics && !gpc) loadAnalytics();
    if (state && state.embeds) loadEmbeds(); else addPlaceholders();
    if (banner) { banner.remove(); banner = null; }
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function option(id, title, desc, checked, locked) {
    var row = el('label', 'cc-option');
    row.setAttribute('for', id);
    var input = el('input');
    input.type = 'checkbox';
    input.id = id;
    input.checked = checked;
    if (locked) { input.disabled = true; }
    var txt = el('span');
    txt.appendChild(el('strong', null, title));
    txt.appendChild(el('small', null, desc));
    row.appendChild(input);
    row.appendChild(txt);
    return row;
  }

  function showBanner() {
    if (banner) { banner.remove(); }
    banner = el('div', 'cc-banner');
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'false');
    banner.setAttribute('aria-labelledby', 'cc-title');

    var title = el('h2', 'cc-title', 'Your privacy choices');
    title.id = 'cc-title';
    var msg = el('p', 'cc-text', 'We use a small amount of local storage to remember this choice. With your permission we also load privacy-friendly analytics and third-party tools (Google Forms and Setmore booking). We never sell your data. ');
    var more = el('a', null, 'Cookie Policy');
    more.href = 'cookies.html';
    msg.appendChild(more);
    msg.appendChild(document.createTextNode(' · '));
    var pv = el('a', null, 'Privacy Policy');
    pv.href = 'privacy.html';
    msg.appendChild(pv);
    msg.appendChild(document.createTextNode('.'));
    if (gpc) msg.appendChild(document.createTextNode(' Your browser’s Global Privacy Control signal is honored: analytics stay off.'));

    var panel = el('div', 'cc-panel');
    panel.hidden = true;
    panel.appendChild(option('cc-necessary', 'Strictly necessary', 'Remembers your choice on this site. Always on.', true, true));
    panel.appendChild(option('cc-embeds', 'Third-party embeds', 'Google Forms contact form and Setmore booking calendar.', !!(state && state.embeds), false));
    panel.appendChild(option('cc-analytics', 'Analytics', 'Vercel Web Analytics: anonymous page-view statistics.', !!(state && state.analytics) && !gpc, gpc));

    var actions = el('div', 'cc-actions');
    var reject = el('button', 'cc-btn', 'Reject non-essential');
    var custom = el('button', 'cc-btn', 'Customize');
    var save = el('button', 'cc-btn', 'Save choices');
    save.hidden = true;
    var accept = el('button', 'cc-btn cc-primary', 'Accept all');
    [reject, custom, save, accept].forEach(function (b) { b.type = 'button'; });

    reject.addEventListener('click', function () {
      state = write({ analytics: false, embeds: false });
      apply();
    });
    accept.addEventListener('click', function () {
      state = write({ analytics: !gpc, embeds: true });
      apply();
    });
    custom.addEventListener('click', function () {
      panel.hidden = false;
      custom.hidden = true;
      save.hidden = false;
      document.getElementById('cc-embeds').focus();
    });
    save.addEventListener('click', function () {
      state = write({
        analytics: !gpc && document.getElementById('cc-analytics').checked,
        embeds: document.getElementById('cc-embeds').checked
      });
      apply();
    });

    actions.appendChild(reject);
    actions.appendChild(custom);
    actions.appendChild(save);
    actions.appendChild(accept);
    banner.appendChild(title);
    banner.appendChild(msg);
    banner.appendChild(panel);
    banner.appendChild(actions);
    document.body.appendChild(banner);
  }

  function init() {
    document.querySelectorAll('[data-cookie-settings]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); showBanner(); });
    });
    if (state) apply(); else { addPlaceholders(); showBanner(); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
