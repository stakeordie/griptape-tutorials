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

  useEffect(() => {
    onAccountAvailable(() => {
      const key = viewingKeyManager.get(sscrt.at);
      if (key) {
        setViewingKey(key);
      }
    })
  }, []);

  const connect = async () => {
    await bootstrap();
  }

  const getBalance = async () => {
    const key = viewingKeyManager.get(sscrt.at);

    if (!key) return;

    const amount = await sscrt.getBalance();
    const balance = coinConvert(amount.balance.amount, 6, 'human');

    setCoins(balance);
  }

  const createViewingKey = async () => {

    setLoading(true);
    try {
      const result = await sscrt.createViewingKey();

      if (result.isEmpty()) return;

      const { create_viewing_key: { key } } = result.parse();
      viewingKeyManager.add(sscrt, key);
      setViewingKey(key);

      const currentKey = viewingKeyManager.get(sscrt.at);
      // If there is, update the viewing key using the `set`
      // function. Otherwise, add it.
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

  return (
    <>
      <h1>Hello, Griptape!</h1>
      <p>Your viewing key is: {viewingKey}</p>
      <p>Your balance is: {coins}</p>
      <button onClick={() => { connect(); }}>Connect</button>
      <button onClick={() => { createViewingKey() }}>{loading ? 'Loading...' : 'Create Viewing Key'}</button>
      <button onClick={() => { getBalance() }}>Get balance</button>
    </>
  );
}

export default App;
