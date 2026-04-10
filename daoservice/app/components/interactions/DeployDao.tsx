'use client';
import OrganizationForm, { OrgFormData } from '../forms/Organizationform';
import { useDeployDao } from '@/app/context/contracts-hooks/useDeployDao';

export default function DeployDao({ factoryAddress }: { factoryAddress: `0x${string}` }) {
    const { mutateAsync, isPending, isSuccess, data, error } = useDeployDao(factoryAddress);

    async function handleSubmit(formData: OrgFormData) {
        try {
            await mutateAsync({
                ...formData
            });

        } catch (err) {
            console.error('Deploy failed:', err);
        }
    }

    return (
                <div className="space-y-5">
                        <div>
                                <h3 className="text-2xl font-bold text-slate-900">Define Your Identity</h3>
                                <p className="mt-2 text-sm text-slate-600">
                                        Configure your DAO profile and governance defaults before deployment.
                                </p>
                        </div>

            <OrganizationForm onSubmit={handleSubmit} />
                        {isPending && (
                            <p className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-700">
                                Deploying DAO...
                            </p>
                        )}

                        {isSuccess && (
                            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                                DAO deployed successfully.
                            </p>
                        )}
           
                        {error && (
                            <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                                Error: {error.message}
                            </p>
                        )}
        </div>
    );
}