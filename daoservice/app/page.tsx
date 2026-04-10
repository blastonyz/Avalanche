'use client';

import dynamic from 'next/dynamic';

const GetDaos = dynamic(() => import('./components/daos/GetDaos'), { ssr: false });
const DeployDao = dynamic(() => import('./components/interactions/DeployDao'), { ssr: false });

export default function Home() {
  return (
    <div className="text-slate-100">
      <main className="w-full overflow-x-hidden">
        <section className="relative min-h-screen pt-20">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/back-multidao2.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_50%,rgba(68,193,255,0.2),transparent_45%)]" />

          <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-16 text-center md:px-10">
            <p className="mb-6 text-xs uppercase tracking-[0.28em] text-cyan-200/80">Institutional Sovereign Systems</p>
            <h1 className="max-w-3xl text-5xl font-bold leading-[0.95] md:text-7xl">
              The Future of <span className="title-gradient">Sovereign Governance</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base text-slate-300 md:text-lg">
              Launch, manage, and scale decentralized organizations with institutional-grade tooling for modern onchain coordination.
            </p>

            <div className="mt-12 flex w-full max-w-xl flex-wrap items-center justify-around gap-6 md:gap-10">
              <a href="#create" className="neo-button rounded-lg px-6 py-3 text-sm font-semibold text-white">
                Get Started
              </a>
              <a
                href="#explore"
                className="rounded-lg border border-slate-300/25 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
              >
                Explore DAOs
              </a>
            </div>

            <div className="mt-16 flex w-full max-w-md items-center justify-around gap-8 text-slate-200/90">
              <div className="text-center">
                <p className="font-mono text-2xl font-semibold">1.2B+</p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Total Assets Locked</p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div className="text-center">
                <p className="font-mono text-2xl font-semibold">4,200</p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Active Organizations</p>
              </div>
            </div>
          </div>
        </section>

        <section id="explore" className="section-grid border-y border-white/10 bg-[#f2f6fb] px-6 py-24 text-slate-900 md:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-12 flex flex-col gap-4">
              <h2 className="text-4xl font-bold tracking-tight">Explore High-Performance DAOs</h2>
              <p className="max-w-2xl text-slate-600">
                Select an organization and interact with governance proposals directly from the protocol control layer.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_30px_60px_rgba(10,20,40,0.08)] md:p-10">
              <GetDaos />
            </div>
          </div>
        </section>

        <section id="create" className="bg-[linear-gradient(180deg,#cfd9e4_0%,#e8edf2_100%)] px-6 py-24 text-slate-900 md:px-10">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold tracking-tight">Architect Your Organization</h2>
              <p className="mt-3 text-slate-600">Step-by-step institutional configuration and deployment.</p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-300/70 bg-white shadow-[0_32px_60px_rgba(25,35,48,0.2)]">
              <div className="grid md:grid-cols-[240px_1fr]">
                <aside className="bg-slate-950 p-8 text-slate-200">
                  <ol className="space-y-8">
                    <li className="flex items-start gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-white">1</span>
                      <div>
                        <p className="text-sm font-semibold">Basic Info</p>
                        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Identity and Purpose</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 opacity-60">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-500 text-xs font-bold">2</span>
                      <div>
                        <p className="text-sm font-semibold">Governance</p>
                        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Consensus Rules</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 opacity-60">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-500 text-xs font-bold">3</span>
                      <div>
                        <p className="text-sm font-semibold">Tokenomics</p>
                        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Asset Allocation</p>
                      </div>
                    </li>
                  </ol>
                </aside>

                <div className="p-6 md:p-10">
                  <DeployDao factoryAddress="0x7E4786C7B2d31A7EE6EaF2f3557aF53bd0C680EE" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 bg-[#050a15] px-6 py-10 text-slate-300 md:px-10">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-xl font-bold text-white">MultiDAO</p>
              <p className="mt-1 text-sm text-slate-400">© 2026 MultiDAO. The Architectural Ledger.</p>
            </div>

            <div className="flex gap-8 text-sm text-slate-400">
              <a href="#" className="transition hover:text-white">Terms</a>
              <a href="#" className="transition hover:text-white">Privacy</a>
              <a href="#" className="transition hover:text-white">Docs</a>
              <a href="#" className="transition hover:text-white">GitHub</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
