import { createApp } from 'vue';
import App from './App.vue';
import {
  gripApp,
  getKeplrAccountProvider
} from '@stakeordie/griptape.js';

const restUrl = 'https://rpc.pulsar.scrttestnet.com';
const provider = getKeplrAccountProvider();
function runApp() {
  createApp(App)
    .mount('#app');
}

gripApp(restUrl, provider, runApp);
