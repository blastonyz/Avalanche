import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { SimpleGovernorAbi } from "@/abis/SimpleGovernorAbi";
import { StateParams } from "../types/hookTypes";

export function useProposalState({ governorAddress, proposalId }: StateParams) {
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ["proposalState", governorAddress, proposalId],
    queryFn: async () => {
      if (!publicClient) throw new Error("Public client not available");

      return await publicClient.readContract({
        address: governorAddress,
        abi: SimpleGovernorAbi,
        functionName: "state",
        args: [proposalId],
      });
    },
  });
}