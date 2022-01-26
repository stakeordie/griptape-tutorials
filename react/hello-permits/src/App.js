import React, { useState, useEffect } from "react";
import {
  bootstrap,
  onAccountAvailable,
  coinConvert,
  enablePermit,
  hasPermit
} from '@stakeordie/griptape.js';
import { sscrt } from './contracts/sscrt';

function App() {

  var [loading, setLoading] = useState(false);
  var [loadingBalance, setLoadingBalance] = useState(false);
  var [isPermit, setIsPermit] = useState(false);
  var [coins, setCoins] = useState('');
  var [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    onAccountAvailable(() => {
      setIsConnected(true);
      setIsPermit(hasPermit(sscrt));
    })
  }, []);

  const getBalance = async () => {

    setLoadingBalance(true)
    if (!hasPermit(sscrt)) return;

    const amount = await sscrt.getBalance();
    const balance = coinConvert(amount.balance.amount, 6, 'human');
    setCoins(balance);
    setLoadingBalance(false);
  }

  const createPermit = async () => {

    setLoading(true);
    try {
      await enablePermit(sscrt, ["balance"]);
      setIsPermit(hasPermit(sscrt));
    } catch (e) {
      // ignore for now
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>Hello, Griptape!</h1>
      <p>Is connected? {isConnected ? "Yes" : "No"}</p>
      <button
        onClick={() => { bootstrap(); }}
        disabled={isConnected}>Bootstrap
      </button>
      <p>You have permit?: {isPermit ? 'Yes' : 'No'}</p>
      <p>Your balance is: {coins}</p>
      <button disabled={!isConnected} onClick={createPermit} >{loading ? 'Loading...' : 'Create Permit'}</button>
      <button disabled={!isPermit} onClick={getBalance} >{loadingBalance ? 'Loading...' : 'Get Balance'}</button>
    </>
  );
}
export default App;