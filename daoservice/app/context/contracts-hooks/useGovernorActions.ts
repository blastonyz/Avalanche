import { useCallback } from 'react';
import { useGovernance } from './useGovernance';
import { buildCalldata } from '@/app/utils/buildCalldata';
import { PROPOSAL_STATES, getStateName } from '@/app/utils/governanceConstants';

interface GovernorActionsParams {
  governorAddress: `0x${string}`;
  tokenAddress: `0x${string}`;
  userAddress: `0x${string}`;
  recipient: `0x${string}` | '';
  amount: string;
  description: string;
  proposalId?: bigint | null;
  proposalState?: number | null;
  treasuryAddress?: `0x${string}`;
}

interface GovernorActionsReturn {
  propose: () => Promise<{ proposalId: bigint; descriptionHash: `0x${string}` }>;
  delegate: () => Promise<void>;
  vote: () => Promise<void>;
  queue: () => Promise<void>;
  execute: () => Promise<void>;
  isProposing: boolean;
  isDelegating: boolean;
  isVoting: boolean;
  isQueueing: boolean;
  isExecuting: boolean;
  proposeError: Error | null;
  delegateError: Error | null;
  voteError: Error | null;
  queueError: Error | null;
  executeError: Error | null;
  isProposalSuccess: boolean;
  isDelegateSuccess: boolean;
  isVoteSuccess: boolean;
  isQueueSuccess: boolean;
  isExecuteSuccess: boolean;
}

/**
 * Custom hook that encapsulates all governor actions with state validation
 */
export function useGovernorActions({
  governorAddress,
  tokenAddress,
  userAddress,
  recipient,
  amount,
  description,
  proposalId,
  proposalState,
  treasuryAddress,
}: GovernorActionsParams): GovernorActionsReturn {
  const {
    propose,
    castVote,
    queueProposal,
    executeProposal,
    delegateVotes,
  } = useGovernance();

  const {
    mutateAsync: proposeAsync,
    isPending: isProposing,
    isSuccess: isProposalSuccess,
    error: proposeError,
  } = propose;

  const {
    mutateAsync: delegateAsync,
    isPending: isDelegating,
    isSuccess: isDelegateSuccess,
    error: delegateError,
  } = delegateVotes;

  const {
    mutateAsync: voteAsync,
    isPending: isVoting,
    isSuccess: isVoteSuccess,
    error: voteError,
  } = castVote;

  const {
    mutateAsync: queueProposalAsync,
    isPending: isQueueing,
    isSuccess: isQueueSuccess,
    error: queueError,
  } = queueProposal;

  const {
    mutateAsync: executeProposalAsync,
    isPending: isExecuting,
    isSuccess: isExecuteSuccess,
    error: executeError,
  } = executeProposal;

  const handlePropose = useCallback(async () => {
    if (!recipient || !description) {
      throw new Error('Please fill in recipient address and description');
    }

    const calldata = buildCalldata(recipient as `0x${string}`, amount);

    const result = await proposeAsync({
      governorAddress,
      target: tokenAddress,
      value: 0n,
      calldata,
      description,
    });

    return {
      proposalId: result.proposalId,
      descriptionHash: result.descriptionHash,
    };
  }, [governorAddress, tokenAddress, recipient, amount, description, proposeAsync]);

  const handleDelegate = useCallback(async () => {
    await delegateAsync({
      tokenAddress,
      delegateTo: userAddress,
    });
  }, [tokenAddress, userAddress, delegateAsync]);

  const handleVote = useCallback(async () => {
    if (!proposalId) {
      throw new Error('Please create a proposal first or enter a proposal ID');
    }

    await voteAsync({
      governorAddress,
      proposalId,
      support: 1,
      reason: 'Apoyo total',
    });
  }, [governorAddress, proposalId, voteAsync]);

  const handleQueue = useCallback(async () => {
    if (!description || !recipient) {
      throw new Error('Please create a proposal first');
    }

    if (!proposalId) {
      throw new Error('No proposal ID available');
    }

    // Validate state
    if (proposalState !== PROPOSAL_STATES.SUCCEEDED) {
      const currentState = getStateName(proposalState);
      throw new Error(
        `Cannot queue proposal. Current state: ${currentState}. Proposal must be in "Succeeded" state to queue.`
      );
    }

    const calldata = buildCalldata(recipient as `0x${string}`, amount);

    await queueProposalAsync({
      governorAddress,
      target: tokenAddress,
      value: 0n,
      calldata,
      description,
    });
  }, [
    governorAddress,
    tokenAddress,
    recipient,
    amount,
    description,
    proposalId,
    proposalState,
    queueProposalAsync,
  ]);

  const handleExecute = useCallback(async () => {
    if (!description || !recipient) {
      throw new Error('Please create a proposal first');
    }

    if (!proposalId) {
      throw new Error('No proposal ID available');
    }

    // Validate state
    if (proposalState !== PROPOSAL_STATES.QUEUED) {
      const currentState = getStateName(proposalState);
      throw new Error(
        `Cannot execute proposal. Current state: ${currentState}. Proposal must be in "Queued" state to execute.`
      );
    }

    const calldata = buildCalldata(recipient as `0x${string}`, amount);

    await executeProposalAsync({
      governorAddress,
      target: tokenAddress,
      value: 0n,
      calldata,
      description,
    });
  }, [
    governorAddress,
    tokenAddress,
    recipient,
    amount,
    description,
    proposalId,
    proposalState,
    executeProposalAsync,
  ]);

  return {
    propose: handlePropose,
    delegate: handleDelegate,
    vote: handleVote,
    queue: handleQueue,
    execute: handleExecute,
    isProposing,
    isDelegating,
    isVoting,
    isQueueing,
    isExecuting,
    proposeError: proposeError as Error | null,
    delegateError: delegateError as Error | null,
    voteError: voteError as Error | null,
    queueError: queueError as Error | null,
    executeError: executeError as Error | null,
    isProposalSuccess,
    isDelegateSuccess,
    isVoteSuccess,
    isQueueSuccess,
    isExecuteSuccess,
  };
}

