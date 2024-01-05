importScripts('https://www.gstatic.com/firebasejs/8.4.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.4.3/firebase-messaging.js');

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBnyxpD9iEp8cX991bNzycDieI--LOvAVk',
  authDomain: 'pn-demo-690a8.firebaseapp.com',
  projectId: 'pn-demo-690a8',
  storageBucket: 'pn-demo-690a8.appspot.com',
  messagingSenderId: '60922855940',
  appId: '1:60922855940:web:d2ab9b471daf4ea6172b51',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// If we want to handle background notification we have to add the following block of code as well
messaging.onBackgroundMessage(function (payload) {
  console.log('Background message received ', payload);

  const { orderId, orderStatus } = payload.notification.data;
  const notificationTitle = '';
  const notificationOptions = {
    body: '',
  };

  if (payload.notification.type === 'Order') {
    notificationTitle = 'Order Update';
    notificationOptions.body = `Order ${orderId} got ${orderStatus} successfully`;
  }

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('FCM notification click', event);
  event.notification.close();

  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
      })
      .then(function (clientList) {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url == '/' && 'focus' in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow('/');
      }),
  );
  return event;
});
