// src/lib/wagmiConfig.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'viem'
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
  // Add custom RPC endpoints
  transports: {
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/demo')
  }
})
