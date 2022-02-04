<template>
  <div>
    <h1>Hello, Transactions!</h1>
    <p>Is connected? {{ isConnected ? "Yes" : "No" }}</p>
    <p>Has viewing key? {{ hasViewingKey() ? "Yes" : "No" }}</p>
    <p>SNIP-20 Token Balance: {{ balance }}</p>
    <button @click="connect" :disabled="isConnected">Connect</button>
    <button
      @click="createViewingKey"
      :disabled="isMessageLoading || hasViewingKey() || !isConnected"
    >
      Create Viewing Key
    </button>
    <button @click="getBalance" @disabled="isQueryLoading">Get Balance</button>
    <form @submit="sendTokens">
      <input
        type="text"
        placeholder="Address to send to"
        @change="(e) => (this.address = e.target.value)"
        :value="address"
      />
      <input
        type="number"
        placeholder="Amount to send"
        @change="(e) => (this.amount = e.target.value)"
        :value="amount"
      />
      <button :disabled="isMessageLoading">Send tokens</button>
    </form>
  </div>
</template>

<script>
import {
  bootstrap,
  onAccountAvailable,
  onViewingKeyCreated,
  viewingKeyManager,
  coinConvert,
} from "@stakeordie/griptape.js";
import { sscrt } from "../contracts/sscrt";

export default {
  data: () => ({
    isConnected: false,
    isMessageLoading: false,
    isQueryLoading: false,
    balance: "",
    address: "",
    amount: "",
    removeOnAccountAvailable: null,
    removeOnViewingKeyCreated: null,
  }),

  mounted() {
    this.removeOnAccountAvailable = onAccountAvailable(() => {
      this.isConnected = true;
      this.hasViewingKey();
    });

    this.removeOnViewingKeyCreated = onViewingKeyCreated(() => {
      this.hasViewingKey();
    });
  },

  unmounted() {
    this.removeOnAccountAvailable();
    this.removeOnViewingKeyCreated();
  },

  methods: {
    async connect() {
      await bootstrap();
    },
    hasViewingKey() {
      const key = viewingKeyManager.get(sscrt.at);
      return typeof key !== "undefined";
    },
    async createViewingKey() {
      this.isMessageLoading = true;

      try {
        const result = await sscrt.createViewingKey();
        if (result.isEmpty()) return;
        const {
          create_viewing_key: { key },
        } = result.parse();
        viewingKeyManager.add(sscrt, key);
      } finally {
        this.isMessageLoading = false;
      }
    },
    async getBalance() {
      if (!this.hasViewingKey()) return;

      this.isQueryLoading = true;
      try {
        const {
          balance: { amount: result },
        } = await sscrt.getBalance();
        const amount = coinConvert(result, 6, "human");
        this.balance = amount;
      } finally {
        this.isQueryLoading = false;
      }
    },
    async sendTokens(e) {
      e.preventDefault();

      if (!this.address || !this.amount) return;

      this.isMessageLoading = true;

      try {
        const theAmount = coinConvert(this.amount, 6, "machine");
        await sscrt.send(this.address, theAmount);
        this.address = "";
        this.amount = "";
      } finally {
        this.isMessageLoading = false;
      }
    },
  },
};
</script>
