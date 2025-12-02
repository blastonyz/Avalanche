'use client';

type ProposalStateDisplayProps = {
  proposalId: bigint | null;
  proposalState?: number | null;
  descriptionHash: string | null;
};

const stateNames: Record<number, string> = {
  0: 'Pending',
  1: 'Active',
  2: 'Canceled',
  3: 'Defeated',
  4: 'Succeeded',
  5: 'Queued',
  6: 'Expired',
  7: 'Executed',
};

export default function ProposalStateDisplay({
  proposalId,
  proposalState,
  descriptionHash,
}: ProposalStateDisplayProps) {
  if (!proposalId) return null;

  return (
    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
      <p className="text-sm font-medium mb-2">Current Proposal</p>
      <p className="text-xs text-gray-600 font-mono break-all mb-2">
        Proposal ID: {proposalId.toString()}
      </p>
      {proposalState !== undefined && (
        <div className="mb-2">
          <span className="text-xs font-medium">State: </span>
          <span
            className={`text-xs font-semibold ${
              proposalState === 4
                ? 'text-green-600' // Succeeded
                : proposalState === 5
                ? 'text-blue-600' // Queued
                : proposalState === 7
                ? 'text-purple-600' // Executed
                : proposalState === 3
                ? 'text-red-600' // Defeated
                : 'text-gray-600'
            }`}
          >
            {stateNames[proposalState as number] || `Unknown (${proposalState})`}
          </span>
          {proposalState === 1 && (
            <p className="text-xs text-gray-500 mt-1">
              ⏳ Waiting for voting period to end...
            </p>
          )}
          {proposalState === 4 && (
            <p className="text-xs text-green-600 mt-1">
              ✅ Proposal succeeded! You can now queue it.
            </p>
          )}
          {proposalState === 3 && (
            <p className="text-xs text-red-600 mt-1">
              ❌ Proposal was defeated (quorum not reached or votes failed)
            </p>
          )}
        </div>
      )}
      {descriptionHash && (
        <p className="text-xs text-gray-600 font-mono break-all mt-1">
          Description Hash: {descriptionHash}
        </p>
      )}
    </div>
  );
}

