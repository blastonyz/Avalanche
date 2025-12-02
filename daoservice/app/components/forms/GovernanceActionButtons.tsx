'use client';

type GovernanceActionButtonsProps = {
  onPropose: () => void;
  onDelegate: () => void;
  onVote: () => void;
  onQueue: () => void;
  isProposing: boolean;
  isDelegating: boolean;
  isVoting: boolean;
  isQueueing: boolean;
  canPropose: boolean;
  canVote: boolean;
  canQueue: boolean;
  isQueued: boolean;
  isExecuted: boolean;
  proposalState?: number | null;
  queueTooltip?: string;
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

export default function GovernanceActionButtons({
  onPropose,
  onDelegate,
  onVote,
  onQueue,
  isProposing,
  isDelegating,
  isVoting,
  isQueueing,
  canPropose,
  canVote,
  canQueue,
  isQueued,
  isExecuted,
  proposalState,
  queueTooltip,
}: GovernanceActionButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={onPropose}
        disabled={isProposing || !canPropose}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isProposing ? 'Procesando...' : 'Create Proposal'}
      </button>

      <button
        onClick={onDelegate}
        disabled={isDelegating}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isDelegating ? 'Delegando...' : 'Delegate Votes'}
      </button>

      <button
        onClick={onVote}
        disabled={isVoting || !canVote}
        className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isVoting ? 'Votando...' : 'Vote (Support)'}
      </button>

      <button
        onClick={onQueue}
        disabled={isQueueing || !canQueue || isQueued || isExecuted}
        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        title={
          queueTooltip ||
          (!canQueue && proposalState !== undefined
            ? `Cannot queue. Current state: ${stateNames[proposalState as number]}. Must be "Succeeded".`
            : isQueued
            ? 'Proposal is already queued'
            : isExecuted
            ? 'Proposal is already executed'
            : 'Queue the proposal for execution')
        }
      >
        {isQueueing
          ? 'Encolando...'
          : isQueued
          ? 'Queued'
          : isExecuted
          ? 'Executed'
          : 'Queue Proposal'}
      </button>
    </div>
  );
}

