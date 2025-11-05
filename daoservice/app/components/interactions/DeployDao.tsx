'use client';
import OrganizationForm, { OrgFormData } from '../forms/Organizationform';
import { useDeployDao } from '@/app/context/contracts-hooks/useDeployDao';

export default function DeployDao({ factoryAddress }: { factoryAddress: `0x${string}` }) {
    const { mutateAsync, isPending, isSuccess, data, error } = useDeployDao(factoryAddress);

    async function handleSubmit(formData: OrgFormData) {
        try {
            await mutateAsync({
                ...formData,
                treasury: formData.treasury as `0x${string}`,
            });

        } catch (err) {
            console.error('Deploy failed:', err);
        }
    }

    return (
        <div>
            <h2>Deploy a new DAO</h2>
            <OrganizationForm onSubmit={handleSubmit} />
            {isPending && <p>Deploying DAO...</p>}
            {isSuccess && <p>DAO deployed! Tx hash: {data}</p>}
            {error && <p>Error: {error.message}</p>}
        </div>
    );
}