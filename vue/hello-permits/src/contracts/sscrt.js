import {
  createContractClient,
  snip20Def,
  extendContract
} from '@stakeordie/griptape.js';

const sscrt_permit = {
  queries: {
    getBalance({ permit }) {
      const query = { balance: {} }
      return {
        with_permit: { query, permit }
      }
    }
  }
}
export const sscrt = createContractClient({
  id: 'sscrt',
  at: 'secret18vd8fpwxzck93qlwghaj6arh4p7c5n8978vsyg',
  codeHash: '9587d60b8e6b078ace12014ceeee089530b9fabcd76535d93666a6c127ad8813',
  definition: extendContract(snip20Def,sscrt_permit)
});
