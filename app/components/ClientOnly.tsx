import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { type ReactNode, useEffect, useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from '@/shared/config/wagmiConfig'

export function ClientOnly({ children }: { children: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
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
  return (
    <ClientOnly>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </WagmiProvider>
    </ClientOnly>
  )
}
