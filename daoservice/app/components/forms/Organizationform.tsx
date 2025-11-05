'use client';
import { useState } from 'react';

export type OrgFormData = {
  name: string;
  description: string;
  token: string;
  quorumPercent: number;
};


export default function OrganizationForm({ onSubmit }: { onSubmit: (data: OrgFormData) => void }) {
  const [form, setForm] = useState<OrgFormData>({
    name: '',
    description: '',
    token: '0x37f6a860625a68b414C2D4c63840212f4271d3C0',
    quorumPercent: 5,
  });

  return (
    <div className='flex flex-col'>
      <form
        onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}
        className='flex flex-col'  >
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Token Address" value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} />
        <input type="number" placeholder="Quorum (%)" value={form.quorumPercent} onChange={(e) => setForm({ ...form, quorumPercent: Number(e.target.value) })} />
        <button type="submit">Deploy DAO</button>
      </form>
    </div>

  );
}