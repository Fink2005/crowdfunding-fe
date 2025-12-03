import { useSubmitQuiz, useVocabularyQuiz } from '@/apis/queries/vocabulary'
import FlashCard from '@/components/learn/FlashCard'
import QuizResultDialog from '@/components/learn/QuizResultDialog'
import { Button } from '@/components/ui/button'
import { contractAbi, contractAddress } from '@/contract/ContractClient'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { parseEther } from 'viem'
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'

type Answer = {
  wordId: string
  selected: string
}

export default function Learn() {
  const { address, isConnected } = useAccount()
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('vi')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [showResult, setShowResult] = useState(false)
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  const [quizResult, setQuizResult] = useState<{
    score: number
    total: number
  } | null>(null)

  const { data: quizData, isLoading } = useVocabularyQuiz(
    sourceLang,
    targetLang,
    isQuizStarted
  )

  const { mutate: submitQuiz, isPending: isSubmitting } = useSubmitQuiz()

  // Contract interaction
  const { data: txHash, writeContract } = useWriteContract()
  const { isSuccess: txSuccess } = useWaitForTransactionReceipt({
    hash: txHash
  })

  const questions = quizData?.data || []
  const currentQ = questions[currentQuestion]

  // Handle successful transaction
  useEffect(() => {
    if (txSuccess) {
      toast.success('🎉 Congratulations! You earned 0.02 ETH!')
      // Reset quiz after short delay
      setTimeout(() => {
        setIsQuizStarted(false)
        setCurrentQuestion(0)
        setAnswers([])
        setShowResult(false)
        setQuizResult(null)
      }, 2000)
    }
  }, [txSuccess])

  const handleStartQuiz = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }
    setIsQuizStarted(true)
  }

  const handleAnswer = (wordId: string, selected: string) => {
    const newAnswer: Answer = {
      wordId,
      selected
    }

    const updatedAnswers = [...answers, newAnswer]
    setAnswers(updatedAnswers)
    setShowResult(true)

    // Move to next question after 1.5 seconds
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setShowResult(false)
      } else {
        // Submit quiz
        handleSubmitQuiz(updatedAnswers)
      }
    }, 1500)
  }

  const handleSubmitQuiz = (finalAnswers: Answer[]) => {
    if (!address) return

    submitQuiz(
      { address, answers: finalAnswers },
      {
        onSuccess: (response) => {
          // Show result dialog
          setQuizResult({
            score: response.data.score,
            total: response.data.total
          })
        },
        onError: () => {
          toast.error('Failed to submit quiz')
          // Reset quiz
          setIsQuizStarted(false)
          setCurrentQuestion(0)
          setAnswers([])
          setShowResult(false)
        }
      }
    )
  }

  const handleClaimReward = () => {
    if (!address) return

    toast.info('Processing your reward...')

    const rewardAmount = parseEther('0.02') // 0.02 ETH reward

    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'giftFromContract',
      args: [address, rewardAmount]
    })
  }

  const handleRetry = () => {
    setIsQuizStarted(false)
    setCurrentQuestion(0)
    setAnswers([])
    setShowResult(false)
    setQuizResult(null)
  }

  if (!isQuizStarted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <span className="text-xl">←</span>
            <span className="font-medium">Back to Learn</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Learn English - Earn ETH
            </h1>
            <p className="text-xl text-muted-foreground">
              Answer 10 quiz questions correctly → Get{' '}
              <span className="font-bold text-green-600">0.02 ETH Sepolia</span>{' '}
              🎉
            </p>
          </div>

          {/* Language Selection */}
          <div className="mb-8 flex justify-center gap-4">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-muted bg-background"
            >
              <option value="en">English</option>
              <option value="vi">Vietnamese</option>
              <option value="ja">Japanese</option>
            </select>
            <span className="flex items-center text-2xl">→</span>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-muted bg-background"
            >
              <option value="en">English</option>
              <option value="vi">Vietnamese</option>
              <option value="ja">Japanese</option>
            </select>
          </div>

          {/* Start Quiz Button */}
          <div className="text-center">
            <Button
              size="lg"
              className="h-16 px-12 text-xl font-bold bg-linear-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
              onClick={handleStartQuiz}
              disabled={!isConnected || sourceLang === targetLang}
            >
              {!isConnected
                ? '🔒 Connect Wallet to Start'
                : sourceLang === targetLang
                  ? '⚠️ Select Different Languages'
                  : '🚀 Start Quiz Now'}
            </Button>
          </div>

          {/* How it works */}
          <div className="mt-12 bg-muted/50 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">
              How It Works
            </h3>
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
                  10 vocabulary questions
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
                  0.02 ETH to your wallet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Quiz Started - Show Flash Cards
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold">Loading quiz...</h2>
        </div>
      </div>
    )
  }

  if (!currentQ) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold">No questions available</h2>
          <Button className="mt-4" onClick={() => setIsQuizStarted(false)}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} / {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-green-500 to-teal-500 transition-all duration-500"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Flash Card */}
        <FlashCard
          word={currentQ.word}
          wordId={currentQ.id}
          choices={currentQ.choices}
          onAnswer={handleAnswer}
          showResult={showResult}
          isCorrect={
            showResult
              ? currentQ.answer === answers[answers.length - 1]?.selected
              : undefined
          }
        />

        {/* Submitting State */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-8 rounded-xl text-center">
              <div className="text-6xl mb-4 animate-bounce">📝</div>
              <h3 className="text-2xl font-bold">Submitting your answers...</h3>
            </div>
          </div>
        )}

        {/* Result Dialog */}
        {quizResult && (
          <QuizResultDialog
            isOpen={!!quizResult}
            score={quizResult.score}
            total={quizResult.total}
            onClaim={handleClaimReward}
            onRetry={handleRetry}
            isClaiming={!!txHash && !txSuccess}
          />
        )}
      </div>
    </div>
  )
}
