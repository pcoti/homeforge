import { useMemo } from 'react'
import { useAppContext } from '../../store/AppContext'
import { CATEGORIES, calculateCompositeScore, calculateCategoryAvg } from './criteria'
import { ScoreBadge } from './ScoreBar'

export default function RankingBoard({ onSelectArea }) {
  const { state } = useAppContext()
  const areas = state.locations || []
  const scorecard = state.scorecard || { weights: {}, scores: {} }

  const ranked = useMemo(() => {
    return areas
      .map((area) => ({
        area,
        composite: calculateCompositeScore(scorecard.scores[area.id], scorecard.weights),
        categoryScores: Object.fromEntries(
          CATEGORIES.map((cat) => [
            cat.id,
            calculateCategoryAvg(scorecard.scores[area.id], cat.id),
          ])
        ),
      }))
      .sort((a, b) => b.composite - a.composite)
  }, [areas, scorecard])

  if (ranked.length === 0) {
    return (
      <div className="text-center py-10 text-[var(--text-muted)]">
        <p>No areas to rank. Add areas in the Locations module first.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {ranked.map((item, idx) => {
        const { area, composite, categoryScores } = item
        const medal = idx === 0 ? '#1' : idx === 1 ? '#2' : idx === 2 ? '#3' : `#${idx + 1}`

        return (
          <button
            key={area.id}
            onClick={() => onSelectArea(area.id)}
            className="w-full text-left bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-4 hover:border-[var(--accent)]/30 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4">
              {/* Rank */}
              <div className={`flex-shrink-0 w-8 text-center font-mono font-bold text-lg ${
                idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-amber-600' : 'text-[var(--text-muted)]'
              }`}>
                {medal}
              </div>

              {/* Score badge */}
              <ScoreBadge score={composite} size="lg" />

              {/* Area info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif font-semibold">{area.name}</h3>
                  <span className="text-xs text-[var(--text-muted)]">
                    {[area.county, area.state].filter(Boolean).join(', ')}
                  </span>
                </div>

                {/* Category score bars */}
                <div className="grid grid-cols-5 gap-1.5 mt-2">
                  {CATEGORIES.map((cat) => {
                    const catScore = categoryScores[cat.id] || 0
                    const w = scorecard.weights[cat.id] ?? cat.defaultWeight
                    return (
                      <div key={cat.id} className="min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] text-[var(--text-muted)] truncate" title={cat.name}>
                            {cat.name.split(' ')[0]}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--text-muted)]">
                            {catScore > 0 ? catScore.toFixed(1) : '--'}
                          </span>
                        </div>
                        <div className="h-1 rounded-full bg-[var(--bg-secondary)]">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              catScore >= 8 ? 'bg-emerald-500' : catScore >= 6 ? 'bg-blue-500' : catScore >= 4 ? 'bg-amber-500' : catScore > 0 ? 'bg-red-500' : 'bg-transparent'
                            }`}
                            style={{ width: `${(catScore / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Tags */}
              <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
                {(area.tags || []).slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] whitespace-nowrap">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
