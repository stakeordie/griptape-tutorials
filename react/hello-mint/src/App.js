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
    onAccountAvailable(() => {
      setIsConnected(true);
      const key = viewingKeyManager.get(minting.at);
      if (key) {
        setViewingKey(key);
      }
    })
  }, []);

  const mint = async () => {
    var date = Date.now();
    const data = {
      name: `Example ${date}`,
      description: "test",
      image: 'https://i.picsum.photos/id/586/200/300.jpg?hmac=Ugf94OPRVzdbHxLu5sunf4PTa53u3gDVzdsh5jFCwQE'
    }
    setLoadingMint(true);
    try {
      const mint = await minting.mintNft(data);
    } catch (e) {
      // ignore for now
    } finally {
      setLoadingMint(false);
    }
  }

  const getTokens = async () => {
    setLoadingTokens(true);
    try {
      const tokens = await minting.getTokens();
      const token_list = tokens.token_list.tokens;
      await getNftDetail(token_list);
    } catch (e) {
      // ignore for now
    } finally {
      setLoadingTokens(false);
    }
  }

  const getNftDetail = async (token_list) => {
    const promises = token_list.map(token => {
      return minting.getNftDossier(token);
    });

    const result = await Promise.allSettled(promises);
    const tokens = result
      .filter(item => item.status === 'fulfilled')
      .map(item => item.value.nft_dossier)
      .map(({ public_metadata: { extension } }) => ({
        name: extension.name,
        description: extension.description,
        image: extension.image
      }));

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
