import {
  createContract,
  snip721Def,
  extendContract
} from '@stakeordie/griptape.js';

const def = {
  messages:{
    mintNft(ctx, {name, description, image}){
      const handleMsg = {
        mint_nft: {
          owner:ctx.address,
          public_metadata: {
            extension: {
              name, 
              description,
              image
            }
          }
        }
      };
      return {handleMsg};
    }
  },
  queries:{
    getTokens({address, key}){
      return {tokens:{
        viewer: address,
        owner: address,
        viewing_key: key
      }}
    }
  }
};

const definition = extendContract(snip721Def, def);

export const minting = createContract({
  id: 'nft',
  at: 'secret1kdvrmklgrx4m7pdmlwrf6nhjx98wyttmxj908l',
  definition: definition
});
  