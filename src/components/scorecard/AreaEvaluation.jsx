import { useMemo } from 'react'
import { useAppContext } from '../../store/AppContext'
import { ActionTypes } from '../../store/reducer'
import { CATEGORIES, calculateCompositeScore, calculateCategoryAvg, getActiveWeights } from './criteria'
import ScoreBar, { ScoreBadge } from './ScoreBar'
import Card from '../shared/Card'

export default function AreaEvaluation({ areaId, onBack }) {
  const { state, dispatch } = useAppContext()
  const areas = state.locations || []
  const area = areas.find((a) => a.id === areaId)
  const scorecard = state.scorecard || { weights: {}, scores: {} }
  const weights = getActiveWeights(scorecard)
  const areaScores = scorecard.scores[areaId] || {}

  const composite = useMemo(
    () => calculateCompositeScore(areaScores, weights),
    [areaScores, weights]
  )

  if (!area) {
    return (
      <div className="text-center py-10 text-[var(--text-muted)]">
        <p>Area not found.</p>
        <button onClick={onBack} className="text-[var(--accent)] hover:underline mt-2 cursor-pointer">Back to rankings</button>
      </div>
    )
  }

  const setScore = (categoryId, criterionId, value) => {
    const num = Math.max(0, Math.min(10, parseInt(value) || 0))
    dispatch({
      type: ActionTypes.UPDATE_SCORECARD_SCORE,
      payload: { areaId, categoryId, criterionId, score: num },
    })
  }

  const setNotes = (categoryId, criterionId, notes) => {
    dispatch({
      type: ActionTypes.UPDATE_SCORECARD_NOTES,
      payload: { areaId, categoryId, criterionId, notes },
    })
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={onBack}
            className="text-sm text-[var(--accent)] hover:underline mb-2 cursor-pointer flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Rankings
          </button>
          <h2 className="font-serif text-xl font-semibold">{area.name}</h2>
          <p className="text-sm text-[var(--text-muted)]">
            {[area.county, area.state].filter(Boolean).join(', ')}
            {area.metroArea && ` — ${area.distanceToMetro || '?'} from ${area.metroArea}`}
          </p>
        </div>
        <ScoreBadge score={composite} size="lg" />
      </div>

      {/* Category sections */}
      {CATEGORIES.map((cat) => {
        const catAvg = calculateCategoryAvg(areaScores, cat.id)
        const catWeight = weights[cat.id] ?? cat.defaultWeight

        return (
          <Card key={cat.id}>
            <div className="space-y-3">
              {/* Category header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm">{cat.name}</h3>
                    <span className="text-xs text-[var(--text-muted)] font-mono">
                      weight: {catWeight}%
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">{cat.description}</p>
                </div>
                <ScoreBadge score={catAvg} />
              </div>

              {/* Criteria grid */}
              <div className="space-y-2">
                {cat.criteria.map((criterion) => {
                  const entry = areaScores[cat.id]?.[criterion.id] || { score: 0, notes: '' }

                  return (
                    <div
                      key={criterion.id}
                      className="bg-[var(--bg-secondary)] rounded-lg p-3"
                    >
                      <div className="flex items-start gap-3">
                        {/* Score input */}
                        <div className="flex-shrink-0 w-16">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={entry.score || ''}
                            onChange={(e) => setScore(cat.id, criterion.id, e.target.value)}
                            placeholder="--"
                            className="w-full text-center font-mono font-semibold text-sm bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-2 py-1.5 focus:border-[var(--accent)] focus:outline-none transition-colors"
                          />
                        </div>

                        {/* Criterion info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{criterion.name}</span>
                          </div>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">{criterion.description}</p>
                          <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono opacity-75">{criterion.guide}</p>

                          {/* Score bar */}
                          <div className="mt-1.5">
                            <ScoreBar score={entry.score} compact />
                          </div>
                        </div>

                        {/* Notes */}
                        <div className="flex-shrink-0 w-48 hidden lg:block">
                          <input
                            type="text"
                            value={entry.notes || ''}
                            onChange={(e) => setNotes(cat.id, criterion.id, e.target.value)}
                            placeholder="Notes..."
                            className="w-full text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-2 py-1.5 focus:border-[var(--accent)] focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
