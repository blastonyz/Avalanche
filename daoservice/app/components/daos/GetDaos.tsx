'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import GovernorForm from '../forms/GovernorForm';
import { useAccount } from 'wagmi';

type DAO = {
  _id: string;
  name: string;
  description: string;
  creator: string;
  governorAddress: string;
  tokenAddress: string;
  treasury?: string;
  metadata?: Record<string, any>;
  createdAt: string;
};

async function fetchDAOs(): Promise<DAO[]> {
  const response = await fetch('/api/dao');
  if (!response.ok) {
    throw new Error('Failed to fetch DAOs');
  }
  const data = await response.json();
  return data.daos || [];
}

// Helper function to safely format addresses
function formatAddress(address: string | undefined | null): string {
  if (!address || typeof address !== 'string') {
    return 'N/A';
  }
  if (address.length < 18) {
    return address; // Return as-is if too short
  }
  return `${address.slice(0, 10)}...${address.slice(-8)}`;
}

export default function GetDaos() {
  const { address: userAddress } = useAccount();
  const [selectedDAO, setSelectedDAO] = useState<DAO | null>(null);

  const { data: daos, isLoading, error, refetch } = useQuery({
    queryKey: ['daos'],
    queryFn: fetchDAOs,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-slate-600">Loading DAOs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
        <p className="text-rose-700">Error loading DAOs: {(error as Error).message}</p>
        <button
          onClick={() => refetch()}
          className="mt-3 rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!daos || daos.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-slate-600">No DAOs found. Deploy a new DAO to get started.</p>
      </div>
    );
  }

  // Filter out DAOs missing required fields
  const validDAOs = daos.filter(
    (dao) => dao.governorAddress && dao.tokenAddress && dao.creator
  );

  return (
    <div className="space-y-6 w-full">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold mb-2">
          {selectedDAO ? selectedDAO.name : 'Available DAOs'}
        </h2>
        <p className="text-slate-600">
          {selectedDAO
            ? 'Governance actions and proposals'
            : 'Select a DAO to interact with governance proposals'}
        </p>
        {!selectedDAO && validDAOs.length < daos.length && (
          <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
            ⚠️ {daos.length - validDAOs.length} DAO(s) skipped due to missing required fields
          </p>
        )}
      </div>

      {/* Show selected DAO only, or full list if none selected */}
      {selectedDAO ? (
        <div className="space-y-4">
          {/* Selected DAO Card */}
          <div className="rounded-xl border border-cyan-200 bg-cyan-50/50 p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="mb-1 text-lg font-semibold text-slate-900">{selectedDAO.name}</h3>
                <p className="mb-3 text-sm text-slate-600">{selectedDAO.description}</p>
                <div className="grid grid-cols-1 gap-2 text-xs text-slate-600 md:grid-cols-2">
                  <div>
                    <span className="font-medium">Governor:</span>{' '}
                    <span className="font-mono">{formatAddress(selectedDAO.governorAddress)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Token:</span>{' '}
                    <span className="font-mono">{formatAddress(selectedDAO.tokenAddress)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Treasury:</span>{' '}
                    <span className="font-mono">{formatAddress(selectedDAO.treasury)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Creator:</span>{' '}
                    <span className="font-mono">{formatAddress(selectedDAO.creator)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedDAO(null)}
                className="ml-4 rounded-full p-2 text-slate-500 transition-colors hover:bg-white hover:text-slate-800"
                title="Deselect DAO"
                aria-label="Deselect DAO"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Full DAO List */
        <div className="grid gap-4">
          {validDAOs.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-slate-600">
              <p>No valid DAOs found. All DAOs are missing required fields.</p>
            </div>
          ) : (
            validDAOs.map((dao) => (
              <div
                key={dao._id}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-lg"
                onClick={() => setSelectedDAO(dao)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="mb-1 text-lg font-semibold text-slate-900">{dao.name}</h3>
                    <p className="mb-3 text-sm text-slate-600">{dao.description}</p>
                    <div className="grid grid-cols-1 gap-2 text-xs text-slate-600 md:grid-cols-2">
                      <div>
                        <span className="font-medium">Governor:</span>{' '}
                        <span className="font-mono">{formatAddress(dao.governorAddress)}</span>
                      </div>
                      <div>
                        <span className="font-medium">Token:</span>{' '}
                        <span className="font-mono">{formatAddress(dao.tokenAddress)}</span>
                      </div>
                      <div>
                        <span className="font-medium">Treasury:</span>{' '}
                        <span className="font-mono">{formatAddress(dao.treasury)}</span>
                      </div>
                      <div>
                        <span className="font-medium">Creator:</span>{' '}
                        <span className="font-mono">{formatAddress(dao.creator)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDAO(dao);
                    }}
                    className="neo-button ml-4 rounded-lg px-4 py-2 text-sm font-semibold text-white"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Governance Form for Selected DAO */}
      {selectedDAO && userAddress && selectedDAO.governorAddress && selectedDAO.tokenAddress && (
        <div className="mt-8 rounded-xl border border-slate-200 bg-[#f8fbff] p-5">
          <h3 className="mb-4 text-xl font-bold text-slate-900">
            Governance Actions for: {selectedDAO.name}
          </h3>
          <GovernorForm
            daoId={selectedDAO._id}
            governorAddress={selectedDAO.governorAddress as `0x${string}`}
            tokenAddress={selectedDAO.tokenAddress as `0x${string}`}
            userAddress={userAddress}
            treasuryAddress={selectedDAO.treasury as `0x${string}` | undefined}
          />
        </div>
      )}

      {selectedDAO && !userAddress && (
        <div className="mt-8">
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-700">
            ⚠️ Please connect your wallet to interact with {selectedDAO.name}
          </p>
        </div>
      )}
    </div>
  );
}

