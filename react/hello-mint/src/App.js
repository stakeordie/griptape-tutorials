import React, { useState, useEffect } from "react";
import {
  bootstrap,
  viewingKeyManager,
  onAccountAvailable
} from '@stakeordie/griptape.js';
import { minting } from './contracts/minting';
import TokenList from "./components/TokenList";

function App() {

  var [loading, setLoading] = useState(false);
  var [loadingMint, setLoadingMint] = useState(false);
  var [loadingTokens, setLoadingTokens] = useState(false);
  var [viewingKey, setViewingKey] = useState('');
  var [nftList, setNftList] = useState([]);
  var [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const removeOnAccountAvailable = onAccountAvailable(() => {
      setIsConnected(true);
      const key = viewingKeyManager.get(minting.at);
      if (key) {
        setViewingKey(key);
      }
    })
    return () => {
      removeOnAccountAvailable();
    }
  }, []);

  const mint = async () => {
    var date = Date.now();
    const extension = {
      name: `Example ${date}`,
      description: "test",
      image: 'https://i.picsum.photos/id/586/200/300.jpg?hmac=Ugf94OPRVzdbHxLu5sunf4PTa53u3gDVzdsh5jFCwQE'
    }
    setLoadingMint(true);
    try {
      await minting.mintNft(null,null,{extension});
    } catch (e) {
      // ignore for now
    } finally {
      setLoadingMint(false);
    }
  }

  const getTokens = async () => {
    setLoadingTokens(true);
    try {
      const tokens = await minting.getTokens(null,null,10,true);
      console.log(tokens)
      const token_list = tokens.token_list.tokens;
      await getNftDetail(token_list);
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingTokens(false);
    }
  }

  const getNftDetail = async (token_list) => {
    const promises = token_list.map(token => {
      return minting.getNftDossier(token);
    });

    const result = await Promise.all(promises);
    const tokens = result
      .map((ele) => {
          const { nft_dossier:{ public_metadata } }= ele
          if(!public_metadata || !public_metadata.extension){
            return {
              name:  "",
              description:  "",
              image: ""
            }
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
      });
      
    setNftList(tokens);
  }

  const createViewingKey = async () => {
    setLoading(true);
    try {
      const result = await minting.createViewingKey();

      if (result.isEmpty()) return;

      const { viewing_key: { key } } = result.parse();
      viewingKeyManager.add(minting, key);
      setViewingKey(key);
      const currentKey = viewingKeyManager.get(minting.at);

      if (currentKey) {
        viewingKeyManager.set(minting, key);
      } else {
        viewingKeyManager.add(minting, key);
      }
    } catch (e) {
      // ignore for now
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>Hello, Mint!</h1>
      <p>Is connected? {isConnected ? "Yes" : "No"}</p>
      <button
        onClick={() => { bootstrap(); }}
        disabled={isConnected}>Bootstrap
      </button>
      <button disabled={!isConnected} onClick={() => { mint(); }}>{loadingMint ? 'Loading...' : 'Mint'}</button>
      <br></br>
      <br></br>
      <button disabled={!isConnected} onClick={() => { createViewingKey(); }}>{loading ? 'Loading...' : 'Create Viewing Key'}</button>
      <button disabled={!isConnected || !viewingKey}  onClick={() => { getTokens(); }}>{loadingTokens ? 'Loading...' : 'Get Tokens'}</button>
      <br></br>
      <TokenList nftList={nftList} />
    </>
  );
}
export default App;
