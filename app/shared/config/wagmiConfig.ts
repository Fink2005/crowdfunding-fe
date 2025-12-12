// src/lib/wagmiConfig.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'

export const wagmiConfig = getDefaultConfig({
  appName: 'Fundhive DApp',
  projectId:
    import.meta.env.VITE_WALLETCONNECT_PROJECT_ID! ||
    '0xF0FF7e67C2EBA417c7E0F0f8e1F8E7EA55c0aa73',
  chains: [sepolia]
})
