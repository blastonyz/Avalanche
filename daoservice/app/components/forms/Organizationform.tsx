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

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name] : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    onSubmit(form);
  };

return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />
      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <button type="submit" className="btn btn-primary">
        Deploy DAO
      </button>
    </form>
  );
}