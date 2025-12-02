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
        <p className="text-green-600">✅ Propuesta creada</p>
      )}
      {isDelegateSuccess && (
        <p className="text-green-600">✅ Votos delegados</p>
      )}
      {isVoteSuccess && <p className="text-green-600">✅ Voto emitido</p>}
      {isExecuteSuccess && <p className="text-green-600">✅ Propuesta ejecutada</p>}

      {hasError && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-red-600 font-medium mb-1">Error:</p>
          <p className="text-sm text-red-600">
            {(proposeError || delegateError || voteError || queueError || executeError as Error).message}
          </p>
          {queueError && (
            <p className="text-xs text-red-500 mt-2">
              💡 Tip: Make sure the proposal is in "Succeeded" state before queueing. The voting
              period must have ended and the proposal must have reached quorum.
            </p>
          )}
          {executeError && (
            <p className="text-xs text-red-500 mt-2">
              💡 Tip: Make sure the proposal is in "Queued" state and the timelock delay has expired before executing.
            </p>
          )}
        </div>
      )}
    </>
  );
}

