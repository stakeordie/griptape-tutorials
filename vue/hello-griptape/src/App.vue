<template>
  <div>
    <h1>Hello, Griptape!</h1>
    <p>Is connected? {{isConnected ? "Yes" : "No"}}</p>
    <button @click="connect">Connect</button>
    <p>Your address is: {{ address }}</p>
    <p>You balance is: {{ balance }}</p>
  </div>
</template>

<script>
import {
  bootstrap,
  getAddress,
  onAccountAvailable,
  getNativeCoinBalance,
  coinConvert
} from '@stakeordie/griptape.js';

export default {
  data() {
    return {
      address: '',
      balance: '',
      isConnected: false
    }
  },

  mounted() {
    onAccountAvailable(() => {
      this.isConnected=true;
      this.address = getAddress();
      this.setBalance();
    });
  },

  methods: {
    async connect() {
      await bootstrap();
    },

    async setBalance() {
      const balance = await getNativeCoinBalance();
      this.balance = coinConvert(balance, 6, 'human');
    }
  }
}
</script>

<style>
</style>
