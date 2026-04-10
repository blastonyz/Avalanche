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
      <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3">
        <p className="text-sm text-slate-600">Loading proposal from database...</p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3">
      <p className="mb-2 text-sm font-medium text-slate-800">Current Proposal</p>
      <p className="mb-2 break-all font-mono text-xs text-slate-600">
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
                : 'text-slate-600'
            }`}
          >
            {getStateName(proposalState)}
          </span>
          {proposalState === PROPOSAL_STATES.ACTIVE && (
            <p className="mt-1 text-xs text-slate-500">
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
        <p className="mt-1 break-all font-mono text-xs text-slate-600">
          Description Hash: {descriptionHash}
        </p>
      )}
      {statusCheckCount > 0 && (
        <div className="mt-2 border-t border-slate-200 pt-2">
          <p className="text-xs text-slate-500">
            🔄 Status checked {statusCheckCount} time{statusCheckCount !== 1 ? 's' : ''} 
            {proposalState === PROPOSAL_STATES.ACTIVE && ' (checking every 1 minute...)'}
          </p>
        </div>
      )}
    </div>
  );
}

