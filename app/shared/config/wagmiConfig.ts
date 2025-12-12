// src/lib/wagmiConfig.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'viem'
import { sepolia } from 'wagmi/chains'

// Get WalletConnect Project ID
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

// Log for debugging
console.log('🔧 Initializing Wagmi config...')
console.log('  - Project ID:', projectId ? '✅ Set' : '❌ Missing')

if (!projectId) {
  console.error('❌ VITE_WALLETCONNECT_PROJECT_ID is not set!')
  console.error('This will cause WalletConnect to fail.')
}

console.log('  - Using RPC: https://ethereum-sepolia-rpc.publicnode.com')

export const wagmiConfig = getDefaultConfig({
  appName: 'Fundhive DApp',
  projectId: projectId || 'dummy-fallback-id',
  chains: [sepolia],
  // Use single stable RPC endpoint (publicnode is usually most reliable)
  transports: {
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com', {
      batch: true,
      timeout: 30_000
    })
  }
})

console.log('✅ Wagmi config initialized successfully')
