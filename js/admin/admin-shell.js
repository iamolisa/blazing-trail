/* Blazing Trail Engineering - admin shell: sidebar + auth guard.
   Every admin page except login.html calls BTE_ADMIN.guard() first, which
   redirects to login.html if there's no valid token. */
window.BTE_ADMIN = (function () {
  function getToken() { return window.localStorage.getItem('bte_admin_token'); }
  function setToken(t) { window.localStorage.setItem('bte_admin_token', t); }
  function clearToken() { window.localStorage.removeItem('bte_admin_token'); }

  function sidebarHtml(activeNav, userName) {
    return (
      '<div class="admin-sidebar">' +
      '  <div class="brand"><span class="brand-mark"><img src="../images/blazing-trail-icon.png" alt="Blazing Trail Engineering"></span>' +
      '    <span class="brand-name">Blazing Trail<span style="color:#FF7A87;">Admin</span></span></div>' +
      '  <nav class="admin-nav">' +
      '    <a href="index.html" class="' + (activeNav === 'dashboard' ? 'active' : '') + '">Dashboard</a>' +
      '    <a href="products.html" class="' + (activeNav === 'products' ? 'active' : '') + '">Products</a>' +
      '    <a href="testimonials.html" class="' + (activeNav === 'testimonials' ? 'active' : '') + '">Testimonials</a>' +
      '    <a href="leads.html" class="' + (activeNav === 'leads' ? 'active' : '') + '">Leads</a>' +
      '    <a href="settings.html" class="' + (activeNav === 'settings' ? 'active' : '') + '">Settings</a>' +
      '    <a href="../index.html">← View live site</a>' +
      '  </nav>' +
      '  <div class="admin-sidebar-footer"><div style="margin-bottom:10px;">Signed in as ' + (userName || '') + '</div><a href="#" id="admin-logout-link" style="color:#FF7A87;">Sign out</a></div>' +
      '</div>'
    );
  }

  /** Redirect to login if no token. Returns the current user on success. */
  async function guard() {
    var token = getToken();
    if (!token) {
      window.location.href = 'login.html';
      return null;
    }
    try {
      var res = await window.BTE_API.adminGet('/me');
      return res.user;
    } catch (err) {
      clearToken();
      window.location.href = 'login.html';
      return null;
    }
  }

  function mountSidebar(activeNav, user) {
    var slot = document.getElementById('admin-sidebar-slot');
    if (!slot) return;
    slot.innerHTML = sidebarHtml(activeNav, user && user.name);
    var logout = document.getElementById('admin-logout-link');
    logout.addEventListener('click', async function (e) {
      e.preventDefault();
      try { await window.BTE_API.adminPost('/logout', {}); } catch (err) { /* ignore */ }
      clearToken();
      window.location.href = 'login.html';
    });
  }

  return { getToken: getToken, setToken: setToken, clearToken: clearToken, guard: guard, mountSidebar: mountSidebar };
})();
