import React, { useState, useEffect } from "react";
import {
  bootstrap,
  viewingKeyManager,
  onAccountAvailable,
  coinConvert
} from '@stakeordie/griptape.js';
import { sscrt } from './contracts/sscrt';

function App() {

  var [loading, setLoading] = useState(false);
  var [coins, setCoins] = useState('');
  var [viewingKey, setViewingKey] = useState('');
  var [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const removeOnAccountAvailable = onAccountAvailable(() => {
      setIsConnected(true);
      const key = viewingKeyManager.get(sscrt.at);
      if (key) {
        setViewingKey(key);
      }
    })
    return () => {
      removeOnAccountAvailable();
    }
  }, []);

  const createViewingKey = async () => {

    setLoading(true);
    try {
      const result = await sscrt.createViewingKey();

      if (result.isEmpty()) return;

      const { create_viewing_key: { key } } = result.parse();
      viewingKeyManager.add(sscrt, key);
      setViewingKey(key);
      const currentKey = viewingKeyManager.get(sscrt.at);

      if (currentKey) {
        viewingKeyManager.set(sscrt, key);
      } else {
        viewingKeyManager.add(sscrt, key);
      }
    } catch (e) {
      // ignore for now
    } finally {
      setLoading(false);
    }

  }

  const getBalance = async () => {
    const key = viewingKeyManager.get(sscrt.at);
    if (!key) return;
    const amount = await sscrt.getBalance();
    const balance = coinConvert(amount.balance.amount, 6, 'human');
    setCoins(balance);
  }

  return (
    <>
      <h1>Hello, Viewing Keys!</h1>
      <p>Is connected? {isConnected ? "Yes" : "No"}</p>
      <button
        onClick={() => { bootstrap(); }}
        disabled={isConnected}>Bootstrap
      </button>
      <p>Your viewing key is: {viewingKey}</p>
      <p>Your balance is: {coins}</p>
      <button disabled={!isConnected} onClick={() => { createViewingKey(); }}>{loading ? 'Loading...' : 'Create Viewing Key'}</button>
      <button disabled={!viewingKey} onClick={() => { getBalance(); }}>Get balance</button>
    </>
  );
}

export default App;
