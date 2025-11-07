import { useMutation } from "@tanstack/react-query";
import { useWalletClient } from "wagmi";
import { SimpleGovernorAbi } from "@/abis/SimpleGovernorAbi";
import { VoteParams } from "../types/hookTypes";

export function useCastVote() {
  const { data: walletClient } = useWalletClient();

  return useMutation({
    mutationFn: async ({ governorAddress, proposalId, support, reason }: VoteParams) => {
      if (!walletClient) throw new Error("Wallet not connected");

      return await walletClient.writeContract({
        address: governorAddress,
        abi: SimpleGovernorAbi,
        functionName: "castVoteWithReason",
        args: [proposalId, support, reason],
      });
    },
  });
}

