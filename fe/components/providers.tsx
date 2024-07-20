"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
require("@solana/wallet-adapter-react-ui/styles.css");

const queryClient = new QueryClient();

export default function Providers({ children }: any) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider
        endpoint={
          process.env.NEXT_PUBLIC_RPC_URL ||
          "https://api.mainnet-beta.solana.com"
        }
      >
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
}
