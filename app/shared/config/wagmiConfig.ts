import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'viem'
import { sepolia } from 'wagmi/chains'

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  console.error('❌ VITE_WALLETCONNECT_PROJECT_ID is not set!')
}

export const wagmiConfig = getDefaultConfig({
  appName: 'Fundhive DApp',
  projectId: projectId || 'dummy-fallback-id',
  chains: [sepolia],
  transports: {
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com', {
      batch: true,
      timeout: 30_000
    })
  }
})
