'use client';

import { useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWalletReady } from '@/app/context/hooks/useWalletReady';

const ConnectWallet = () => {
  const { walletClient, account } = useWalletReady();

  //const { address, isConnected } = useAccount();

  const { data: balance } = useBalance({
    address: account ?? undefined,
    chainId: 43113,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // evita el render SSR desincronizado

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <ConnectButton />
      {account && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Address:</strong> {account}</p>
          <p><strong>Balance:</strong> {Number(balance)} {balance?.symbol}</p>
        </div>
      )}
      {!account && (
        <p style={{ color: 'red' }}>❌ Wallet desconectada. Reconectá para continuar.</p>
      )}

    </div>
  );
};

export default ConnectWallet;
