import { useState, useEffect } from "react";
import { getWalletClient } from "wagmi/actions";
import { wagmiConfig } from "../ConnectionProvider";
import type { WalletClient } from 'viem';


export function useWalletReady() {
    const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
    const [account, setAccount] = useState<`0x${string}` | null>(null);

    useEffect(() => {
        async function syncWallet() {
            try {
                const walletClient = await getWalletClient(wagmiConfig);
                if (!walletClient) return;
                const addresses = await walletClient.getAddresses();
                setWalletClient(walletClient);
                setAccount(addresses[0]);
            } catch (err) {
                console.warn('Wallet sync failed:', err);
                setWalletClient(null);
                setAccount(null);
            }
        }

        syncWallet();

        window.ethereum?.on('accountsChanged', syncWallet);
        window.ethereum?.on('disconnect', () => {
            setWalletClient(null);
            setAccount(null);
        });

        return () => {
            window.ethereum?.removeListener('accountsChanged', syncWallet);
            window.ethereum?.removeListener('disconnect', () => { });
        };
    }, []);

    return { walletClient, account };
}
