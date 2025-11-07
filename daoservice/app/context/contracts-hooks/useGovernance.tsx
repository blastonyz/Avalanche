import { usePropose } from "./governor/usePropose";
import { useCastVote } from "./governor/useCastVote";
import { useQueueProposal } from "./governor/useQueueProposal";
import { useExecuteProposal } from "./governor/useExecuteProposal";
import { useProposalState } from "./governor/useProposalState";
import { useDelegateVotes } from "./governor/useDelegateVotes";

export function useGovernance() {
  const propose = usePropose();
  const castVote = useCastVote();
  const queueProposal = useQueueProposal();
  const executeProposal = useExecuteProposal();
  const delegateVotes = useDelegateVotes();

  return {
    propose,
    castVote,
    queueProposal,
    executeProposal,
    delegateVotes,
    useProposalState, 
  };
}
