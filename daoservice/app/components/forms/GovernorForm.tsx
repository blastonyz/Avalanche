'use client';

import { useState, useEffect } from 'react';
import { encodeFunctionData } from 'viem';
import { SimpleTokenAbi } from '@/abis/SimpleTokenAbi';
import { useGovernance } from '../../context/contracts-hooks/useGovernance';
import { useProposalState } from '../../context/contracts-hooks/governor/useProposalState';
import { parseEther } from 'viem';
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
  const {
    propose,
    castVote,
    queueProposal,
    executeProposal,
    delegateVotes,
  } = useGovernance();

  const [recipient, setRecipient] = useState<`0x${string}` | ''>('');
  const [amount, setAmount] = useState<string>('0.1');
  const [description, setDescription] = useState<string>('');
  const [localProposalId, setLocalProposalId] = useState<bigint | null>(initialProposalId || null);
  const [descriptionHash, setDescriptionHash] = useState<`0x${string}` | null>(null);

  // Check proposal state if we have a proposal ID
  const { data: proposalState, refetch: refetchState } = useProposalState({
    governorAddress,
    proposalId: localProposalId || BigInt(0),
  });

  // Refetch state periodically when we have a proposal
  useEffect(() => {
    if (!localProposalId) return;
    
    const interval = setInterval(() => {
      refetchState();
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [localProposalId, refetchState]);

  const canQueue = proposalState === 4; // Succeeded state
  const isQueued = proposalState === 5;
  const isExecuted = proposalState === 7;

  // Helper function to update proposal state in database
  const updateProposalState = async (newState: number) => {
    if (!daoId || !localProposalId || !descriptionHash) return;

    try {
      await fetch(`/api/dao/${daoId}/proposal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposalId: localProposalId.toString(),
          descriptionHash, // Required to identify the proposal
          state: newState,
        }),
      });
    } catch (err) {
      console.warn('Failed to update proposal state in database:', err);
    }
  };

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
      updateProposalState(proposalState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposalState]);

  // ✅ Propose
  const {
    mutateAsync: proposeAsync,
    isPending: isProposing,
    isSuccess: isProposalSuccess,
    error: proposeError,
  } = propose;

  // ✅ Delegate
  const {
    mutateAsync: delegateAsync,
    isPending: isDelegating,
    isSuccess: isDelegateSuccess,
    error: delegateError,
  } = delegateVotes;

  // ✅ Vote
  const {
    mutateAsync: voteAsync,
    isPending: isVoting,
    isSuccess: isVoteSuccess,
    error: voteError,
  } = castVote;

  const {
    mutateAsync: queueProposalAsync,
    isPending: isQueueing,
    isSuccess: isQueueSuccescess,
    error: queueError,
  } = queueProposal;

  const handleSubmit = async () => {
    if (!recipient || !description) {
      alert('Please fill in recipient address and description');
      return;
    }

    const parsedAmount = parseEther(amount);
    const calldata = encodeFunctionData({
      abi: SimpleTokenAbi,
      functionName: 'transfer',
      args: [recipient as `0x${string}`, parsedAmount],
    });

    const result = await proposeAsync({
      governorAddress,
      target: tokenAddress,
      value: 0n,
      calldata,
      description,
    });

    setLocalProposalId(result.proposalId);
    console.log('✅ propId:', result.proposalId);

    setDescriptionHash(result.descriptionHash);
    console.log("desc hash: ", result.descriptionHash);

    // Save proposal to database if daoId is available
    if (daoId) {
      try {
        const response = await fetch(`/api/dao/${daoId}/proposal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            proposalId: result.proposalId.toString(),
            description,
            descriptionHash: result.descriptionHash,
            actionType: treasuryAddress && recipient === treasuryAddress 
              ? 'TRANSFER_TO_TREASURY' 
              : 'TRANSFER',
            targets: [tokenAddress],
            values: ['0'],
            calldatas: [calldata],
            state: 0, // Pending
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.warn('Failed to save proposal to database:', errorData);
        } else {
          const savedProposal = await response.json();
          console.log('✅ Proposal saved to database:', savedProposal);
        }
      } catch (dbErr: any) {
        console.warn('Error saving proposal to database:', dbErr);
        // Don't throw - proposal was created successfully on-chain
      }
    }
  };


  const handleDelegate = async () => {
    await delegateAsync({
      tokenAddress,
      delegateTo: userAddress,
    });
  };

  const handleVote = async () => {
    console.log('🔍 handleVote iniciado. proposalId:', localProposalId);
    if (!localProposalId) {
      console.warn('⚠️ No hay proposalId, abortando voto');
      alert('Please create a proposal first or enter a proposal ID');
      return;
    }

    await voteAsync({
      governorAddress,
      proposalId: localProposalId,
      support: 1,
      reason: 'Apoyo total',
    });
  };

  const handleQueue = async () => {
    if (!descriptionHash || !description || !recipient) {
      alert('Please create a proposal first');
      return;
    }

    if (!localProposalId) {
      alert('No proposal ID available');
      return;
    }

    // Check proposal state before queueing
    if (proposalState !== 4) {
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
      const currentState = stateNames[proposalState as number] || 'Unknown';
      alert(`Cannot queue proposal. Current state: ${currentState}. Proposal must be in "Succeeded" state to queue.`);
      return;
    }

    try {
      const parsedAmount = parseEther(amount);
      const calldata = encodeFunctionData({
        abi: SimpleTokenAbi,
        functionName: 'transfer',
        args: [recipient as `0x${string}`, parsedAmount],
      });

      console.log("calldata: ", calldata);
      
      await queueProposalAsync({
        governorAddress,
        target: tokenAddress,
        value: 0n,
        calldata,
        description
      });

      // Refetch state after queueing
      setTimeout(() => refetchState(), 2000);
    } catch (error: any) {
      console.error('Queue error:', error);
      if (error?.shortMessage?.includes('state')) {
        alert('Proposal is not in the correct state to be queued. It must be "Succeeded". Please check the proposal state.');
      } else {
        alert(`Failed to queue proposal: ${error?.shortMessage || error?.message || 'Unknown error'}`);
      }
    }
  };

  const handleExecute = async () => {
    if (!descriptionHash || !description) {
      alert('Please create a proposal first');
      return;
    }

    const parsedAmount = parseEther(amount);
    const calldata = encodeFunctionData({
      abi: SimpleTokenAbi,
      functionName: 'transfer',
      args: [recipient, parsedAmount],
    });

    // Note: You'll need to add executeProposal mutation from useGovernance
    // This is a placeholder for the execute functionality
    console.log('Execute proposal:', { governorAddress, target: tokenAddress, calldata, description });
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
        isProposing={isProposing}
        isDelegating={isDelegating}
        isVoting={isVoting}
        isQueueing={isQueueing}
        canPropose={!!recipient && !!description}
        canVote={!!localProposalId}
        canQueue={canQueue}
        isQueued={isQueued}
        isExecuted={isExecuted}
        proposalState={proposalState as number | null | undefined}
      />

      <GovernanceMessages
        isProposalSuccess={isProposalSuccess}
        isDelegateSuccess={isDelegateSuccess}
        isVoteSuccess={isVoteSuccess}
        proposeError={proposeError}
        delegateError={delegateError}
        voteError={voteError}
        queueError={queueError}
      />

      <ProposalStateDisplay
        proposalId={localProposalId}
        proposalState={proposalState as number | null | undefined}
        descriptionHash={descriptionHash}
      />

    </div>
  );
}