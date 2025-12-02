'use client';

import { PROPOSAL_STATES, getStateName } from '@/app/utils/governanceConstants';

type ProposalStateDisplayProps = {
  proposalId: bigint | null;
  proposalState?: number | null;
  descriptionHash: string | null;
  statusCheckCount?: number;
  isLoadingProposals?: boolean;
};

export default function ProposalStateDisplay({
  proposalId,
  proposalState,
  descriptionHash,
  statusCheckCount = 0,
  isLoadingProposals = false,
}: ProposalStateDisplayProps) {
  if (!proposalId) return null;

  if (isLoadingProposals) {
    return (
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
        <p className="text-sm text-gray-600">Loading proposal from database...</p>
      </div>
    );
  }

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
              proposalState === PROPOSAL_STATES.SUCCEEDED
                ? 'text-green-600' // Succeeded
                : proposalState === PROPOSAL_STATES.QUEUED
                ? 'text-blue-600' // Queued
                : proposalState === PROPOSAL_STATES.EXECUTED
                ? 'text-purple-600' // Executed
                : proposalState === PROPOSAL_STATES.DEFEATED
                ? 'text-red-600' // Defeated
                : 'text-gray-600'
            }`}
          >
            {getStateName(proposalState)}
          </span>
          {proposalState === PROPOSAL_STATES.ACTIVE && (
            <p className="text-xs text-gray-500 mt-1">
              ⏳ Waiting for voting period to end...
            </p>
          )}
          {proposalState === PROPOSAL_STATES.SUCCEEDED && (
            <p className="text-xs text-green-600 mt-1">
              ✅ Proposal succeeded! You can now queue it.
            </p>
          )}
          {proposalState === PROPOSAL_STATES.DEFEATED && (
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
      {statusCheckCount > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500">
            🔄 Status checked {statusCheckCount} time{statusCheckCount !== 1 ? 's' : ''} 
            {proposalState === PROPOSAL_STATES.ACTIVE && ' (checking every 1 minute...)'}
          </p>
        </div>
      )}
    </div>
  );
}

