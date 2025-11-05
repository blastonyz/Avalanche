'use client';

import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const ConnectWallet = () => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
    chainId: 43113,
  });

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <ConnectButton />

      {isConnected && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Balance:</strong> {balance?.formatted} {balance?.symbol}</p>
        </div>
      )}
    </div>
  );
}

export default ConnectWallet