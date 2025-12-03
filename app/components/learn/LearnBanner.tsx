import { Button } from '@/components/ui/button'
import { Link } from 'react-router'

type LearnBannerProps = {
  onDismiss: () => void
}

export function LearnBanner({ onDismiss }: LearnBannerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 text-white shadow-2xl">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-start justify-between gap-3">
          {/* Content */}
          <div className="flex items-start gap-2 sm:gap-4 flex-1 min-w-0">
            <div className="text-2xl sm:text-4xl animate-bounce  shrink-0">
              💰
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-xl font-bold flex flex-wrap items-center gap-2 mb-1">
                <span className="whitespace-nowrap">
                  Learn English - Earn ETH!
                </span>
                <span className="text-xs bg-yellow-400 text-green-900 px-2 py-0.5 rounded-full font-bold">
                  NEW
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-green-50">
                Answer <span className="font-bold">10 quiz questions</span>{' '}
                correctly → Get{' '}
                <span className="font-bold text-yellow-300">0.02 ETH</span>{' '}
                <span className="hidden sm:inline">Sepolia for free! 🎁</span>
              </p>

              {/* Mobile Button */}
              <Link to="/learn" className="block sm:hidden mt-3">
                <Button
                  size="sm"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-green-900 font-bold shadow-lg"
                >
                  🚀 Start Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Desktop Button & Close */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <Link to="/learn">
              <Button
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-green-900 font-bold shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
              >
                🚀 Start Now
              </Button>
            </Link>
            <button
              onClick={onDismiss}
              className="text-white/80 hover:text-white text-2xl"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onDismiss}
            className="sm:hidden text-white/80 hover:text-white text-xl shrink-0"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
