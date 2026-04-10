'use client';
import { useState } from 'react';

export type OrgFormData = {
  name: string;
  description: string;
  token: string;
  quorumPercent: number;
};


export default function OrganizationForm({ onSubmit }: { onSubmit: (data: OrgFormData) => void }) {
  const defaultForm: OrgFormData = {
  name: '',
  description: '',
  token: '0x37f6a860625a68b414C2D4c63840212f4271d3C0',
  quorumPercent: 5,
};

  
  const [form, setForm] = useState<OrgFormData>(defaultForm);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'quorumPercent' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    onSubmit(form);
  };

return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">DAO Name</label>
        <input
          name="name"
          placeholder="e.g. Atlas Protocol"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-slate-300 bg-slate-100/60 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Manifesto</label>
        <textarea
          name="description"
          placeholder="Describe your mission..."
          value={form.description}
          onChange={handleChange}
          rows={3}
          required
          className="w-full resize-none rounded-lg border border-slate-300 bg-slate-100/60 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Token Address</label>
          <input
            name="token"
            placeholder="0x..."
            value={form.token}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 bg-slate-100/60 px-4 py-3 font-mono text-xs outline-none transition focus:border-cyan-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Quorum Percent</label>
          <input
            name="quorumPercent"
            type="number"
            min={1}
            max={100}
            value={form.quorumPercent}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 bg-slate-100/60 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="neo-button rounded-lg px-7 py-3 text-sm font-semibold text-white">
          Deploy DAO
        </button>
      </div>
    </form>
  );
}