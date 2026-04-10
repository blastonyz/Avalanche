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
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Recipient Address</label>
        <input
          type="text"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value as `0x${string}`)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-xs outline-none transition focus:border-cyan-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Amount (AVAX)</label>
        <input
          type="number"
          placeholder="0.1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none transition focus:border-cyan-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Proposal Description</label>
        <textarea
          placeholder="Describe your proposal..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none transition focus:border-cyan-500"
          rows={3}
        />
      </div>

      {proposalId && (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Proposal ID (optional)</label>
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
            className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-xs outline-none transition focus:border-cyan-500"
          />
        </div>
      )}
    </div>
  );
}

