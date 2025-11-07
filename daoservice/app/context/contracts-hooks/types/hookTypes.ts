export type GovernorTarget = {
  governorAddress: `0x${string}`;
};

export type ProposalTarget = {
  target: `0x${string}`;
  value: bigint;
  calldata: `0x${string}`;
};

export type ProposalDescription = {
  description: string;
};

export type VotationParams = GovernorTarget & ProposalTarget & ProposalDescription;

export type VoteParams = GovernorTarget & {
  proposalId: bigint;
  support: 0 | 1 | 2;
  reason: string;
};

export type StateParams = GovernorTarget & {
  proposalId: bigint;
};

export type QueueParams = VotationParams;
export type ExecuteParams = VotationParams;