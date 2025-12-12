import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { type ReactNode, useEffect, useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from '@/shared/config/wagmiConfig'

export function ClientOnly({ children }: { children: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    console.log('✅ ClientOnly mounted!')
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    console.log('⏳ ClientOnly waiting for mount...')
    return null
  }

  return <>{children}</>
}

// Wrap both WagmiProvider and RainbowKitProvider in ClientOnly
// This prevents SSR issues in dev mode where Web3 hooks can't run on server
export function Web3ClientProvider({
  children
}: {
  children: ReactNode
}) {
  console.log('🔧 Web3ClientProvider rendering...')
  console.log('📋 Wagmi config:', wagmiConfig)
  
  return (
    <ClientOnly>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </WagmiProvider>
    </ClientOnly>
  )
}
