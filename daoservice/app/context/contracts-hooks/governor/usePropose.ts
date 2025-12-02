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

      // Ensure value is BigInt and convert to array format
      const valuesArray: bigint[] = [typeof value === 'bigint' ? value : BigInt(value || 0)];
      const targetsArray: `0x${string}`[] = [target];
      const calldatasArray: `0x${string}`[] = [calldata];

      // Get the account address
      const [account] = await walletClient.getAddresses();
      if (!account) throw new Error("No wallet account available");

      // Simulate the contract call first to catch revert reasons
      try {
        await publicClient.simulateContract({
          address: governorAddress,
          abi: SimpleGovernorAbi,
          functionName: "propose",
          args: [targetsArray, valuesArray, calldatasArray, description],
          account,
        });
      } catch (simError: any) {
        console.error("Proposal simulation failed:", simError);
        // Provide more helpful error messages
        if (simError?.shortMessage?.includes('threshold') || simError?.message?.includes('threshold')) {
          throw new Error("Proposal threshold not met. You need more voting power to create a proposal.");
        }
        if (simError?.shortMessage?.includes('delegate') || simError?.message?.includes('delegate')) {
          throw new Error("You need to delegate voting power to yourself before proposing.");
        }
        throw new Error(`Proposal would revert: ${simError?.shortMessage || simError?.message || 'Unknown error'}`);
      }
      
      const proposeTx = await walletClient.writeContract({
        address: governorAddress,
        abi: SimpleGovernorAbi,
        functionName: "propose",
        args: [targetsArray, valuesArray, calldatasArray, description],
      });

      await publicClient.waitForTransactionReceipt({ hash: proposeTx });

      const descriptionHash = keccak256(stringToBytes(description));

      // Use the same valuesArray for consistency
      const proposalId = await publicClient.readContract({
        address: governorAddress,
        abi: SimpleGovernorAbi,
        functionName: "hashProposal",
        args: [targetsArray, valuesArray, calldatasArray, descriptionHash],
      }) as bigint;

      return {
        proposalId,
        proposeTx,
        descriptionHash,
      };
    },
  });
}