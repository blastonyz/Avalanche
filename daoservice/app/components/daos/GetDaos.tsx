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
      <div className="p-4">
        <p className="text-gray-600">Loading DAOs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-600">Error loading DAOs: {(error as Error).message}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!daos || daos.length === 0) {
    return (
      <div className="p-4">
        <p className="text-gray-600">No DAOs found. Deploy a new DAO to get started!</p>
      </div>
    );
  }

  // Filter out DAOs missing required fields
  const validDAOs = daos.filter(
    (dao) => dao.governorAddress && dao.tokenAddress && dao.creator
  );

  return (
    <div className="space-y-6 w-full">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold mb-2">
          {selectedDAO ? selectedDAO.name : 'Available DAOs'}
        </h2>
        <p className="text-gray-600">
          {selectedDAO
            ? 'Governance actions and proposals'
            : 'Select a DAO to interact with governance proposals'}
        </p>
        {!selectedDAO && validDAOs.length < daos.length && (
          <p className="text-sm text-yellow-600 mt-2">
            ⚠️ {daos.length - validDAOs.length} DAO(s) skipped due to missing required fields
          </p>
        )}
      </div>

      {/* Show selected DAO only, or full list if none selected */}
      {selectedDAO ? (
        <div className="space-y-4">
          {/* Selected DAO Card */}
          <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{selectedDAO.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{selectedDAO.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
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
                className="ml-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-colors"
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
            <div className="p-4 text-center text-gray-600">
              <p>No valid DAOs found. All DAOs are missing required fields.</p>
            </div>
          ) : (
            validDAOs.map((dao) => (
              <div
                key={dao._id}
                className="p-4 border rounded-lg cursor-pointer transition-all border-gray-200 hover:border-gray-300 hover:shadow-md"
                onClick={() => setSelectedDAO(dao)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{dao.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{dao.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
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
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
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
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-xl font-bold mb-4">
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
        <div className="mt-8 pt-6 border-t">
          <p className="text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded">
            ⚠️ Please connect your wallet to interact with {selectedDAO.name}
          </p>
        </div>
      )}
    </div>
  );
}

