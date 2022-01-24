import React, { useState, useEffect } from "react";
import { counterContract } from './contracts/counter';
import { bootstrap, onAccountAvailable } from "@stakeordie/griptape.js";

function App() {

  const [count, setCount] = useState('');
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    onAccountAvailable(() => {
      setIsConnected(true);
    })
  }, []);

  const getCount = async () => {
    const response = await counterContract.getCount();
    setCount(response.count);
  }

  const incrementCount = async () => {
    setLoading(true);
    await counterContract.incrementCount();
    setLoading(false);
    return await counterContract.incrementCount();
  }

  return (
    <>
      <h1>Hello, Transactions!</h1>
      <p>Is connected? {isConnected ? "Yes" : "No"}</p>
      <button
        onClick={() => bootstrap()}
        disabled={isConnected}>Bootstrap
      </button>
      <p>Your count is: {count}</p>
      <button onClick={() => { incrementCount(); }}>{loading ? 'Loading...' : 'Increment by 1'}</button>
      <button onClick={() => { getCount(); }}>Get count</button>

    </>
  );
}

export default App;
