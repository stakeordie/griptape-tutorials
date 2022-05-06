import {
  createContractClient,
  snip20Def,
  extendContract
} from "@stakeordie/griptape.js";

const contractDef = {
  messages: {
    send({ padding }, recipient, amount, msg) {
      const handleMsg = {
        send: { recipient, amount, msg, padding },
      };
      return { handleMsg, fees:36000 };
    },
    createViewingKey({ padding, entropy }) {
      const handleMsg = {
        create_viewing_key: { entropy, padding },
      };
      return { handleMsg, fees:36000 };
    },
  },
};

const extendedDef = extendContract(snip20Def, contractDef);

export const sscrt = createContractClient({
  id: "sscrt",
  at: "secret18vd8fpwxzck93qlwghaj6arh4p7c5n8978vsyg",
  definition: extendedDef,
});
