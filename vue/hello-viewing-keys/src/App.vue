<template>
  <div>
    <h1>Hello, Viewing Keys!</h1>
    <p>Is connected? {{isConnected ? "Yes" : "No"}}</p>
    <button @click="connect">Bootstrap</button>
    <p>Your viewing key is: {{ viewingKey }}</p>
    <p>Your balance is: {{ balance }}</p>
    <button :disabled="!isConnected"  @click="createViewingKey">
      <span v-if="loading">Loading...</span>
      <span  v-else>Create Viewing Key</span>
    </button>
    <button :disabled="!viewingKey" @click="getBalance">Get balance</button>
  </div>
</template>

<script>
import {
  viewingKeyManager,
  coinConvert,
  bootstrap,
  onAccountAvailable
} from '@stakeordie/griptape.js';
import { sscrt } from './contracts/sscrt';

export default {
  data() {
    return {
      viewingKey: '',
      balance: '',
      loading: false,
      isConnected: false
    }
  },

  mounted() {
    onAccountAvailable(() => {
      this.isConnected = true;
      const key = viewingKeyManager.get(sscrt.at);
      if (key) {
        this.viewingKey = key;
      }
    });
  },

  methods: {
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
