<template>
  <div>
      <h1>Hello, Permits!</h1>
      <p>Is connected? {{isConnected ? "Yes" : "No"}}</p>
      <button :disabled="isConnected" @click="connect">Bootstrap</button>
      <p>You have permit?: {{isPermit ? 'Yes' : 'No'}}</p>
      <p>Your balance is: {{balance}}</p>
      <button :disabled="!isConnected" @click="createPermit">{{loading ? 'Loading...' : 'Create Permit'}}</button>
      <button :disabled="!isPermit" @click="getBalance">{{loadingBalance ? 'Loading...' : 'Get Balance'}}</button>
  </div>
</template>

<script>
import {
  coinConvert,
  bootstrap,
  onAccountAvailable,
  hasPermit,
  enablePermit
} from '@stakeordie/griptape.js';
import { sscrt } from './contracts/sscrt';

export default {
  data() {
    return {
      isPermit: '',
      loadingBalance: '',
      loading: false,
      isConnected: false
    }
  },

  mounted() {
    onAccountAvailable(() => {
      this.isPermit = hasPermit(sscrt);
      this.isConnected = true;
    })
  },

  methods: {
    async createPermit() {
      this.loading = true;

      try {
        // Execute `enablePermit` message on sscrt contract.
        // 
        await enablePermit(sscrt,['balance']);

        this.isPermit = hasPermit(sscrt);
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
      try {
        this.loadingBalance = true;
        // Do nothing if we don't have a permit.
        if (!hasPermit(sscrt)) return;
        
        // In case we have a permit, fetch the balance.
        const { balance: { amount } } = await sscrt.getBalance();
        const balance = coinConvert(amount, '6', 'human');
        this.balance = balance;
        
      } catch (error) {
        // ignore for now
      }finally{
        this.loadingBalance = false;
      }
    }
  }
}
</script>
