import React, { useState, useEffect } from "react";
import {
  bootstrap,
  viewingKeyManager,
  onAccountAvailable,
  getAddress
} from '@stakeordie/griptape.js';
import { minting } from './contracts/minting';

function App() {

  var [loading, setLoading] = useState(false);
  var [loadingMint, setLoadingMint] = useState(false);
  var [loadingTokens, setLoadingTokens] = useState(false);
  var [viewingKey, setViewingKey] = useState('');
  var [address, setAddress] = useState('');
  var [tokenList, setTokenList] = useState([]);

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

      const tokens = await minting.getTokens();
      const token_list = tokens.token_list.tokens;
      console.log(token_list);

      setTokenList(token_list);

      const token = await minting.getNftDossier("271");

      console.log(token);

    } catch (e) {
      // ignore for now
    } finally {
      setLoadingTokens(false);
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
  function TokenList(props) {
    const tokens = props.tokens;
    const listItems = tokens.map((tokenID) =>
      <li>{tokenID}</li>
    );
    return (
      <ul>{listItems}</ul>
    );
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

      <TokenList tokens={tokenList} />

    </>
  );
}

export default App;
