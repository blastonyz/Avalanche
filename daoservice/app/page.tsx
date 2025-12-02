'use client'
import dynamic from 'next/dynamic';
const GetDaos = dynamic(() => import('./components/daos/GetDaos'), { ssr: false });
const DeployDao = dynamic(() => import('./components/interactions/DeployDao'), { ssr: false });


export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-start justify-start py-8 px-4 md:px-16 bg-white dark:bg-black">
        <div className="w-full space-y-8">
          <div className="border-b pb-4">
            <h1 className="text-3xl font-bold mb-2">DAO Governance Platform</h1>
            <p className="text-gray-600">Deploy and manage your DAOs</p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Deploy New DAO</h2>
              <DeployDao factoryAddress="0x7E4786C7B2d31A7EE6EaF2f3557aF53bd0C680EE" />
            </div>

            <div className="border-t pt-6">
              <GetDaos />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
