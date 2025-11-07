import { useMutation } from "@tanstack/react-query";
import { useWalletClient } from "wagmi";
import { SimpleTokenAbi } from "@/abis/SimpleTokenAbi";

type DelegateParams = {
  tokenAddress: `0x${string}`;
  delegateTo: `0x${string}`;
};

export function useDelegateVotes() {
  const { data: walletClient } = useWalletClient();

  return useMutation({
    mutationFn: async ({ tokenAddress, delegateTo }: DelegateParams) => {
      if (!walletClient) throw new Error("Wallet not available");

      return await walletClient.writeContract({
        address: tokenAddress,
        abi: SimpleTokenAbi,
        functionName: "delegate",
        args: [delegateTo],
      });
    },
  });
}
