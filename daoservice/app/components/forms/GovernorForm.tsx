'use client';

import { useState } from 'react';
import { useGovernor, useGovernorActions } from '@/app/context/contracts-hooks/useGovernor';
import { encodeFunctionData } from 'viem';
import { SimpleTokenAbi } from '@/abis/SimpleTokenAbi';

export function GovernorForm() {
  const { delegateVotes } = useGovernorActions();
  
  const [recipient, setRecipient] = useState<`0x${string}`>('0x...');
  const [amount, setAmount] = useState<string>('0.1');
  const [description, setDescription] = useState<string>('Transfer test funds');

  const { mutateAsync, isPending, isSuccess, error } = useGovernor();

const handleSubmit = async () => {
  try {
    const calldata = encodeFunctionData({
      abi: SimpleTokenAbi,
      functionName: 'transfer',
      args: ['0x00F2F5cd407d125cCAd91EDc89394eF220f0f754', BigInt(Math.floor(parseFloat(amount) * 1e18))],
    });

    await mutateAsync({
      governorAddress: '0x4dF4178A9cb71cff072848Aa2CD007c02CF072bF',
      target: '0x37f6a860625a68b414C2D4c63840212f4271d3C0',
      value: 0n,
      calldata: calldata as `0x${string}`,
      description: 'Propuesta2: enviar 1000 tokens al Treasury para financiar',
    });

    console.log('✅ Propuesta enviada');
  } catch (err) {
    console.error(`❌ Error al proponer: ${(err as Error).message}`);
  }
};


  const handleDelegate = async () => {
  try {
    await delegateVotes(
      '0x37f6a860625a68b414C2D4c63840212f4271d3C0',
      '0x0571235134DC15a00f02916987C2c16b5fC52E2A'
    );
    console.log('✅ Votos delegados');
  } catch (err) {
    console.error(`❌ Error al delegar: ${(err as Error).message}`);
  }
};


  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Crear y ejecutar propuesta</h2>

      <input
        type="text"
        placeholder="Dirección del destinatario"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value as `0x${string}`)}
        className="input"
      />

      <input
        type="number"
        placeholder="Monto en AVAX"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="input"
      />

      <textarea
        placeholder="Descripción de la propuesta"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="textarea"
      />

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="btn btn-primary"
      >
        {isPending ? 'Procesando...' : 'Proponer y ejecutar'}
      </button>
      <button onClick={handleDelegate}>Delegar votos</button>


      {isSuccess && <p className="text-green-600">✅ Propuesta ejecutada con éxito</p>}
      {error && <p className="text-red-600">❌ Error: {(error as Error).message}</p>}
    </div>
  );
}