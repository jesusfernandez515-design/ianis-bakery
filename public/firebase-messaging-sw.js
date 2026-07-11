/* eslint-disable no-undef */

/**
 * Service Worker de Firebase Cloud Messaging
 * Ianis Bakery
 *
 * Este archivo recibe notificaciones cuando la web está cerrada,
 * minimizada o funcionando en segundo plano.
 */

importScripts(
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "REEMPLAZA_CON_LA_API_KEY_CORRECTA",
  authDomain: "ianis-bakery.firebaseapp.com",
  projectId: "ianis-bakery",
  storageBucket: "ianis-bakery.firebasestorage.app",
  messagingSenderId: "1033970694489",
  appId: "1:1033970694489:web:4c8a7bf325f558f1d7f448",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Notificación recibida:",
    payload
  );

  const notificationTitle =
    payload.notification?.title ||
    payload.data?.title ||
    "Ianis Bakery 🍪";

  const notificationBody =
    payload.notification?.body ||
    payload.data?.body ||
    "Tenemos una actualización sobre tu pedido.";

  const notificationUrl =
    payload.data?.url ||
    payload.fcmOptions?.link ||
    "/account";

  const notificationOptions = {
    body: notificationBody,
    icon: "/logo-ianis.png",
    badge: "/logo-ianis.png",
    image: payload.notification?.image || payload.data?.image,
    tag:
      payload.data?.orderId ||
      payload.data?.tag ||
      "ianis-bakery-order",
    renotify: true,
    requireInteraction:
      payload.data?.requireInteraction === "true",
    vibrate: [200, 100, 200],
    data: {
      url: notificationUrl,
      orderId: payload.data?.orderId || "",
      status: payload.data?.status || "",
      createdAt: Date.now(),
    },
    actions: [
      {
        action: "open-order",
        title: "Ver pedido",
      },
      {
        action: "open-shop",
        title: "Ver tienda",
      },
    ],
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  let destinationUrl =
    event.notification?.data?.url || "/account";

  if (event.action === "open-shop") {
    destinationUrl = "/shop";
  }

  if (event.action === "open-order") {
    destinationUrl =
      event.notification?.data?.orderId
        ? `/account?order=${encodeURIComponent(
            event.notification.data.orderId
          )}`
        : "/account";
  }

  const absoluteUrl = new URL(
    destinationUrl,
    self.location.origin
  ).href;

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        for (const client of clientList) {
          if (
            client.url.startsWith(self.location.origin) &&
            "focus" in client
          ) {
            client.navigate(absoluteUrl);
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(absoluteUrl);
        }

        return undefined;
      })
  );
});

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
