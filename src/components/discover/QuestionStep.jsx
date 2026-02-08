export default function QuestionStep({ question, answer, onAnswer }) {
  const isMulti = question.type === 'multi'
  const currentMulti = isMulti ? (answer || []) : null
  const currentSingle = !isMulti ? answer : null

  const toggleMulti = (optId) => {
    const prev = currentMulti || []
    onAnswer(
      prev.includes(optId) ? prev.filter((x) => x !== optId) : [...prev, optId]
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-serif text-2xl font-semibold mb-2">{question.title}</h2>
        <p className="text-[var(--text-muted)]">{question.subtitle}</p>
        {isMulti && (
          <p className="text-xs text-[var(--text-muted)] mt-1">Select all that apply, or skip to continue</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 max-w-xl mx-auto">
        {question.options.map((opt) => {
          const isSelected = isMulti
            ? (currentMulti || []).includes(opt.id)
            : currentSingle === opt.id

          return (
            <button
              key={opt.id}
              onClick={() => isMulti ? toggleMulti(opt.id) : onAnswer(opt.id)}
              className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                  : 'border-[var(--border-color)] hover:border-[var(--accent)]/40 hover:bg-[var(--bg-secondary)]'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox / radio indicator */}
                <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-${isMulti ? 'md' : 'full'} border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'border-[var(--accent)] bg-[var(--accent)]'
                    : 'border-[var(--text-muted)]'
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-medium text-sm">{opt.label}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{opt.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
