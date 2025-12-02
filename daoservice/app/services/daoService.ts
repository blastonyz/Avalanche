/**
 * Service for DAO-related database operations
 */

export interface ProposalPayload {
  proposalId: string;
  description: string;
  descriptionHash: string;
  actionType?: 'TRANSFER_TO_TREASURY' | 'TRANSFER' | string;
  targets: string[];
  values: string[];
  calldatas: string[];
  state?: number;
}

export interface Proposal {
  proposalId: string;
  description: string;
  descriptionHash: string;
  actionType?: string;
  targets: string[];
  values: string[];
  calldatas: string[];
  state: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProposalsResponse {
  success: boolean;
  proposals: Proposal[];
}

/**
 * Save a proposal to the database
 */
export async function saveProposal(
  daoId: string,
  payload: ProposalPayload
): Promise<{ success: boolean; proposal: Proposal }> {
  const response = await fetch(`/api/dao/${daoId}/proposal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || 'Failed to save proposal');
  }

  return response.json();
}

/**
 * Update proposal state in the database
 */
export async function updateProposalState(
  daoId: string,
  proposalId: string,
  descriptionHash: string,
  state: number
): Promise<void> {
  const response = await fetch(`/api/dao/${daoId}/proposal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      proposalId,
      descriptionHash,
      state,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    console.warn('Failed to update proposal state:', errorData);
  }
}

/**
 * Fetch all proposals for a DAO
 */
export async function fetchProposals(daoId: string): Promise<ProposalsResponse> {
  const response = await fetch(`/api/dao/${daoId}/proposal`);

  if (!response.ok) {
    throw new Error('Failed to fetch proposals');
  }

  return response.json();
}

