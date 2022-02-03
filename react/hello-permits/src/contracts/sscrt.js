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
  definition: extendContract(snip20Def, sscrt_permit)
});
