/* Blazing Trail Engineering - thin fetch() wrapper around the Flask API. */
(function () {
  var BASE = window.BTE_CONFIG.API_BASE_URL;

  function tokenHeader() {
    var token = window.localStorage.getItem('bte_admin_token');
    return token ? { Authorization: 'Bearer ' + token } : {};
  }

  async function request(path, options) {
    options = options || {};
    var headers = Object.assign(
      { 'Content-Type': 'application/json' },
      options.auth ? tokenHeader() : {},
      options.headers || {}
    );
    var res;
    try {
      res = await fetch(BASE + path, {
        method: options.method || 'GET',
        headers: headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
    } catch (err) {
      throw { network: true, message: 'Could not reach the server. Check your connection and try again.' };
    }

    var data = null;
    try {
      data = await res.json();
    } catch (err) {
      /* empty/non-JSON body */
    }

    if (!res.ok) {
      var message = (data && data.message) || 'Something went wrong (' + res.status + ').';
      throw { status: res.status, data: data, message: message };
    }
    return data;
  }

  window.BTE_API = {
    get: function (path) { return request(path, { method: 'GET' }); },
    post: function (path, body) { return request(path, { method: 'POST', body: body }); },

    // Admin (token-authenticated) calls; all admin routes live under
    // /api/admin/*, so these helpers add that prefix automatically;
    // callers just pass the sub-path, e.g. adminGet('/products').
    adminGet: function (path) { return request('/admin' + path, { method: 'GET', auth: true }); },
    adminPost: function (path, body) { return request('/admin' + path, { method: 'POST', body: body, auth: true }); },
    adminPut: function (path, body) { return request('/admin' + path, { method: 'PUT', body: body, auth: true }); },
    adminPatch: function (path, body) { return request('/admin' + path, { method: 'PATCH', body: body, auth: true }); },
    adminDelete: function (path) { return request('/admin' + path, { method: 'DELETE', auth: true }); },
  };
})();
