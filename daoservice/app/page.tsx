'use client'
import dynamic from 'next/dynamic';
const GovernorForm = dynamic(() => import('./components/forms/GovernorForm'), { ssr: false });
const DeployDao = dynamic(() => import('./components/interactions/DeployDao'), { ssr: false });


export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <DeployDao factoryAddress="0x7E4786C7B2d31A7EE6EaF2f3557aF53bd0C680EE" />

        <GovernorForm
          governorAddress="0x7b1fddcc54fcb5f585e4d49822336356d1b7c351"
          tokenAddress="0x37f6a860625a68b414C2D4c63840212f4271d3C0"
          userAddress="0x0571235134DC15a00f02916987C2c16b5fC52E2A"
        />

      </main>
    </div>
  );
}
