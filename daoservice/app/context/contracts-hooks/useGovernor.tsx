import { useMutation } from "@tanstack/react-query";
import { useWalletClient, usePublicClient } from "wagmi";
import { SimpleTokenAbi } from "@/abis/SimpleTokenAbi";
import { SimpleGovernorAbi } from "@/abis/SimpleGovernorAbi";
import { encodeFunctionData, decodeFunctionResult, keccak256, toHex } from "viem";


type VotationParams = {
  governorAddress: `0x${string}`;
  target: `0x${string}`;
  value: bigint;
  calldata: `0x${string}`;
  description: string;
};

export function useGovernor() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const mutation = useMutation({
    mutationFn: async (params: VotationParams) => {
      if (!walletClient || !publicClient) throw new Error("Wallet or public client not available");

      const { governorAddress, target, value, calldata, description } = params;

      // 1️⃣ Propose
      const proposeTx = await walletClient.writeContract({
        address: governorAddress,
        abi: SimpleGovernorAbi,
        functionName: "propose",
        args: [[target], [value], [calldata], description],
      });

      // 2️⃣ Compute proposalId
      const descriptionHash = keccak256(toHex(description))
      console.log("desc hash: ",descriptionHash);
      
      const proposalId = await publicClient.readContract({
        address: governorAddress,
        abi: SimpleGovernorAbi,
        functionName: "hashProposal",
        args: [[target], [value], [calldata], descriptionHash],
      });
{/*
      // 3️⃣ Vote
      await walletClient.writeContract({
        address: governorAddress,
        abi: SimpleGovernorAbi,
        functionName: "castVote",
        args: [proposalId, 1],
      });

      // 4️⃣ Queue
      await walletClient.writeContract({
        address: governorAddress,
        abi: SimpleGovernorAbi,
        functionName: "queue",
        args: [[target], [value], [calldata], descriptionHash],
      });

      // 5️⃣ Execute
      await walletClient.writeContract({
        address: governorAddress,
        abi: SimpleGovernorAbi,
        functionName: "execute",
        args: [[target], [value], [calldata], descriptionHash],
      });*/}

      return { proposalId, proposeTx };
    },
  });

  return mutation;
  
}

export function useGovernorActions() {
  const { data: walletClient } = useWalletClient();

  const delegateVotes = async (tokenAddress: `0x${string}`, delegateTo: `0x${string}`) => {
    if (!walletClient) throw new Error('Wallet not available');

    return await walletClient.writeContract({
      address: tokenAddress,
      abi: SimpleTokenAbi,
      functionName: 'delegate',
      args: [delegateTo],
    });
  };

  return { delegateVotes /* + otras funciones como propose, vote, etc */ };
}
