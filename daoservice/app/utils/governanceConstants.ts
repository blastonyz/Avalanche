/**
 * Centralized constants for governance proposal states
 */
export const PROPOSAL_STATE_NAMES: Record<number, string> = {
  0: 'Pending',
  1: 'Active',
  2: 'Canceled',
  3: 'Defeated',
  4: 'Succeeded',
  5: 'Queued',
  6: 'Expired',
  7: 'Executed',
} as const;

export const PROPOSAL_STATES = {
  PENDING: 0,
  ACTIVE: 1,
  CANCELED: 2,
  DEFEATED: 3,
  SUCCEEDED: 4,
  QUEUED: 5,
  EXPIRED: 6,
  EXECUTED: 7,
} as const;

export const FINAL_STATES: readonly number[] = [
  PROPOSAL_STATES.CANCELED,
  PROPOSAL_STATES.DEFEATED,
  PROPOSAL_STATES.QUEUED,
  PROPOSAL_STATES.EXPIRED,
  PROPOSAL_STATES.EXECUTED,
] as const;

export function getStateName(state: number | null | undefined): string {
  if (state === null || state === undefined) return 'Unknown';
  return PROPOSAL_STATE_NAMES[state] || `Unknown (${state})`;
}

