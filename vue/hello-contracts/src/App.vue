<template>
  <div>
    <h1>Hello, Griptape!</h1>
    <p>Your count is: {{ count }}</p>
    <button @click="connect">Connect</button>
    <button @click="getCount">Get count</button>
    <button @click="incrementCount">
      <span v-if="loading">Loading...</span>
      <span v-else>Increment by 1</span>
    </button>
  </div>
</template>

<script>
import { counterContract } from './contracts/counter';
import { bootstrap } from '@stakeordie/griptape.js';

export default {
  data: () => ({
    count: '',
    loading: false
  }),

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
