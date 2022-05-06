import { createApp } from 'vue';
import App from './App.vue';
import {
  gripApp,
  getKeplrAccountProvider
} from '@stakeordie/griptape.js';

// Define node to connect to.
const restUrl = 'http://rpc.pulsar.griptapejs.com:9091';

// Get the Keplr provider.
const provider = getKeplrAccountProvider();

// Define how the app is going to be mounted.
function runApp() {
  createApp(App)
    .mount('#app');
}

// Grip (AKA initialize) your application.
gripApp(restUrl, provider, runApp);
