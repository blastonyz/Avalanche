// useDeployDao.tsx
import { useMutation } from '@tanstack/react-query';
import { useWalletClient, usePublicClient } from 'wagmi';
import { GovernorFactoryAbi } from '../../../abis/GovernorFactoryAbi';
import type { Address } from 'viem';
import { sanitizeString } from '@/app/utils/SanitizeString';

type DeployParams = {
    name: string;
    description: string;
    token: string;
    quorumPercent: number;
};

type DaoDeployedLog = {
    address: Address;
    topics: [string, string, string];
    data: string;
};


export function useDeployDao(factoryAddress: Address) {
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();

    return useMutation({
        mutationFn: async (params: DeployParams) => {
            if (!walletClient || !publicClient) throw new Error('Wallet or public client not available');

            // 1) obtener account y chain info
            const [account] = await walletClient.getAddresses();
            if (!account) throw new Error('No wallet account available');
            console.log('Using account:', account);
            console.log('Wallet chain id:', walletClient.chain?.id);

            // 2) simular la llamada (detecta revert antes de firmar)
            let request;
            try {
                const sim = await publicClient.simulateContract({
                    address: factoryAddress,
                    abi: GovernorFactoryAbi,
                    functionName: 'deployDAO',
                    args: [
                        params.name,
                        params.description,
                        params.token,
                        BigInt(params.quorumPercent),
                    ],
                    account, // importante para providers que verifican cuenta
                });
                // simulateContract devuelve { request, ... } en esta versión
                request = (sim as any).request ?? sim.request;
                console.log('Simulation request OK:', request);
            } catch (simErr: any) {
                console.error('Simulation reverted or failed:', simErr);
                // Si simulate revierte, esto indica error on-chain o args inválidos
                throw simErr;
            }

            // 3) enviar transacción firmada por la wallet (usa writeContract)
            try {
                const cleanName = sanitizeString(params.name);
                const cleanDescription = sanitizeString(params.description);

                // walletClient.writeContract acepta request-like object
                const hash = await walletClient.writeContract({
                    address: factoryAddress,
                    abi: GovernorFactoryAbi,
                    functionName: 'deployDAO',
                    args: [
                        cleanName,
                        cleanDescription,
                        params.token,
                        BigInt(params.quorumPercent),
                    ],
                    account,
                });
                const receipt = await publicClient.waitForTransactionReceipt({ hash });
                console.log("Tx receipt:", receipt);
                const daoEvent = receipt.logs.find(
                    (log) =>
                        log.topics?.[0] ===
                        "0xb65e177e2dbb8fe226a2872aa6b81c26631fbd80b00462b30cf262024db53e37"
                );

                if (!daoEvent || daoEvent.topics.length < 3) {
                    throw new Error("DaoDeployed event malformed or missing topics");
                }

                const governor = `0x${daoEvent!.topics[1]!.slice(-40)}`;
                const treasury = `0x${daoEvent!.topics[2]!.slice(-40)}`;
                console.log('gov: ',governor);
                console.log('treasury: ',treasury);
                
                
                return {hash,governor,treasury}

            } catch (sendErr: any) {
                console.error('Deploy failed:', sendErr?.shortMessage ?? sendErr?.message ?? sendErr);
                console.error('Cause:', sendErr?.cause ?? sendErr);
                throw sendErr;
            }
        },
    });
}
