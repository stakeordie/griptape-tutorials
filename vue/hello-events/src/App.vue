<template>
  <div>
     <h1>Hello, Events!</h1>
      <p>Is connected? {{isConnected ? "Yes" : "No"}}</p>
      <button
        @click="connect"
        :disabled="isConnected">
        Bootstrap
      </button>
      <p>Your balance is: {{balance}}</p>
      <button @click="createViewingKey">{{loading ? 'Loading...' : 'Create Viewing Key'}}</button>
      <button :hidden="isAccountChanged" @click="reload">Refresh</button>
  </div>
</template>

<script>
import {
  viewingKeyManager,
  coinConvert,
  bootstrap,
  onAccountAvailable,
  onAccountChange
} from '@stakeordie/griptape.js';
import { sscrt } from './contracts/sscrt';

export default {
  data() {
    return {
      viewingKey: '',
      balance: '',
      loading: false,
      isAccountChanged:true,
      isConnected:false,
      removeOnAccountAvailable: null,
      removeOnAccountChange: null,
    }
  },

  mounted() {
    this.removeOnAccountAvailable = onAccountAvailable(async () => {
      this.isConnected = true;
      const key = viewingKeyManager.get(sscrt.at);
      if (key) {
        this.viewingKey = key;
        await this.getBalance();
      }
    });
    this.removeOnAccountChange = onAccountChange(() => {
      alert("You have changed your account, please refresh this page.");
      this.isAccountChanged = false;
    });
  },
  unmounted(){
    this.removeOnAccountAvailable();
    this.removeOnAccountChange();
  },
  methods: {
    reload(){
      window.location.reload()
    },
    async createViewingKey() {
      this.loading = true;

      try {
        // Execute `create_viewing_key` message on sscrt contract.
        const result = await sscrt.createViewingKey();

        // Validate if response is empty.
        if (result.isEmpty()) return;

        // In case is not empty, parse the result.
        const { create_viewing_key: { key } } = result.parse();

        // Check if there's already a viewing key.
        const currentKey = viewingKeyManager.get(sscrt.at);

        // If there is, update the viewing key using the `set`
        // function. Otherwise, add it.
        if (currentKey) {
          viewingKeyManager.set(sscrt, key);
        } else {
          viewingKeyManager.add(sscrt, key);
        }

        // Update UI.
        this.viewingKey = key;
      } catch (e) {
        // ignore for now
      } finally {
        this.loading = false;
      }
    },
    async connect() {
      await bootstrap();
    },

    async getBalance() {
      // Get the viewing key from the manager.
      const key = viewingKeyManager.get(sscrt.at);

      // Do nothing if we don't have a viewing key.
      if (!key) return;

      // In case we have a viewing key, fetch the balance.
      const { balance: { amount } } = await sscrt.getBalance();
      const balance = coinConvert(amount, '6', 'human');
      this.balance = balance;
    }
  }
}
</script>
