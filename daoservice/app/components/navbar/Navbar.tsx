'use client'
import dynamic from 'next/dynamic';
const ConnectWallet = dynamic(() => import('../connection/ConnectWallet'), { ssr: false });

const Navbar = () => {
    return (
        <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#041126]/80 backdrop-blur-xl">
            <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-6 md:px-10">
                <a href="#" className="text-lg font-bold tracking-tight text-white">
                    MultiDAO
                </a>

                <div className="hidden items-center gap-7 md:flex">
                    <a href="#explore" className="border-b border-white text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                        Explore DAOs
                    </a>
                    <a href="#create" className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300 transition hover:text-white">
                        Create
                    </a>
                    <a href="#explore" className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300 transition hover:text-white">
                        Governance
                    </a>
                    <a href="#" className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300 transition hover:text-white">
                        Ecosystem
                    </a>
                </div>

                <ConnectWallet />
            </div>
        </nav>
    );
}

export default Navbar;