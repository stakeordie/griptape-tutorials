<template>
  <div>
    <h1>Hello, Griptape!</h1>
    <p>Your viewing key is: {{ viewingKey }}</p>
    <p>Your balance is: {{ balance }}</p>
    <button @click="connect">Connect</button>
    <button @click="createViewingKey">
      <span v-if="loading">Loading...</span>
      <span v-else>Create Viewing Key</span>
    </button>
    <button @click="getBalance">Get balance</button>
    <br>
    <br>
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
    }
  },

  mounted() {
    onAccountAvailable(() => {
      const key = viewingKeyManager.get(sscrt.at);
      if (key) {
        this.viewingKey = key;
      }
    });
    onAccountChange(() => {
      alert("You have changed your account, please refresh this page.");
      this.isAccountChanged = false;
    });
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
