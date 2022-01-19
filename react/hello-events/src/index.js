import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {
  gripApp,
  getKeplrAccountProvider
} from '@stakeordie/griptape.js';

const restUrl = 'https://api.pulsar.griptapejs.com';
const provider = getKeplrAccountProvider();
function runApp() {

    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById('root')
    );
}

gripApp(restUrl, provider, runApp);
