'use client';

import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWalletReady } from '@/app/context/hooks/useWalletReady';

const ConnectWallet = () => {
  const { account } = useWalletReady();

  const { data: balance } = useBalance({
    address: account ?? undefined,
    chainId: 43113,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // evita el render SSR desincronizado

  const formattedBalance = balance
    ? Number(formatUnits(balance.value, balance.decimals)).toFixed(4)
    : '0.0000';

  const shortAddress = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : null;

  return (
    <div className="flex items-center gap-3">
      <div className="rounded-lg border border-cyan-300/20 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-300">
        {account ? (
          <>
            <p className="font-mono font-semibold text-cyan-100">{shortAddress}</p>
            <p className="font-mono text-slate-400">{formattedBalance} {balance?.symbol ?? 'AVAX'}</p>
          </>
        ) : (
          <p className="font-medium text-rose-300">Wallet desconectada</p>
        )}
      </div>

      <div className="rounded-lg border border-slate-500/40 bg-slate-700/30 px-3 py-2">
        <ConnectButton label="Launch DAO" />
      </div>

      {account && (
        <div className="hidden">
          <p><strong>Address:</strong> {account}</p>
          <p><strong>Balance:</strong> {formattedBalance} {balance?.symbol}</p>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
