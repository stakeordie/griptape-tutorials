import React, { useState, useEffect } from "react";
import {
  bootstrap,
  getAddress,
  onAccountAvailable,
  getNativeCoinBalance,
  coinConvert
} from '@stakeordie/griptape.js';

function App() {

  var [address, setAddress] = useState('');
  var [coins, setCoins] = useState(undefined);
  var [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    onAccountAvailable(() => {
      setIsConnected(true);
      setAddress(getAddress());
      getBalance();
    })
  }, []);

  const getBalance = async () => {
    var balance = await getNativeCoinBalance();
    balance = coinConvert(balance, 6, 'human');
    setCoins(balance);
  }

  return (
    <>
      <h1>Hello, Griptape!</h1>
      <p>Is connected? {isConnected ? "Yes" : "No"}</p>
      <button
        onClick={() => { bootstrap(); }}
        disabled={isConnected}>Bootstrap
      </button>
      <p>Your address is: {address}</p>
      <p>Your balance is: {coins}</p>
    </>
  );
}
export default App;
