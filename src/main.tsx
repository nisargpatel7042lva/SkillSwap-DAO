
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { WagmiConfig } from "wagmi";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";
import '@rainbow-me/rainbowkit/styles.css';
import './index.css';

// TODO: Replace with your WalletConnect Project ID from https://cloud.walletconnect.com/
const config = getDefaultConfig({
  appName: "SkillSwap DAO",
  projectId: "981cd2dc7b658c1a1f8d29792fd0e7fa",
  chains: [mainnet, sepolia],
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <RainbowKitProvider>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
