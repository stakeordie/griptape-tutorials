import React, { useState } from "react";
import { counterContract } from './contracts/counter';
import { bootstrap } from "@stakeordie/griptape.js";

function App() {

  const [count, setCount] = useState('');
  const [loading, setLoading] = useState(false);

  const getCount = async () => {
    const response = await counterContract.getCount();
    setCount(response.count);
  }

  const connect = async () => {
    await bootstrap();
  }

  const incrementCount = async () => {
    setLoading(true);
    await counterContract.incrementCount();
    setLoading(false);
    return await counterContract.incrementCount();
  }

  return (
    <>
      <h1>Hello, Griptape!</h1>
      <p>Your count is: {count}</p>
      <button onClick={() => { connect(); }}>Connect</button>
      <button onClick={() => { getCount() }}>Get count</button>
      <button onClick={() => { incrementCount() }}>{loading ? 'Loading...' : 'Increment by 1'}</button>
    </>
  );
}

export default App;
