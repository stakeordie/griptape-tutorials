import {
  createContract,
  snip721Def,
  extendContract,
  Context
} from '@stakeordie/griptape.js';

const def = {
  messages:{
    mintNft(Context, {name, description}){
      const handleMsg = {
        mint_nft: {
          public_metadata: {
            extension: {
              name, 
              description
            }
          }
        }
      };
      return {handleMsg};
    }
  }
};

const definition = extendContract(snip721Def, def);

export const minting = createContract({
  id: 'nft',
  at: 'secret1kdvrmklgrx4m7pdmlwrf6nhjx98wyttmxj908l',
  definition: definition
});
  