import {
  createContract,
  snip721Def,
  extendContract
} from '@stakeordie/griptape.js';

const def = {
  messages:{
    mintNft(){
      const handleMsg = {};
      return {handleMsg};
    },
    getTokens(){
      const handleMsg = {};
      return {handleMsg};
    },
    getNftDossier(){
      const handleMsg = {};
      return {handleMsg};
    }
  }
}

const definition = extendContract(snip721Def, def);

export const minting = createContract({
  id: 'nft',
  at: 'secret1kdvrmklgrx4m7pdmlwrf6nhjx98wyttmxj908l',
  definition: snip721Def
});
  