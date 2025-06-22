import React from 'react';
import { WagmiConfig } from 'wagmi';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
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

const config = getDefaultConfig({
  appName: 'SkillSwap DAO',
  projectId: '981cd2dc7b658c1a1f8d29792fd0e7fa',
  chains: [mainnet, sepolia],
  ssr: false,
});

const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
};

export default Web3Provider; 