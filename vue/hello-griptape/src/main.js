import { createApp } from 'vue';
import App from './App.vue';
import {
  gripApp,
  getKeplrAccountProvider
} from '@stakeordie/griptape.js';

// Define node to connect to.
const restUrl = 'https://rpc.pulsar.scrttestnet.com';

// Get the Keplr provider.
const provider = getKeplrAccountProvider();

// Define how the app is going to be mounted.
function runApp() {
  createApp(App)
    .mount('#app');
}

// Grip (AKA initialize) your application.
gripApp(restUrl, provider, runApp);
