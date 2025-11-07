import { useMutation } from "@tanstack/react-query";
import { useWalletClient } from "wagmi";
import { SimpleGovernorAbi } from "@/abis/SimpleGovernorAbi";
import { keccak256, stringToBytes } from "viem";
import { ExecuteParams } from "../types/hookTypes";

export function useExecuteProposal() {
  const { data: walletClient } = useWalletClient();

  return useMutation({
    mutationFn: async ({ governorAddress, target, value, calldata, description }: ExecuteParams) => {
      if (!walletClient) throw new Error("Wallet not connected");

      const descriptionHash = keccak256(stringToBytes(description));

      return await walletClient.writeContract({
        address: governorAddress,
        abi: SimpleGovernorAbi,
        functionName: "execute",
        args: [[target], [value], [calldata], descriptionHash],
      });
    },
  });
}