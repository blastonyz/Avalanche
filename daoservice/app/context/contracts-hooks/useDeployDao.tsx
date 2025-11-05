import { useMutation } from '@tanstack/react-query';
import { useWalletClient } from 'wagmi';
import { GovernorFactoryAbi } from "../../../abis/GovernorFactoryAbi";
import { Address, encodeFunctionData } from 'viem';

type DeployParams = {
   name: string;
  description: string;
  token: string;
  quorumPercent: number;
};

export function useDeployDao(factoryAddress: Address) {
    const { data: walletClient } = useWalletClient();

    const mutation = useMutation({
        mutationFn: async (params: DeployParams) => {
            if (!walletClient) throw new Error('Wallet not connected');

            const calldata = encodeFunctionData({
                abi: GovernorFactoryAbi,
                functionName: 'deployDAO',
                args: [
                    params.name,
                    params.description,
                    params.token,
                    BigInt(params.quorumPercent),
                ],
            });

            return await walletClient.writeContract({
                address: factoryAddress,
                abi: GovernorFactoryAbi,
                functionName: 'deployDAO',
                 args: [
                    params.name,
                    params.description,
                    params.token,
                    BigInt(params.quorumPercent),
                ],
            });
        },
    });

    return mutation;
}