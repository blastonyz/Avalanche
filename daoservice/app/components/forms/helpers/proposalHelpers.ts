import { decodeFunctionData } from 'viem';
import { SimpleTokenAbi } from '@/abis/SimpleTokenAbi';
import { formatEther } from 'viem';
import type { Proposal } from '@/app/services/daoService';

/**
 * Decodes calldata to extract recipient and amount for a transfer proposal
 */
export function decodeTransferCalldata(calldata: string): {
  recipient: `0x${string}`;
  amount: string;
} | null {
  try {
    const decoded = decodeFunctionData({
      abi: SimpleTokenAbi,
      data: calldata as `0x${string}`,
    });

    if (decoded.functionName === 'transfer' && decoded.args) {
      const [recipient, amount] = decoded.args as [`0x${string}`, bigint];
      return {
        recipient,
        amount: formatEther(amount),
      };
    }
  } catch (err) {
    console.warn('Failed to decode calldata:', err);
  }
  return null;
}

/**
 * Restores proposal state from database proposal data
 */
export interface RestoredProposalState {
  proposalId: bigint | null;
  descriptionHash: `0x${string}` | null;
  description: string;
  recipient: `0x${string}` | '';
  amount: string;
}

/**
 * Extracts and restores proposal state from a database proposal
 */
export function restoreProposalState(proposal: Proposal): RestoredProposalState {
  const state: RestoredProposalState = {
    proposalId: null,
    descriptionHash: null,
    description: '',
    recipient: '',
    amount: '0.1',
  };

  // Restore proposal ID
  if (proposal.proposalId) {
    state.proposalId = BigInt(proposal.proposalId);
  }

  // Restore description hash
  if (proposal.descriptionHash) {
    state.descriptionHash = proposal.descriptionHash as `0x${string}`;
  }

  // Restore description
  if (proposal.description) {
    state.description = proposal.description;
  }

  // Restore recipient and amount from calldata
  const calldata = proposal.calldatas?.[0];
  if (calldata) {
    const decoded = decodeTransferCalldata(calldata);
    if (decoded) {
      state.recipient = decoded.recipient;
      state.amount = decoded.amount;
    }
  }

  return state;
}

