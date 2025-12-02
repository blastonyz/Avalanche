'use client';

import { useState, useEffect } from 'react';
import { useProposalState } from '../../context/contracts-hooks/governor/useProposalState';
import { useGovernorActions } from '../../context/contracts-hooks/useGovernorActions';
import { fetchProposals, saveProposal, updateProposalState } from '@/app/services/daoService';
import { PROPOSAL_STATES, FINAL_STATES } from '@/app/utils/governanceConstants';
import { buildCalldata } from '@/app/utils/buildCalldata';
import { restoreProposalState } from './helpers/proposalHelpers';
import ProposalFormInputs from './ProposalFormInputs';
import GovernanceActionButtons from './GovernanceActionButtons';
import GovernanceMessages from './GovernanceMessages';
import ProposalStateDisplay from './ProposalStateDisplay';

type Props = {
  daoId?: string; // MongoDB DAO ID
  governorAddress: `0x${string}`;
  tokenAddress: `0x${string}`;
  userAddress: `0x${string}`;
  treasuryAddress?: `0x${string}`;
  proposalId?: bigint;
};

export default function GovernorForm({
  daoId,
  governorAddress,
  tokenAddress,
  userAddress,
  treasuryAddress,
  proposalId: initialProposalId,
}: Props) {
  const [recipient, setRecipient] = useState<`0x${string}` | ''>('');
  const [amount, setAmount] = useState<string>('0.1');
  const [description, setDescription] = useState<string>('');
  const [localProposalId, setLocalProposalId] = useState<bigint | null>(initialProposalId || null);
  const [descriptionHash, setDescriptionHash] = useState<`0x${string}` | null>(null);
  const [statusCheckCount, setStatusCheckCount] = useState<number>(0);
  const [isLoadingProposals, setIsLoadingProposals] = useState<boolean>(false);

  // Load proposals from database on mount
  useEffect(() => {
    if (!daoId) return;

    async function loadProposals() {
      setIsLoadingProposals(true);
      try {
        const data = await fetchProposals(daoId!);
        
        const hasProposals = data.proposals && data.proposals.length > 0;
        if (!hasProposals) return;

        // Get the most recent proposal (should be sorted by createdAt desc)
        const latestProposal = data.proposals[0];
        
        // Restore proposal state using helper function
        const restoredState = restoreProposalState(latestProposal);
        
        // Apply restored state to component
        setLocalProposalId(restoredState.proposalId);
        setDescriptionHash(restoredState.descriptionHash);
        setDescription(restoredState.description);
        setRecipient(restoredState.recipient);
        setAmount(restoredState.amount);
        
        console.log('✅ Loaded proposal from database:', latestProposal);
      } catch (err) {
        console.warn('Failed to load proposals from database:', err);
      } finally {
        setIsLoadingProposals(false);
      }
    }

    loadProposals();
  }, [daoId]);

  // Check proposal state if we have a proposal ID
  const { data: proposalState, refetch: refetchState } = useProposalState({
    governorAddress,
    proposalId: localProposalId || BigInt(0),
  });

  // Refetch state periodically when we have a proposal
  // Stop checking when proposal reaches a final state
  useEffect(() => {
    if (!localProposalId) return;
    
    // Reset counter when proposal changes
    setStatusCheckCount(0);
    
    // If already in a final state, don't start interval
    if (
      proposalState !== undefined &&
      proposalState !== null &&
      typeof proposalState === 'number' &&
      FINAL_STATES.includes(proposalState)
    ) {
      return;
    }
    
    const interval = setInterval(() => {
      setStatusCheckCount((prev) => prev + 1);
      refetchState();
    }, 60000); // Check every 1 minute

    return () => clearInterval(interval);
  }, [localProposalId, refetchState, proposalState]);

  const canQueue = proposalState === PROPOSAL_STATES.SUCCEEDED;
  const isQueued = proposalState === PROPOSAL_STATES.QUEUED;
  const isExecuted = proposalState === PROPOSAL_STATES.EXECUTED;
  const canExecute = proposalState === PROPOSAL_STATES.QUEUED;

  // Use the new useGovernorActions hook
  const {
    propose,
    delegate,
    vote,
    queue,
    execute,
    isProposing,
    isDelegating,
    isVoting,
    isQueueing,
    isExecuting,
    proposeError,
    delegateError,
    voteError,
    queueError,
    executeError,
    isProposalSuccess,
    isDelegateSuccess,
    isVoteSuccess,
    isQueueSuccess,
    isExecuteSuccess,
  } = useGovernorActions({
    governorAddress,
    tokenAddress,
    userAddress,
    recipient,
    amount,
    description,
    proposalId: localProposalId,
    proposalState: proposalState as number | null,
    treasuryAddress,
  });

  // Update proposal state in database when it changes
  useEffect(() => {
    if (
      proposalState !== undefined &&
      proposalState !== null &&
      typeof proposalState === 'number' &&
      daoId &&
      localProposalId &&
      descriptionHash
    ) {
      updateProposalState(
        daoId,
        localProposalId.toString(),
        descriptionHash,
        proposalState
      ).catch((err) => {
        console.warn('Failed to update proposal state in database:', err);
      });
    }
  }, [proposalState, daoId, localProposalId, descriptionHash]);

  const handleSubmit = async () => {
    try {
      const result = await propose();
      
      setLocalProposalId(result.proposalId);
      setDescriptionHash(result.descriptionHash);
      
      console.log('✅ propId:', result.proposalId);
      console.log('desc hash:', result.descriptionHash);

      // Save proposal to database if daoId is available
      if (daoId) {
        try {
          const actionType = treasuryAddress && recipient === treasuryAddress 
            ? 'TRANSFER_TO_TREASURY' 
            : 'TRANSFER';
          
          await saveProposal(daoId, {
            proposalId: result.proposalId.toString(),
            description,
            descriptionHash: result.descriptionHash,
            actionType,
            targets: [tokenAddress],
            values: ['0'],
            calldatas: [buildCalldata(recipient as `0x${string}`, amount)],
            state: PROPOSAL_STATES.PENDING,
          });
          
          console.log('✅ Proposal saved to database');
        } catch (dbErr: any) {
          console.warn('Error saving proposal to database:', dbErr);
          // Don't throw - proposal was created successfully on-chain
        }
      }
    } catch (error: any) {
      alert(error.message || 'Failed to create proposal');
    }
  };

  const handleDelegate = async () => {
    try {
      await delegate();
    } catch (error: any) {
      alert(error.message || 'Failed to delegate votes');
    }
  };

  const handleVote = async () => {
    try {
      await vote();
    } catch (error: any) {
      alert(error.message || 'Failed to vote');
    }
  };

  const handleQueue = async () => {
    try {
      await queue();
      // Refetch state after queueing
      setTimeout(() => refetchState(), 2000);
    } catch (error: any) {
      alert(error.message || 'Failed to queue proposal');
    }
  };

  const handleExecute = async () => {
    try {
      await execute();
      // Refetch state after execution
      setTimeout(() => refetchState(), 2000);
    } catch (error: any) {
      alert(error.message || 'Failed to execute proposal');
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-3">
        <h2 className="text-xl font-bold">Governance Actions</h2>
        <div className="mt-2 text-sm text-gray-600 space-y-1">
          <p><strong>Governor:</strong> <span className="font-mono text-xs">{governorAddress}</span></p>
          <p><strong>Token:</strong> <span className="font-mono text-xs">{tokenAddress}</span></p>
          {treasuryAddress && (
            <p><strong>Treasury:</strong> <span className="font-mono text-xs">{treasuryAddress}</span></p>
          )}
        </div>
      </div>

      <ProposalFormInputs
        recipient={recipient}
        setRecipient={setRecipient}
        amount={amount}
        setAmount={setAmount}
        description={description}
        setDescription={setDescription}
        proposalId={localProposalId}
        setProposalId={setLocalProposalId}
      />

      <GovernanceActionButtons
        onPropose={handleSubmit}
        onDelegate={handleDelegate}
        onVote={handleVote}
        onQueue={handleQueue}
        onExecute={handleExecute}
        isProposing={isProposing}
        isDelegating={isDelegating}
        isVoting={isVoting}
        isQueueing={isQueueing}
        isExecuting={isExecuting}
        canPropose={!!recipient && !!description}
        canVote={!!localProposalId}
        canQueue={canQueue}
        canExecute={canExecute}
        isQueued={isQueued}
        isExecuted={isExecuted}
        proposalState={proposalState as number | null | undefined}
      />

      <GovernanceMessages
        isProposalSuccess={isProposalSuccess}
        isDelegateSuccess={isDelegateSuccess}
        isVoteSuccess={isVoteSuccess}
        isExecuteSuccess={isExecuteSuccess}
        proposeError={proposeError}
        delegateError={delegateError}
        voteError={voteError}
        queueError={queueError}
        executeError={executeError}
      />

      <ProposalStateDisplay
        proposalId={localProposalId}
        proposalState={proposalState as number | null | undefined}
        descriptionHash={descriptionHash}
        statusCheckCount={statusCheckCount}
        isLoadingProposals={isLoadingProposals}
      />
    </div>
  );
}
