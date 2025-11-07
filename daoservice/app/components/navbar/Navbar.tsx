'use client'
import dynamic from 'next/dynamic';
const ConnectWallet = dynamic(() => import('../connection/ConnectWallet'), { ssr: false });

const Navbar = () => {
 
    return(
        <div>
            <ConnectWallet/>
        </div>
    )
}

export default Navbar;