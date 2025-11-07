import { useMutation } from "@tanstack/react-query";
import { useWalletClient } from "wagmi";
import { SimpleGovernorAbi } from "@/abis/SimpleGovernorAbi";
import { keccak256, stringToBytes } from "viem";
import { QueueParams } from "../types/hookTypes";

export function useQueueProposal() {
  const { data: walletClient } = useWalletClient();

  return useMutation({
    mutationFn: async ({ governorAddress, target, value, calldata, description }: QueueParams) => {
      if (!walletClient) throw new Error("Wallet not connected");

      const descriptionHash = keccak256(stringToBytes(description));

      return await walletClient.writeContract({
        address: governorAddress,
        abi: SimpleGovernorAbi,
        functionName: "queue",
        args: [[target], [value], [calldata], descriptionHash],
      });
    },
  });
}