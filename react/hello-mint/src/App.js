import React, { useState, useEffect } from "react";
import {
  bootstrap,
  viewingKeyManager,
  onAccountAvailable,
  getAddress
} from '@stakeordie/griptape.js';
import { minting } from './contracts/minting';
import TokenList from "./contracts/components/TokenList";

function App() {

  var [loading, setLoading] = useState(false);
  var [loadingMint, setLoadingMint] = useState(false);
  var [loadingTokens, setLoadingTokens] = useState(false);
  var [loadingNft, setLoadingNft] = useState(true);
  var [viewingKey, setViewingKey] = useState('');
  var [address, setAddress] = useState('');
  var [nftList, setNftList] = useState([]);


  useEffect(() => {
    onAccountAvailable(() => {
      const key = viewingKeyManager.get(minting.at);
      if (key) {
        setViewingKey(key);
      }
    })
  }, []);

  const connect = async () => {
    await bootstrap();
  }

  const mint = async () => {

    var date = Date.now();

    const data = {
      name: "Hello World",
      description: `Example ${date}`
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
      setNftList([])

      const tokens = await minting.getTokens();
      const token_list = tokens.token_list.tokens;
      getNftDetail(token_list);

    } catch (e) {
      // ignore for now
    } finally {
      setLoadingTokens(false);
    }

  }

  const getNftDetail = (token_list) => {

    setLoadingNft(true);
    try {
      token_list.forEach(async (token) => {

        const nftDossier = await minting.getNftDossier(token);

        const nftDetail = {
          name: nftDossier.nft_dossier.public_metadata.extension.name,
          description: nftDossier.nft_dossier.public_metadata.extension.description,
          image: nftDossier.nft_dossier.public_metadata.extension.image,
        }

        nftList.push(nftDetail);

      });

    } catch (e) {
      // ignore for now
    } finally {

      setLoadingNft(false);
    }
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
      console.error(e)
    } finally {

      setLoading(false);
    }

  }


  return (
    <>
      <h1>Hello, Griptape!</h1>
      <button onClick={() => { connect(); }}>Connect</button>
      <button onClick={() => { mint(); }}>{loadingMint ? 'Loading...' : 'Mint'}</button>
      <br></br>
      <br></br>
      <button onClick={() => { getTokens(); }}>{loadingTokens ? 'Loading...' : 'Get Tokens'}</button>
      <button onClick={() => { createViewingKey(); }}>{loading ? 'Loading...' : 'Create Viewing Key'}</button>
      <div>{loadingNft ? '' : <TokenList nftList={nftList} />}</div>

    </>
  );
}

export default App;
