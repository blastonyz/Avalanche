'use client';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit';
import {
  WagmiProvider,
  http,
} from 'wagmi';
import {
  avalancheFuji
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from '@tanstack/react-query';
import { useState, useMemo } from 'react';

// Create QueryClient singleton to prevent multiple instances during SSR/hydration
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 1000 * 60, // 1 minute
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: use singleton pattern to keep the same query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

const config = getDefaultConfig({
  appName: 'MultiDao',
  projectId: '8a670b98943fc13feaebf4def079310b', // ← crealo en https://cloud.walletconnect.com
  chains: [avalancheFuji],
  transports: {
    [avalancheFuji.id]: http('https://api.avax-test.network/ext/bc/C/rpc'),
  },
  ssr: false, 
});

export const wagmiConfig = config;

export function Web3Provider({ children }: { children: React.ReactNode }) {
  // Ensure QueryClientProvider wraps WagmiProvider (correct order for Wagmi v2)
  // Use getQueryClient to prevent hydration mismatches
  const queryClient = useMemo(() => getQueryClient(), []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}