import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import '@fontsource/ibm-plex-sans';
import Amplify from 'aws-amplify';
import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage } from 'firebase/messaging';
import 'focus-visible/dist/focus-visible';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { toast } from 'react-toastify';
import App from './app';
import amplifyConfig from './aws-exports';
import theme from './components/common/theme';
import { register } from './register-sw';
import reportWebVitals from './reportWebVitals';
import store from './stores';
import { setupI18n } from './utils/i18n';

initializeApp({
  apiKey: 'AIzaSyDssrJjE3ONk-jk8EGdDToTOravMDfq-0c',
  authDomain: 'spirits-27586.firebaseapp.com',
  projectId: 'spirits-27586',
  storageBucket: 'spirits-27586.appspot.com',
  messagingSenderId: '438787698235',
  appId: '1:438787698235:web:54ebf9bfc53d266af0f61e',
  measurementId: 'G-PTS357JZ4T'
});

const messaging = getMessaging();
onMessage(messaging, (payload) => {
  // console.log('Foreground message received', payload);

  let notificationText = '';
  const { orderId, orderStatus } = payload.notification.data;

  if (payload.notification.type === 'Order') {
    notificationText = `Order ${orderId} got ${orderStatus} successfully`;
  }

  toast(notificationText, {
    position: 'top-right',
    autoClose: 10000,
    // onClick: () => {
    //   navigate('/');
    // },
  });
});

Amplify.configure(amplifyConfig);

setupI18n();

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </Provider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// register service worker
register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
