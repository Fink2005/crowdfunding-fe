import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from 'react-router'

import { RainbowKitClientProvider } from '@/components/ClientOnly'
import FuzzyText from '@/components/FuzzyText'
import TanstackProvider from '@/components/providers/TanstackProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import '@rainbow-me/rainbowkit/styles.css'
import type { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import type { Route } from './+types/root'
import './app.css'
import { wagmiConfig } from './shared/config/wagmiConfig'

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous'
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'
  }
]

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <WagmiProvider config={wagmiConfig}>
          <TanstackProvider>
            <RainbowKitClientProvider>
              <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                {children}
                <Toaster position="top-right" />
              </ThemeProvider>
            </RainbowKitClientProvider>
          </TanstackProvider>
        </WagmiProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let details = 'An unexpected error occurred.'
  let stack: string | undefined
  let isNotFound = false

  if (isRouteErrorResponse(error)) {
    details = error.statusText || details
    if (error.status === 404) {
      isNotFound = true
    }
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      {isNotFound && (
        <div className="w-full flex justify-center items-center ">
          <FuzzyText
            baseIntensity={0.2}
            hoverIntensity={0.18}
            enableHover={true}
            children="404"
          />
        </div>
      )}
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
