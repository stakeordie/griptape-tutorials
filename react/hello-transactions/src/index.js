import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { gripApp, getKeplrAccountProvider } from "@stakeordie/griptape.js";

const restUrl = "http://rpc.pulsar.griptapejs.com:9091";
const provider = getKeplrAccountProvider();
function runApp() {
  const container = document.getElementById("root");
  const root = createRoot(container);
  root.render(<App />);
}

gripApp(restUrl, provider, runApp);
