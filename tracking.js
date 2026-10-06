/* Mantém a origem da visita até o checkout da Kiwify, integrado à UTMify. */
(function () {
  'use strict';
  // 'fbclid' vai junto para o checkout de proposito: o cookie _fbc do Meta e
  // primario do dominio, entao nao atravessa daqui para o pay.kiwify.com.br.
  // Levando o fbclid na URL, o pixel da Kiwify remonta o _fbc e o Meta
  // consegue ligar a compra ao clique no anuncio.
  var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'sck', 's1', 's2', 's3', 'fbclid'];
  var storageKey = 'rota-enem-attribution-v1';
  var incoming = new URLSearchParams(window.location.search);
  var attribution = {};
  var hasNewSource = keys.some(function (key) { return incoming.has(key); });
  if (!hasNewSource) {
    try { attribution = JSON.parse(window.sessionStorage.getItem(storageKey) || '{}') || {}; } catch (e) {}
  }
  keys.forEach(function (key) {
    if (incoming.has(key) && incoming.get(key)) attribution[key] = incoming.get(key);
  });
  try { window.sessionStorage.setItem(storageKey, JSON.stringify(attribution)); } catch (e) {}

  window.rotaTrackedUrl = function (link) {
    var url;
    try { url = new URL(link, window.location.href); } catch (e) { return link; }
    var checkout = url.protocol === 'https:' && url.hostname === 'pay.kiwify.com.br';
    var salesPage = url.origin === window.location.origin &&
      ['/', '/index.html', '/estrutura-1000', '/estrutura-1000.html'].indexOf(url.pathname) !== -1;
    if (!checkout && !salesPage) return link;
    keys.forEach(function (key) {
      if (typeof attribution[key] === 'string' && attribution[key] && !url.searchParams.has(key)) {
        url.searchParams.set(key, attribution[key]);
      }
    });
    return url.href;
  };

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href]').forEach(function (anchor) {
      var href = anchor.getAttribute('href');
      if (href && href.charAt(0) !== '#') anchor.href = window.rotaTrackedUrl(href);
    });
  });
})();
