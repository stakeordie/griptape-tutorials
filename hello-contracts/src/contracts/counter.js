import {
    createContract
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
  
  export const counterContract = createContract({
    id: 'counter',
    at: 'secret1vk6j69amm37zkhgqgtvjkymjeee4yhxvmmyxja',
    definition: counterDef
  });
  