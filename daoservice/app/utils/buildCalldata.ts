import { encodeFunctionData } from 'viem';
import { SimpleTokenAbi } from '@/abis/SimpleTokenAbi';
import { parseEther } from 'viem';

/**
 * Builds calldata for a token transfer proposal
 * @param recipient - The recipient address
 * @param amount - The amount as a string (e.g., "0.1")
 * @returns The encoded calldata
 */
export function buildCalldata(
  recipient: `0x${string}`,
  amount: string
): `0x${string}` {
  const parsedAmount = parseEther(amount);
  
  return encodeFunctionData({
    abi: SimpleTokenAbi,
    functionName: 'transfer',
    args: [recipient, parsedAmount],
  });
}

