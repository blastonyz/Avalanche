'use client';

import { useState } from 'react';
import { encodeFunctionData } from 'viem';
import { SimpleTokenAbi } from '@/abis/SimpleTokenAbi';
import { useGovernance } from '../../context/contracts-hooks/useGovernance'
import { parseEther } from 'viem';

type Props = {
  governorAddress: `0x${string}`;
  tokenAddress: `0x${string}`;
  userAddress: `0x${string}`;
  proposalId?: bigint;
};

export default function GovernorForm({
  governorAddress,
  tokenAddress,
  userAddress,
  proposalId,
}: Props) {
  const {
    propose,
    castVote,
    queueProposal,
    executeProposal,
    delegateVotes,
  } = useGovernance();

  const [recipient, setRecipient] = useState<`0x${string}`>('0x746e2011b20a7df9952f3ae9591c0a9d4a0b8865');
  const [amount, setAmount] = useState<string>('0.1');
  const [description, setDescription] = useState<string>('Transfer test funds');
  const [localProposalId, setLocalProposalId] = useState<bigint>(100523211453757576252262195424482199024159405828057605577187529177129917839081n);
  const [descriptionHash, setDescriptionHash] = useState<`0x${string}`>("0x87abb80c1f043f422727dafedb9dc8ce3e36c1302c611a948288ef2a389309d2");

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
    const parsedAmount = parseEther(amount)
    const calldata = encodeFunctionData({
      abi: SimpleTokenAbi,
      functionName: 'transfer',
      args: [recipient, parsedAmount],
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

    // ✅ ahora lo tenés
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

    const calldata = encodeFunctionData({
      abi: SimpleTokenAbi,
      functionName: 'transfer',
      args: [recipient, BigInt(0.1 * 1e18)],
    });

    console.log("calldata: ", calldata);
    
    await queueProposalAsync({
      governorAddress,
      target: tokenAddress,
      value: 0n,
      calldata,
      description: "new"
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Crear y ejecutar propuesta</h2>

      <input
        type="text"
        placeholder="Dirección del destinatario"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value as `0x${string}`)}
        className="input"
      />

      <input
        type="number"
        placeholder="Monto en AVAX"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="input"
      />

      <textarea
        placeholder="Descripción de la propuesta"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="textarea"
      />

      <button
        onClick={handleSubmit}
        disabled={isProposing}
        className="btn btn-primary"
      >
        {isProposing ? 'Procesando...' : 'Proponer'}
      </button>

      <button
        onClick={handleDelegate}
        disabled={isDelegating}
        className="btn"
      >
        {isDelegating ? 'Delegando...' : 'Delegar votos'}
      </button>

      <button
        onClick={handleVote}
        disabled={isVoting || !localProposalId}
        className="btn"
      >
        {isVoting ? 'Votando...' : 'Votar'}
      </button>

    <button
    onClick={handleQueue}
    disabled={isQueueing}
    >
      {isQueueing? "Encolando":"Encolar"}
    </button>
      {isProposalSuccess && <p className="text-green-600">✅ Propuesta creada</p>}
      {isDelegateSuccess && <p className="text-green-600">✅ Votos delegados</p>}
      {isVoteSuccess && <p className="text-green-600">✅ Voto emitido</p>}

      {(proposeError || delegateError || voteError) && (
        <p className="text-red-600">
          ❌ Error: {(proposeError || delegateError || voteError as Error).message}
        </p>
      )}

      {localProposalId && (
        <p className="text-sm text-gray-500">
          🧠 Proposal ID: {localProposalId.toString()}
        </p>
      )}

    </div>
  );
}