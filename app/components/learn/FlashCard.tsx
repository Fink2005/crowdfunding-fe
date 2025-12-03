import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useState } from 'react'

type FlashCardProps = {
  wordId: string
  word: string
  choices: string[]
  onAnswer: (wordId: string, selected: string) => void
  showResult?: boolean
  isCorrect?: boolean
}

export default function FlashCard({
  wordId,
  word,
  choices,
  onAnswer,
  showResult = false,
  isCorrect
}: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const handleFlip = () => {
    if (!showResult) {
      setIsFlipped(!isFlipped)
    }
  }

  const handleSelectAnswer = (choice: string) => {
    setSelectedAnswer(choice)
  }

  const handleConfirm = () => {
    if (selectedAnswer) {
      onAnswer(wordId, selectedAnswer)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="perspective-1000 mb-6">
        <motion.div
          className="relative w-full h-80 cursor-pointer"
          onClick={handleFlip}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            className="absolute inset-0 backface-hidden rounded-2xl p-8 flex flex-col items-center justify-center bg-linear-to-br from-blue-500 to-purple-600 text-white shadow-2xl"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-sm uppercase tracking-wide mb-4 opacity-80">
              English
            </div>
            <div className="text-5xl font-bold mb-4">{word}</div>
            <div className="text-sm opacity-60">Click to flip</div>
          </div>

          <div
            className="absolute inset-0 backface-hidden rounded-2xl p-8 flex flex-col items-center justify-center bg-linear-to-br from-green-500 to-teal-600 text-white shadow-2xl"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="text-sm uppercase tracking-wide mb-4 opacity-80">
              Vietnamese
            </div>
            <div className="text-3xl font-bold mb-2">Choose the meaning</div>
            <div className="text-sm opacity-60">Select your answer below</div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-3">
        {choices.map((choice, index) => (
          <Button
            key={index}
            variant="outline"
            className={`w-full h-16 text-lg font-medium transition-all ${
              selectedAnswer === choice
                ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 border-2'
                : ''
            } ${
              showResult && selectedAnswer === choice
                ? isCorrect
                  ? 'bg-green-100 dark:bg-green-900 border-green-500'
                  : 'bg-red-100 dark:bg-red-900 border-red-500'
                : ''
            }`}
            onClick={() => !showResult && handleSelectAnswer(choice)}
            disabled={showResult}
          >
            <span className="mr-3 text-muted-foreground font-bold">
              {String.fromCharCode(65 + index)}.
            </span>
            {choice}
            {showResult && selectedAnswer === choice && (
              <span className="ml-auto text-2xl">{isCorrect ? '✓' : '✗'}</span>
            )}
          </Button>
        ))}
      </div>

      {!showResult && (
        <Button
          className="w-full mt-6 h-14 text-lg font-semibold bg-linear-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
          onClick={handleConfirm}
          disabled={!selectedAnswer}
        >
          Confirm Answer →
        </Button>
      )}
    </div>
  )
}
