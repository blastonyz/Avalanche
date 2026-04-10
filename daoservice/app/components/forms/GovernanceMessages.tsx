'use client';

type GovernanceMessagesProps = {
  isProposalSuccess: boolean;
  isDelegateSuccess: boolean;
  isVoteSuccess: boolean;
  isExecuteSuccess?: boolean;
  proposeError?: Error | null;
  delegateError?: Error | null;
  voteError?: Error | null;
  queueError?: Error | null;
  executeError?: Error | null;
};

export default function GovernanceMessages({
  isProposalSuccess,
  isDelegateSuccess,
  isVoteSuccess,
  isExecuteSuccess,
  proposeError,
  delegateError,
  voteError,
  queueError,
  executeError,
}: GovernanceMessagesProps) {
  const hasError = proposeError || delegateError || voteError || queueError || executeError;

  return (
    <>
      {isProposalSuccess && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">✅ Propuesta creada</p>
      )}
      {isDelegateSuccess && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">✅ Votos delegados</p>
      )}
      {isVoteSuccess && <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">✅ Voto emitido</p>}
      {isExecuteSuccess && <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">✅ Propuesta ejecutada</p>}

      {hasError && (
        <div className="mt-2 rounded-md border border-rose-200 bg-rose-50 p-3">
          <p className="mb-1 font-medium text-rose-700">Error:</p>
          <p className="text-sm text-rose-700">
            {(proposeError || delegateError || voteError || queueError || executeError as Error).message}
          </p>
          {queueError && (
            <p className="mt-2 text-xs text-rose-600">
              💡 Tip: Make sure the proposal is in "Succeeded" state before queueing. The voting
              period must have ended and the proposal must have reached quorum.
            </p>
          )}
          {executeError && (
            <p className="mt-2 text-xs text-rose-600">
              💡 Tip: Make sure the proposal is in "Queued" state and the timelock delay has expired before executing.
            </p>
          )}
        </div>
      )}
    </>
  );
}

