import { createApp } from 'vue'
import App from './App.vue'
import {
  gripApp,
  getKeplrAccountProvider
} from '@stakeordie/griptape.js';

const restUrl = 'http://rpc.pulsar.griptapejs.com:9091';
const provider = getKeplrAccountProvider();
function runApp() {
  createApp(App)
    .mount('#app')
}

gripApp(restUrl, provider, runApp);
