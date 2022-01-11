<template>
  <div>
    <p>Your count is: {{ count }}</p>

    <button @click="getCount">Get count</button>
    <button @click="incrementCount">
      <span v-if="loading">Loading...</span>
      <span v-else>Increment by 1</span>
    </button>
  </div>
</template>

<script>
import { counterContract } from './contracts/counter';

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

    async incrementCount() {
      this.loading = true;
      await counterContract.incrementCount();
      this.loading = false;
    }
  }
}
</script>
