<template>
  <div>
    <h1>Hello, Mint!</h1>
    <p>Is connected? {{isConnected ? "Yes" : "No"}}</p>
    <button :disabled="isConnected" @click="connect">Bootstrap</button>
    <button :disabled="!isConnected" @click="mint">{{loadingMint ? 'Loading...' : 'Mint'}}</button>
    <br />
    <br />
    <button :disabled="!isConnected" @click="createViewingKey">
      {{loading ? 'Loading...' : 'Create Viewing Key'}}
    </button>
    <button :disabled="!isConnected || !key" @click="getTokens">
      {{loadingTokens ? 'Loading...' : 'Get Tokens'}}
    </button>
    <br />
    <div v-bind:key="item.name" v-for="item in tokens">
      <div>
        <img v-if="item.image" :src="item.image" alt="[image]" />
        <img
          v-else
          src="https://i.picsum.photos/id/551/200/300.jpg?hmac=pXJCWIikY_BiqwhtawBb8x1jxclDny0522ZprZVTJiU"
          alt="[image]"
        />
      </div>
      <div>{{item.name}}</div>
    </div>
  </div>
</template>

<script>
import {
  viewingKeyManager,
  bootstrap,
  onAccountAvailable
} from '@stakeordie/griptape.js';
import { minting } from './contracts/minting';

export default {
  data() {
    return {
      loading: false,
      isConnected: false,
      loadingMint:false,
      loadingTokens:false,
      key:"",
      tokens:[],
      removeOnAccountAvailable:null
    }
  },
  mounted(){
    this.removeOnAccountAvailable = onAccountAvailable(()=>{
      this.isConnected = true;
      const key = viewingKeyManager.get(minting.at);
      if (key) {
        this.key = key;
      }
    })
  },
  unmounted(){
    this.removeOnAccountAvailable();
  },
  methods: {
    async createViewingKey  () {
      this.loading = true;
      try {
        const result = await minting.createViewingKey();

        if (result.isEmpty()) return;

        const { viewing_key: { key } } = result.parse();
        viewingKeyManager.add(minting, key);
        this.key = key;
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false;
      }
    },
    async connect() {
      await bootstrap();
    },
    async mint(){
      var date = Date.now();
      const extension = {
        name: `Example ${date}`,
        description: "test",
        image: 'https://i.picsum.photos/id/586/200/300.jpg?hmac=Ugf94OPRVzdbHxLu5sunf4PTa53u3gDVzdsh5jFCwQE'
      }
      this.loadingMint = true;
      try {
        await minting.mintNft(null,null,{extension});
      } catch (e) {
        // ignore for now
      } finally {
        this.loadingMint = false;
      }
  },
  async getTokens(){
    this.loadingTokens = true;
    try {
      //Get list of tokens' id owned
      // Exam. ["4","65","87"]
      const tokens = await minting.getTokens(null,null,10,true);
      const token_list = tokens.token_list.tokens;
      //Get details of each token
      await this.getNftDetail(token_list);
    } catch (e) {
      console.error(e)
    } finally {
      this.loadingTokens = false;
    }
  },
  async getNftDetail(token_list) {
    const promises = token_list.map(token => {
      //Query each token 
      return minting.getNftDossier(token);
    });

    const result = await Promise.all(promises);
    const def = {
      name:  "",
      description:  "",
      image: ""
    };
    
    this.tokens = result
      .map((ele) => {
        try {
          const { nft_dossier:{ public_metadata } }= ele
          if(!public_metadata || !public_metadata.extension){
            return def
          }
          const { extension } = public_metadata;
          const name = extension.name ? extension.name: "";
          const description = extension.description ? extension.description: "";
          const image = extension.image ? extension.image: "https://i.picsum.photos/id/551/200/300.jpg?hmac=pXJCWIikY_BiqwhtawBb8x1jxclDny0522ZprZVTJiU";
          return {
            name:  name,
            description:  description,
            image: image
          }          
          
        } catch (error) {
          return def
        }
      });
    }
  }
}
</script>
