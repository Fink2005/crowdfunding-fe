import { Button } from '@/components/ui/button'
import { Link } from 'react-router'

export function LearnBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white shadow-2xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl animate-bounce">💰</div>
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                Learn English - Earn ETH!
                <span className="text-sm bg-yellow-400 text-green-900 px-2 py-1 rounded-full font-bold">
                  NEW
                </span>
              </h3>
              <p className="text-sm text-green-50">
                Answer <span className="font-bold">10 quiz questions</span>{' '}
                correctly → Get{' '}
                <span className="font-bold text-yellow-300">0.4 ETH</span>{' '}
                Sepolia for free! 🎁
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
              <span>🔥 Streak:</span>
              <span className="font-bold">0 days</span>
            </div>
            <Link to="/learn">
              <Button
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-green-900 font-bold shadow-lg hover:shadow-xl transition-all"
              >
                🚀 Start Now
              </Button>
            </Link>
            <button
              onClick={() => {
                const banner = document.querySelector('[data-learn-banner]')
                if (banner) (banner as HTMLElement).style.display = 'none'
                localStorage.setItem('learn_banner_dismissed', 'true')
              }}
              className="text-white/80 hover:text-white text-2xl"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
