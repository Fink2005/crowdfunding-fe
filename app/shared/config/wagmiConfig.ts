// src/lib/wagmiConfig.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'

export const wagmiConfig = getDefaultConfig({
  appName: 'Fundhive DApp',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID!,
  chains: [sepolia]
})
