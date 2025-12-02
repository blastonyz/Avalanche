'use client';

type ProposalFormInputsProps = {
  recipient: string;
  setRecipient: (value: `0x${string}` | '') => void;
  amount: string;
  setAmount: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  proposalId: bigint | null;
  setProposalId: (value: bigint | null) => void;
};

export default function ProposalFormInputs({
  recipient,
  setRecipient,
  amount,
  setAmount,
  description,
  setDescription,
  proposalId,
  setProposalId,
}: ProposalFormInputsProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Recipient Address</label>
        <input
          type="text"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value as `0x${string}`)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Amount (AVAX)</label>
        <input
          type="number"
          placeholder="0.1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Proposal Description</label>
        <textarea
          placeholder="Describe your proposal..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      {proposalId && (
        <div>
          <label className="block text-sm font-medium mb-1">Proposal ID (optional)</label>
          <input
            type="text"
            placeholder="Enter proposal ID to vote on existing proposal"
            value={proposalId.toString()}
            onChange={(e) => {
              try {
                setProposalId(BigInt(e.target.value));
              } catch {
                // Invalid bigint, ignore
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
}

