import React, { useState } from "react";
import {
  bootstrap,
  coinConvert,
  viewingKeyManager,
} from "@stakeordie/griptape.js";
import { sscrt } from "./contracts/sscrt";

function App() {
  const [isQueryLoading, setQueryLoading] = useState(false);
  const [isMessageLoading, setMessageLoading] = useState(false);
  const [tokens, setTokens] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");

  const sendTokens = async () => {
    setMessageLoading(true);

    try {
      const theAmount = coinConvert(amount, 6, "machine");
      await sscrt.send(address, theAmount);

      setAmount("");
      setAddress("");
    } finally {
      setMessageLoading(false);
    }
  }

  const getBalance = async () => {
    const key = viewingKeyManager.get(sscrt.at);

    if (!key) return;

    setQueryLoading(true);

    try {
      const { balance: { amount } } = await sscrt.getBalance();
      const balance = coinConvert(amount, 6, "human");
      setTokens(balance);
    } finally {
      setQueryLoading(false);
    }
  }

  const createViewingKey = async () => {
    setMessageLoading(true);

    try {
      const result = await sscrt.createViewingKey();
      if (result.isEmpty()) return;
      const { create_viewing_key: { key } } = result.parse();
      viewingKeyManager.add(sscrt, key);
    } finally {
      setMessageLoading(false);
    }
  }

  return (
    <>
      <h1>Hello, Griptape!</h1>
      <p>Your balance is: {tokens}</p>
      <button onClick={() => bootstrap()}>Connect</button>
      <button onClick={() => createViewingKey()} disabled={isMessageLoading}>Create Viewing Key</button>
      <button onClick={() => getBalance()} disabled={isQueryLoading || isMessageLoading}>Update Balance</button>

      <br/>

      <input
        placeholder="Address to send to"
        onChange={(e) => setAddress(e.target.value)}
        value={address}/>

      <br/>

      <input
        placeholder="Amount to send"
        onChange={(e) => setAmount(e.target.value)}
        value={amount}/>

      <br/>

      <button onClick={() => sendTokens()} disabled={isMessageLoading}>Send tokens</button>
    </>
  );
}

export default App;
