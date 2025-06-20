
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { WagmiConfig } from "wagmi";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import '@rainbow-me/rainbowkit/styles.css';
import './index.css';

// Optimize QueryClient configuration for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// TODO: Replace with your WalletConnect Project ID from https://cloud.walletconnect.com/
const config = getDefaultConfig({
  appName: "SkillSwap DAO",
  projectId: "981cd2dc7b658c1a1f8d29792fd0e7fa",
  chains: [mainnet, sepolia],
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  </React.StrictMode>
);
