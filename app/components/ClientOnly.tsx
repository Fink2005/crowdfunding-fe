import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { type ReactNode, useEffect, useState } from 'react'

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

export function RainbowKitClientProvider({
  children
}: {
  children: ReactNode
}) {
  return (
    <ClientOnly>
      <RainbowKitProvider>{children}</RainbowKitProvider>
    </ClientOnly>
  )
}
