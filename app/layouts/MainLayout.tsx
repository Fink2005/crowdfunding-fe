// src/layouts/MainLayout.tsx

import Header from '@/components/Header'
import { LearnBanner } from '@/components/learn/LearnBanner'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'

export default function MainLayout() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('learn_banner_dismissed')
    if (!dismissed) {
      setShowBanner(true)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex mt-10">
        <main className={`flex-1 p-5 ${showBanner ? 'pb-24' : ''}`}>
          <Outlet />
        </main>
      </div>
      <footer className="h-10 border-t border-gray-200 flex items-center justify-center text-sm text-gray-600">
        © {new Date().getFullYear()} Crowdfunding
      </footer>

      {showBanner && (
        <div data-learn-banner>
          <LearnBanner />
        </div>
      )}
    </div>
  )
}
