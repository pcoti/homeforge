import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../store/AppContext'
import { QUESTIONS, calculateWizardResults } from './questions'
import QuestionStep from './QuestionStep'
import ResultsView from './ResultsView'
import Button from '../shared/Button'

export default function DiscoverView() {
  const { state } = useAppContext()
  const navigate = useNavigate()
  const areas = state.locations || []
  const scorecard = state.scorecard || { weights: {}, scores: {} }

  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const question = QUESTIONS[currentStep]
  const totalSteps = QUESTIONS.length
  const progress = showResults ? 100 : ((currentStep / totalSteps) * 100)

  const setAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }))
  }

  const goNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowResults(true)
    }
  }

  const goBack = () => {
    if (showResults) {
      setShowResults(false)
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const restart = () => {
    setCurrentStep(0)
    setAnswers({})
    setShowResults(false)
  }

  const results = useMemo(() => {
    if (!showResults) return []
    return calculateWizardResults(areas, scorecard, answers)
  }, [showResults, areas, scorecard, answers])

  // Can advance: single-select requires an answer, multi-select can skip
  const canAdvance = question?.type === 'multi' || !!answers[question?.id]

  if (showResults) {
    return (
      <div className="space-y-6">
        {/* Progress bar */}
        <div className="h-1 rounded-full bg-[var(--bg-secondary)]">
          <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-500" style={{ width: '100%' }} />
        </div>

        <ResultsView
          results={results}
          onRestart={restart}
          onViewScorecard={() => navigate('/scorecard')}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[var(--text-muted)]">
            Question {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-xs text-[var(--text-muted)]">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--bg-secondary)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <QuestionStep
        question={question}
        answer={answers[question.id]}
        onAnswer={setAnswer}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
        <button
          onClick={goBack}
          disabled={currentStep === 0}
          className={`flex items-center gap-1.5 text-sm transition-colors cursor-pointer ${
            currentStep === 0
              ? 'text-[var(--text-muted)] cursor-not-allowed'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>

        <div className="flex items-center gap-2">
          {/* Step dots */}
          {QUESTIONS.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentStep
                  ? 'bg-[var(--accent)] w-6'
                  : idx < currentStep || answers[QUESTIONS[idx].id]
                    ? 'bg-[var(--accent)]/40'
                    : 'bg-[var(--bg-secondary)]'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={goNext}
          disabled={question.type === 'single' && !canAdvance}
          size="sm"
        >
          {currentStep === totalSteps - 1 ? 'See Results' : 'Next'}
          <svg className="w-4 h-4 ml-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Button>
      </div>

      {/* Summary of answers so far */}
      {currentStep > 0 && (
        <div className="pt-4 border-t border-[var(--border-color)]">
          <p className="text-xs text-[var(--text-muted)] mb-2">Your selections so far:</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(answers).map(([qId, ans]) => {
              const q = QUESTIONS.find((x) => x.id === qId)
              if (!q) return null
              if (q.type === 'multi') {
                return (ans || []).map((optId) => {
                  const opt = q.options.find((o) => o.id === optId)
                  return opt ? (
                    <span key={`${qId}-${optId}`} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                      {opt.label}
                    </span>
                  ) : null
                })
              } else {
                const opt = q.options.find((o) => o.id === ans)
                return opt ? (
                  <span key={qId} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                    {q.title}: {opt.label}
                  </span>
                ) : null
              }
            })}
          </div>
        </div>
      )}
    </div>
  )
}
