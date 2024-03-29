importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
 
workbox.precaching.precacheAndRoute([
    { url: '/index.html', revision: '1' },
    { url: '/team_matches.html', revision: '1' },
    { url: '/nav.html', revision: '1' },
    { url: '/manifest.json', revision: '1' },
    { url: '/icon512x512.png', revision: '1' },
    { url: '/icon192x192.png', revision: '1' },
    { url: '/css/materialize.min.css', revision: '1' },
    { url: '/js/materialize.min.js', revision: '1' },
    { url: '/js/jquery.js', revision: '1' },
    { url: '/js/script.js', revision: '1' },
    { url: '/js/lib/idb.js', revision: '1' },
    { url: '/js/custom.js', revision: '1' },
    { url: '/js/db.js', revision: '1' },
    { url: '/js/api.js', revision: '1' },
]);

workbox.routing.registerRoute(
  new RegExp('/pages/'),
  workbox.strategies.staleWhileRevalidate()
);

self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: 'img/notification.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});