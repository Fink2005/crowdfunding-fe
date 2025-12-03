import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/components/ui/dialog'
import { motion } from 'framer-motion'

type QuizResultDialogProps = {
  isOpen: boolean
  score: number
  total: number
  onClaim: () => void
  onRetry: () => void
  isClaiming: boolean
}

export default function QuizResultDialog({
  isOpen,
  score,
  total,
  onClaim,
  onRetry,
  isClaiming
}: QuizResultDialogProps) {
  const isPerfect = score === total
  const percentage = Math.round((score / total) * 100)

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[450px] max-w-[95vw] p-0 overflow-hidden border-0">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-pink-500/5" />

        <div className="relative">
          {/* Emoji & Title */}
          <div className="text-center pt-12 pb-6 px-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-8xl mb-4 inline-block"
            >
              {isPerfect ? '🏆' : score >= total * 0.7 ? '🎯' : '📚'}
            </motion.div>
            <DialogTitle className="text-3xl font-bold mb-2">
              {isPerfect
                ? 'Perfect Score!'
                : score >= total * 0.7
                  ? 'Great Job!'
                  : 'Keep Going!'}
            </DialogTitle>
            <DialogDescription className="text-base">
              {isPerfect
                ? 'You are a vocabulary master! 🌟'
                : score >= total * 0.7
                  ? 'Almost there! Keep it up! 💪'
                  : 'Practice makes perfect! 🚀'}
            </DialogDescription>
          </div>

          {/* Score Circle */}
          <div className="flex justify-center px-6 pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="relative"
            >
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-muted/30"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                  animate={{
                    strokeDashoffset: `${2 * Math.PI * 88 * (1 - score / total)}`
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={
                    isPerfect
                      ? 'text-green-500'
                      : score >= total * 0.7
                        ? 'text-blue-500'
                        : 'text-orange-500'
                  }
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-black bg-linear-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {score}/{total}
                </div>
                <div className="text-lg font-semibold text-muted-foreground mt-1">
                  {percentage}%
                </div>
              </div>
            </motion.div>
          </div>

          {/* Reward Banner for Perfect Score */}
          {isPerfect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="mx-6 mb-6 p-5 rounded-2xl bg-linear-to-r from-yellow-400 to-orange-400 text-white relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-yellow-500/50 to-orange-500/50 animate-pulse" />
              <div className="relative flex items-center gap-4">
                <div className="text-5xl">💎</div>
                <div className="flex-1">
                  <div className="text-xl font-bold mb-1">Reward Unlocked!</div>
                  <div className="text-sm font-medium opacity-90">
                    Claim your <span className="font-black">0.02 ETH</span>{' '}
                    prize now
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Cards */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center"
              >
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {score}
                </div>
                <div className="text-xs font-medium text-green-600/70 dark:text-green-400/70">
                  ✓ Correct
                </div>
              </motion.div>
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center"
              >
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                  {total - score}
                </div>
                <div className="text-xs font-medium text-red-600/70 dark:text-red-400/70">
                  ✗ Incorrect
                </div>
              </motion.div>
            </div>
          </div>

          {/* Action Button */}
          <div className="px-6 pb-6">
            {isPerfect ? (
              <Button
                onClick={onClaim}
                disabled={isClaiming}
                className="w-full h-14 text-lg font-bold bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/25"
              >
                {isClaiming ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🎁</span>
                    Claim Reward
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={onRetry}
                className="w-full h-14 text-lg font-bold bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg shadow-blue-500/25"
              >
                <span className="mr-2">🔄</span>
                Try Again
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
