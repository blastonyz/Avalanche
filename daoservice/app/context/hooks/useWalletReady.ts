import { useAccount, useWalletClient } from "wagmi";
import type { WalletClient } from 'viem';

/**
 * Hook that provides wallet client and account using Wagmi's built-in hooks.
 * This ensures proper integration with Wagmi's connection management.
 */
export function useWalletReady() {
    const { address: account, isConnected } = useAccount();
    const { data: walletClient } = useWalletClient();

    return { 
        walletClient: walletClient || null, 
        account: account || null,
        isConnected 
    };
}
