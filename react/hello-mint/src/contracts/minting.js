import {
  createContractClient,
  snip721Def
} from '@stakeordie/griptape.js';


export const minting = createContractClient({
  id: 'nft',
  at: 'secret1lke4emlmhztfr6pzekj3twvp8escmj3hses96v',
  definition: snip721Def
});
  