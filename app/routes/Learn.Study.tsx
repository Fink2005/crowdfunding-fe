import { useVocabularyWords } from '@/apis/queries/vocabulary'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router'

export default function LearnStudy() {
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('vi')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const { data: vocabularyData, isLoading } = useVocabularyWords(
    sourceLang,
    targetLang,
    sourceLang !== targetLang
  )

  const words = vocabularyData?.data || []
  const currentWord = words[currentIndex]

  const handleNext = () => {
    setIsFlipped(false)
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    setIsFlipped(false)
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

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

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Learn Vocabulary
          </h1>
          <p className="text-muted-foreground">
            Study flashcards before taking the quiz
          </p>
        </div>

        <div className="mb-8 flex justify-center items-center gap-4">
          <select
            value={sourceLang}
            onChange={(e) => {
              setSourceLang(e.target.value)
              setCurrentIndex(0)
              setIsFlipped(false)
            }}
            className="px-4 py-2 rounded-lg border-2 border-muted bg-background text-lg"
          >
            <option value="en">🇬🇧 English</option>
            <option value="vi">🇻🇳 Vietnamese</option>
            <option value="ja">🇯🇵 Japanese</option>
          </select>
          <span className="flex items-center text-2xl">→</span>
          <select
            value={targetLang}
            onChange={(e) => {
              setTargetLang(e.target.value)
              setCurrentIndex(0)
              setIsFlipped(false)
            }}
            className="px-4 py-2 rounded-lg border-2 border-muted bg-background text-lg"
          >
            <option value="en">🇬🇧 English</option>
            <option value="vi">🇻🇳 Vietnamese</option>
            <option value="ja">🇯🇵 Japanese</option>
          </select>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-bounce">📚</div>
            <p className="text-xl">Loading vocabulary...</p>
          </div>
        ) : words.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl mb-2">No vocabulary found</p>
            <p className="text-muted-foreground">
              {sourceLang === targetLang
                ? 'Please select different languages'
                : 'No words available for this language pair'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Card {currentIndex + 1} / {words.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(((currentIndex + 1) / words.length) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / words.length) * 100}%`
                  }}
                />
              </div>
            </div>

            <div className="perspective-1000 mb-8">
              <motion.div
                className="relative w-full h-96 cursor-pointer"
                onClick={handleFlip}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring' }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div
                  className="absolute inset-0 backface-hidden rounded-2xl p-12 flex flex-col items-center justify-center bg-linear-to-br from-blue-500 to-purple-600 text-white shadow-2xl"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="text-sm uppercase tracking-wide mb-6 opacity-80">
                    {sourceLang === 'en'
                      ? 'English'
                      : sourceLang === 'vi'
                        ? 'Vietnamese'
                        : 'Japanese'}
                  </div>
                  <div className="text-6xl font-bold mb-8 text-center">
                    {currentWord?.word}
                  </div>
                  <div className="text-sm opacity-60">
                    👆 Click to see meaning
                  </div>
                </div>

                <div
                  className="absolute inset-0 backface-hidden rounded-2xl p-12 flex flex-col items-center justify-center bg-linear-to-br from-green-500 to-teal-600 text-white shadow-2xl"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="text-sm uppercase tracking-wide mb-6 opacity-80">
                    {targetLang === 'en'
                      ? 'English'
                      : targetLang === 'vi'
                        ? 'Vietnamese'
                        : 'Japanese'}
                  </div>
                  <div className="text-5xl font-bold mb-8 text-center">
                    {currentWord?.meaning}
                  </div>
                  {currentWord?.example && (
                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wide mb-2 opacity-70">
                        Example
                      </div>
                      <div className="text-lg italic opacity-90">
                        "{currentWord.example}"
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="flex items-center justify-between gap-4 mb-8">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex-1 h-14"
              >
                ← Previous
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleFlip}
                className="flex-1 h-14 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950"
              >
                🔄 Flip Card
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleNext}
                disabled={currentIndex === words.length - 1}
                className="flex-1 h-14"
              >
                Next →
              </Button>
            </div>

            {currentIndex === words.length - 1 && (
              <div className="bg-linear-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 border-2 border-green-300 dark:border-green-700 rounded-xl p-8 text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-2">
                  Ready to test your knowledge?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Take the quiz and earn 0.02 ETH for getting 10/10 correct!
                </p>
                <Link to="/learn/quiz">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-lg bg-linear-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                  >
                    🚀 Take Quiz Now
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
