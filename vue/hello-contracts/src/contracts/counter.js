import {
  createContractClient
} from '@stakeordie/griptape.js';

const counterDef = {
  messages: {
    incrementCount() {
      const handleMsg = {
        increment: {}
      };
      return { handleMsg };
    }
  },

  queries: {
    getCount() {
      return { get_count: {} };
    }
  }
};

export const counterContract = createContractClient({
  id: 'counter',
  at: 'secret1vk6j69amm37zkhgqgtvjkymjeee4yhxvmmyxja',
  codeHash: '7c3953a54b7a37326aaa66458390d4f5c48bf5fc2d3fd18cea31ec319744e305',
  definition: counterDef
});
