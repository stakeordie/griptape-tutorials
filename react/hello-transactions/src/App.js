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
  var [loadingSend, setLoadingSend] = useState(false);
  var [viewingKey, setViewingKey] = useState('');
  var [coins, setCoins] = useState('');
  var [amount, setAmount] = useState('');
  var [address, setAddress] = useState('');

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

  const sendCoins = async () => {
    setLoadingSend(true);
    await sscrt.send(address, amount);
    setLoadingSend(false);
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

    } catch (e) {
      // ignore for now
    } finally {
      setLoading(false);
    }

  }

  return (
    <>
      <h1>Hello, Griptape!</h1>
      <p>Your balance is: {coins}</p>
      <button onClick={() => { connect(); }}>Connect</button>
      <button onClick={() => { createViewingKey() }}>{loading ? 'Loading...' : 'Create Viewing Key'}</button>
      <button onClick={() => { getBalance() }}>Update Balance</button>
      <br></br>
      <input
        placeholder="Address to send to"
        onChange={(e) => { setAddress(e.target.value) }}
        value={address}></input>
      <br></br>
      <input
        placeholder="Amount to send"
        onChange={(e) => { setAmount(e.target.value) }}
        value={amount}></input>
      <br></br>
      <button onClick={() => { sendCoins() }}>{loadingSend ? 'Loading...' : 'Send'}</button>

    </>
  );
}

export default App;
