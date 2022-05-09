import {
  createContractClient,
  snip721Def,
  extendContract,
} from "@stakeordie/griptape.js";

const contractDef = {
  messages: {
    mintNft(
      { address, padding },
      token_id,
      owner,
      public_metadata,
      private_metadata,
      serial_number,
      royalty_info,
      memo
    ) {
      const handleMsg = {
        mint_nft: {
          token_id,
          owner: owner || address,
          public_metadata,
          private_metadata,
          serial_number,
          royalty_info,
          memo,
          padding,
        },
      };
      return {
        handleMsg,
        fees: 100000,
      };
    },
  },
};

const extendedDef = extendContract(snip721Def, contractDef);

export const minting = createContractClient({
  id: "nft",
  at: "secret1lke4emlmhztfr6pzekj3twvp8escmj3hses96v",
  codeHash: "7992d9bd60b50bec1ac3f120e399a153c3d6a446964bf17e134839d50ab2cb2f",
  definition: extendedDef,
});
