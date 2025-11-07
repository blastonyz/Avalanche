import { useMutation } from "@tanstack/react-query";
import { useWalletClient, usePublicClient } from "wagmi";
import { SimpleGovernorAbi } from "@/abis/SimpleGovernorAbi";
import { keccak256, stringToBytes } from "viem";
import { VotationParams } from "../types/hookTypes";

export function usePropose() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  return useMutation<{
    proposalId: bigint;
    proposeTx: `0x${string}`;
    descriptionHash: `0x${string}`;
  }, Error, VotationParams>({
    mutationFn: async ({ governorAddress, target, value, calldata, description }: VotationParams) => {
      if (!walletClient || !publicClient) throw new Error("Wallet or public client not available");

      const proposeTx = await walletClient.writeContract({
        address: governorAddress,
        abi: SimpleGovernorAbi,
        functionName: "propose",
        args: [[target], [value], [calldata], description],
      });

      await publicClient.waitForTransactionReceipt({ hash: proposeTx });

      const descriptionHash = keccak256(stringToBytes(description));

      const proposalId = await publicClient.readContract({
        address: governorAddress,
        abi: SimpleGovernorAbi,
        functionName: "hashProposal",
        args: [[target], [value], [calldata], descriptionHash],
      }) as bigint;

      return {
        proposalId,
        proposeTx,
        descriptionHash,
      };
    },
  });
}