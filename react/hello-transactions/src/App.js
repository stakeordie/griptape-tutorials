import React, { useState, useEffect } from "react";
import {
  bootstrap,
  onAccountAvailable,
  onViewingKeyCreated,
  viewingKeyManager,
  coinConvert
} from "@stakeordie/griptape.js";
import { sscrt } from "./contracts/sscrt";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isMessageLoading, setMessageLoading] =
    useState(false);
  const [isQueryLoading, setQueryLoading] =
    useState(false);
  const [balance, setBalance] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    onAccountAvailable(() => {
      setIsConnected(true);
      hasViewingKey();
    });

    onViewingKeyCreated(() => {
      hasViewingKey();
    });
  }, []);

  async function createViewingKey() {
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
  
  function hasViewingKey() {
    const key = viewingKeyManager.get(sscrt.at);
    return typeof key !== "undefined";
  }

  async function getBalance() {
    if (!hasViewingKey()) return;

    setQueryLoading(true);
    try {
      const { balance: { amount: result } } =
        await sscrt.getBalance();
      const amount = coinConvert(result, 6, "human");
      setBalance(amount);
    } finally {
      setQueryLoading(false);
    }
  }

  async function sendTokens(e) {
    e.preventDefault();

    if (!address || !amount) return;

    setMessageLoading(true);

    try {
      const theAmount = coinConvert(amount, 6, "machine");
      await sscrt.send(address, theAmount);
      setAddress("");
      setAmount(0);
    } finally {
      setMessageLoading(false);
    }
  }

  return (
    <>
      <h1>Hello, Transactions!</h1>
      <p>Is connected? { isConnected ? "Yes": "No" }</p>
      <p>
        Has viewing key? { hasViewingKey() ? "Yes" : "No" }
      </p>
      <p>SNIP-20 Token Balance: { balance }</p>
      <button
        onClick={() => bootstrap()}
        disabled={isConnected}
      >
        Connect
      </button>
      <button
        onClick={() => createViewingKey()}
        disabled={
            isMessageLoading
          || hasViewingKey()
          || !isConnected
        }
      >
        Create Viewing Key
      </button>
      <button
        onClick={() => getBalance()}
        disabled={isQueryLoading}
      >
        Get Balance
      </button>
      <form onSubmit={sendTokens}>
        <input
          type="text"
          placeholder="Address to send to"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
        />
        <input
          type="number"
          placeholder="Amount to send"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
        />
        <button disabled={isMessageLoading}>
          Send tokens
        </button>
      </form>
    </>
  );
}

export default App;