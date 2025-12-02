export default function Learn() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Learn English - Earn ETH
          </h1>
          <p className="text-xl text-muted-foreground">
            Answer 10 quiz questions correctly → Get{' '}
            <span className="font-bold text-green-600">0.4 ETH Sepolia</span> 🎉
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-200">
              0 / 10
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-300">
              Questions completed
            </div>
          </div>

          <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-6 rounded-xl border-2 border-green-200 dark:border-green-800">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-200">
              0 ETH
            </div>
            <div className="text-sm text-green-600 dark:text-green-300">
              Total earned
            </div>
          </div>

          <div className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-800">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-200">
              0 days
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-300">
              Current streak
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-2 border-yellow-300 dark:border-yellow-700 rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-3xl font-bold mb-4 text-yellow-900 dark:text-yellow-100">
            Coming Soon!
          </h2>
          <p className="text-lg text-yellow-800 dark:text-yellow-200 mb-6">
            We're building a vocabulary quiz system with smart contracts to
            automatically reward ETH.
          </p>
          <div className="space-y-3 max-w-md mx-auto text-left">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold">10 quiz questions daily</p>
                <p className="text-sm text-muted-foreground">
                  Vocabulary from Basic → Advanced
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold">Automated smart contract</p>
                <p className="text-sm text-muted-foreground">
                  Get 10/10 correct → Claim 0.4 ETH instantly
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold">Streak & Leaderboard</p>
                <p className="text-sm text-muted-foreground">
                  Compete with friends
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-12 bg-muted/50 rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">1️⃣</div>
              <p className="font-semibold mb-2">Connect Wallet</p>
              <p className="text-sm text-muted-foreground">
                Connect your Metamask
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">2️⃣</div>
              <p className="font-semibold mb-2">Take Quiz</p>
              <p className="text-sm text-muted-foreground">
                10 English vocabulary questions
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">3️⃣</div>
              <p className="font-semibold mb-2">Score 10/10</p>
              <p className="text-sm text-muted-foreground">
                All answers correct
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">4️⃣</div>
              <p className="font-semibold mb-2">Get ETH</p>
              <p className="text-sm text-muted-foreground">
                0.4 ETH to your wallet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
