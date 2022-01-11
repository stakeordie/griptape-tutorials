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

  useEffect(() => {
    onAccountAvailable(() => {
      setAddress(getAddress());
      getBalance();
    })
  }, []);

  const connect = async () => {
    await bootstrap();
  }

  const getBalance = async () => {
    var balance = await getNativeCoinBalance();
    balance = coinConvert(balance, 6, 'human');
    setCoins(balance);
  }

  return (
    <>
      <h1>Hello, Griptape!</h1>
      <button onClick={() => { connect(); }}>Connect</button>
      <p>Your address is: {address}</p>
      <p>Your balance is: {coins}</p>
    </>
  );
}

export default App;
