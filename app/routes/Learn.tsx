import { Button } from '@/components/ui/button'
import { Link } from 'react-router'

export default function Learn() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Learn & Earn ETH
          </h1>
          <p className="text-xl text-muted-foreground">
            Study vocabulary, take quizzes, and earn{' '}
            <span className="font-bold text-green-600">0.02 ETH</span> for
            perfect scores! 🎉
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Study Card */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-8 hover:shadow-xl transition-shadow">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-3xl font-bold mb-3">Study Vocabulary</h2>
            <p className="text-muted-foreground mb-6">
              Learn new words with interactive flashcards. Flip cards to see
              meanings and examples.
            </p>
            <Link to="/learn/study">
              <Button
                size="lg"
                className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Start Learning →
              </Button>
            </Link>
          </div>

          {/* Quiz Card */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 border-2 border-green-200 dark:border-green-800 rounded-2xl p-8 hover:shadow-xl transition-shadow">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold mb-3">Take Quiz</h2>
            <p className="text-muted-foreground mb-6">
              Test your knowledge with 10 questions. Get 10/10 correct and earn
              0.02 ETH instantly!
            </p>
            <Link to="/learn/quiz">
              <Button
                size="lg"
                className="w-full h-14 text-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
              >
                Take Quiz Now →
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="bg-muted/50 rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center">Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🌍</div>
              <p className="font-semibold mb-2">Multi-Language</p>
              <p className="text-sm text-muted-foreground">
                English, Vietnamese, Japanese
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎴</div>
              <p className="font-semibold mb-2">Flip Cards</p>
              <p className="text-sm text-muted-foreground">
                Interactive 3D flashcards
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💰</div>
              <p className="font-semibold mb-2">Earn Crypto</p>
              <p className="text-sm text-muted-foreground">
                Get rewards for learning
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-muted/50 rounded-xl p-8">
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
              <p className="font-semibold mb-2">Study Words</p>
              <p className="text-sm text-muted-foreground">
                Learn with flashcards
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">3️⃣</div>
              <p className="font-semibold mb-2">Take Quiz</p>
              <p className="text-sm text-muted-foreground">
                Answer 10 questions
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">4️⃣</div>
              <p className="font-semibold mb-2">Get ETH</p>
              <p className="text-sm text-muted-foreground">
                0.02 ETH for 10/10
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
