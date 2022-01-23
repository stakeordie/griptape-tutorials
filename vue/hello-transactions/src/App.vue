<template>
  <div>
    <h1>Hello, Transactions!</h1>
      <p>Is connected? {{ isConnected ? "Yes": "No" }}</p>
      <p>
        Has viewing key? {{ hasViewingKey ? "Yes" : "No" }}
      </p>
      <p>SNIP-20 Token Balance: {{ balance }}</p>
      <button
        @click="bootstrap"
        @disabled="isConnected"
      >
        Connect
      </button>
      <button
        @click="createViewingKey"
        @disabled="isMessageLoading || hasViewingKey || !isConnected"
        
      >
        Create Viewing Key
      </button>
      <button
        @click="getBalance"
        @disabled="isQueryLoading"
      >
        Get Balance
      </button>
      <form @submit="sendTokens">
        <input
          type="text"
          placeholder="Address to send to"
          @change="(e) => setAddress(e.target.value)"
          value={address}
        />
        <input
          type="number"
          placeholder="Amount to send"
          @change="(e) => setAmount(e.target.value)"
          value={amount}
        />
        <button @disabled="isMessageLoading">
          Send tokens
        </button>
      </form>
  </div>
</template>

<script>
import {
  bootstrap,
  onAccountAvailable,
  onViewingKeyCreated,
  viewingKeyManager,
  coinConvert
} from "@stakeordie/griptape.js";
import { sscrt } from "../contracts/sscrt";

export default {
  data: () => ({
    count: '',
    loading: false
  }),

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
  
    hasViewingKey() {
    const key = viewingKeyManager.get(sscrt.at);
    return typeof key !== "undefined";
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
    },

  async sendTokens(e) {
    e.preventDefault();

    if (!this.address || !this.amount) return;

    this.loading = true;

    try {
      const theAmount = coinConvert(this.amount, 6, "machine");
      await sscrt.send(this.address, theAmount);
      this.address = "";
      this.amount = 0;
    } finally {
      this.loading = false;
    }
  }

  }
}
</script>
