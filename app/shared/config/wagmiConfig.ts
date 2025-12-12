// src/lib/wagmiConfig.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { fallback, http } from 'viem'
import { sepolia } from 'wagmi/chains'

// Get WalletConnect Project ID
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

// Log for debugging
if (!projectId) {
  console.error('❌ VITE_WALLETCONNECT_PROJECT_ID is not set!')
  console.error('This will cause WalletConnect to fail.')
}

export const wagmiConfig = getDefaultConfig({
  appName: 'Fundhive DApp',
  projectId: projectId || 'dummy-fallback-id',
  chains: [sepolia],
  // Use multiple public RPC endpoints with fallback
  // If one fails, it will automatically try the next one
  transports: {
    [sepolia.id]: fallback([
      http('https://ethereum-sepolia-rpc.publicnode.com'),
      http('https://eth-sepolia.public.blastapi.io'),
      http('https://rpc2.sepolia.org'),
      http('https://rpc.sepolia.org')
    ])
  }
})
