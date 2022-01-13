import React, { useState, useEffect } from "react";
import {
  bootstrap,
  viewingKeyManager,
  onAccountAvailable
} from '@stakeordie/griptape.js';
import { minting } from './contracts/minting';

function App() {

  var [loading, setLoading] = useState(false);
  var [loadingMint, setLoadingMint] = useState(false);
  var [loadingTokens, setLoadingTokens] = useState(false);
  var [viewingKey, setViewingKey] = useState('');
 
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

    setLoadingMint(true);
    try {
     

    } catch (e) {
      // ignore for now
    } finally {
      setLoadingMint(false);
    }

  }

  const getTokens = async () => {

    setLoadingTokens(true);
    try {
     

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

      const { create_viewing_key: { key } } = result.parse();
      viewingKeyManager.add(minting, key);
      setViewingKey(key);

    } catch (e) {
      // ignore for now
    } finally {
      setLoading(false);
    }

  }

  return (
    <>
      <h1>Hello, Griptape!</h1>
      <button onClick={() => { connect(); }}>Connect</button>
      <button onClick={() => { mint() }}>{loadingMint ? 'Loading...' : 'Mint'}</button>
      <br></br>
      <br></br>
      <button onClick={() => { getTokens() }}>{loadingTokens ? 'Loading...' : 'Get Tokens'}</button>
      <button onClick={() => { createViewingKey() }}>{loading ? 'Loading...' : 'Create Viewing Key'}</button>

    </>
  );
}

export default App;
