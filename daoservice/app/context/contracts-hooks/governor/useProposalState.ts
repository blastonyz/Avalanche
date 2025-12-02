import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { SimpleGovernorAbi } from "@/abis/SimpleGovernorAbi";
import { StateParams } from "../types/hookTypes";

export function useProposalState({ governorAddress, proposalId }: StateParams) {
  const publicClient = usePublicClient();

  // Convert BigInt to string for query key serialization
  const proposalIdString = proposalId ? proposalId.toString() : '0';

  return useQuery({
    queryKey: ["proposalState", governorAddress, proposalIdString],
    queryFn: async () => {
      if (!publicClient) throw new Error("Public client not available");
      if (!proposalId || proposalId === BigInt(0)) {
        throw new Error("Invalid proposal ID");
      }

      return await publicClient.readContract({
        address: governorAddress,
        abi: SimpleGovernorAbi,
        functionName: "state",
        args: [proposalId],
      });
    },
    enabled: proposalId !== null && proposalId !== BigInt(0) && !!governorAddress,
    refetchInterval: 5000, // Refetch every 5 seconds to check state changes
  });
}