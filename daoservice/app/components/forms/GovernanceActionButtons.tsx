'use client';

import { getStateName } from '@/app/utils/governanceConstants';

type GovernanceActionButtonsProps = {
  onPropose: () => void;
  onDelegate: () => void;
  onVote: () => void;
  onQueue: () => void;
  onExecute: () => void;
  isProposing: boolean;
  isDelegating: boolean;
  isVoting: boolean;
  isQueueing: boolean;
  isExecuting: boolean;
  canPropose: boolean;
  canVote: boolean;
  canQueue: boolean;
  canExecute: boolean;
  isQueued: boolean;
  isExecuted: boolean;
  proposalState?: number | null;
  queueTooltip?: string;
};

export default function GovernanceActionButtons({
  onPropose,
  onDelegate,
  onVote,
  onQueue,
  onExecute,
  isProposing,
  isDelegating,
  isVoting,
  isQueueing,
  isExecuting,
  canPropose,
  canVote,
  canQueue,
  canExecute,
  isQueued,
  isExecuted,
  proposalState,
  queueTooltip,
}: GovernanceActionButtonsProps) {
  const baseButton = 'rounded-md px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <button
        onClick={onPropose}
        disabled={isProposing || !canPropose}
        className={`${baseButton} bg-cyan-600 hover:bg-cyan-700`}
      >
        {isProposing ? 'Procesando...' : 'Create Proposal'}
      </button>

      <button
        onClick={onDelegate}
        disabled={isDelegating}
        className={`${baseButton} bg-emerald-600 hover:bg-emerald-700`}
      >
        {isDelegating ? 'Delegando...' : 'Delegate Votes'}
      </button>

      <button
        onClick={onVote}
        disabled={isVoting || !canVote}
        className={`${baseButton} bg-indigo-600 hover:bg-indigo-700`}
      >
        {isVoting ? 'Votando...' : 'Vote (Support)'}
      </button>

      <button
        onClick={onQueue}
        disabled={isQueueing || !canQueue || isQueued || isExecuted}
        className={`${baseButton} bg-amber-600 hover:bg-amber-700`}
        title={
          queueTooltip ||
          (!canQueue && proposalState !== undefined
            ? `Cannot queue. Current state: ${getStateName(proposalState)}. Must be "Succeeded".`
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

      <button
        onClick={onExecute}
        disabled={isExecuting || !canExecute || isExecuted}
        className={`${baseButton} bg-rose-600 hover:bg-rose-700`}
        title={
          !canExecute && proposalState !== undefined
            ? `Cannot execute. Current state: ${getStateName(proposalState)}. Must be "Queued".`
            : isExecuted
            ? 'Proposal is already executed'
            : 'Execute the queued proposal'
        }
      >
        {isExecuting ? 'Ejecutando...' : isExecuted ? 'Executed' : 'Execute Proposal'}
      </button>
    </div>
  );
}

