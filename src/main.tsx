
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { WagmiConfig } from "wagmi";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import '@rainbow-me/rainbowkit/styles.css';
import './index.css';

// Optimize QueryClient for better performance and caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Optimize config for faster wallet connection
const config = getDefaultConfig({
  appName: "SkillSwap DAO",
  projectId: "981cd2dc7b658c1a1f8d29792fd0e7fa",
  chains: [mainnet, sepolia],
  ssr: false, // Disable SSR for client-side rendering
});

// Use non-strict mode for better performance in production
const renderApp = () => (
  <QueryClientProvider client={queryClient}>
    <WagmiConfig config={config}>
      <RainbowKitProvider>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </QueryClientProvider>
);

ReactDOM.createRoot(document.getElementById("root")!).render(renderApp());
