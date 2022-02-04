<template>
  <div>
    <h1>Hello, Contracts!</h1>
      <p>Is connected? {{isConnected ? "Yes" : "No"}}</p>
      <button
        @click="connect"
        :disabled="isConnected">
        Bootstrap
      </button>
      <p>Your count is: {{count}}</p>
      <button @click="incrementCount">{{loading ? 'Loading...' : 'Increment by 1'}}</button>
      <button @click="getCount">Get count</button>
  </div>
</template>

<script>
import { counterContract } from './contracts/counter';
import { bootstrap, onAccountAvailable } from '@stakeordie/griptape.js';

export default {
  data: () => ({
    count: '',
    loading: false,
    isConnected: false,
    removeOnAccountAvailable:null
  }),
  mounted(){
    this.removeOnAccountAvailable = onAccountAvailable(()=>{
      this.isConnected= true;
    })
  },
  unmounted(){
    this.removeOnAccountAvailable()
  },
  methods: {
    async getCount() {
      const response = await counterContract.getCount();
      this.count = response.count;
    },
    async connect() {
      await bootstrap();
    },

    async incrementCount() {
      this.loading = true;
      await counterContract.incrementCount();
      this.loading = false;
    }
  }
}
</script>
