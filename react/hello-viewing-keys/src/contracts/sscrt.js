import {
  createContractClient,
  snip20Def
} from '@stakeordie/griptape.js';

export const sscrt = createContractClient({
  id: 'sscrt',
  at: 'secret18vd8fpwxzck93qlwghaj6arh4p7c5n8978vsyg',
  definition: snip20Def
});
  