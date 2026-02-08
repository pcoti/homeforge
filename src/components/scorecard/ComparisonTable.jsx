import { useState, useMemo } from 'react'
import { useAppContext } from '../../store/AppContext'
import { CATEGORIES, calculateCompositeScore, calculateCategoryAvg, getScoreColor } from './criteria'
import { ScoreBadge } from './ScoreBar'

const cellColorMap = {
  green: 'bg-emerald-500/15 text-emerald-400',
  blue: 'bg-blue-500/15 text-blue-400',
  amber: 'bg-amber-500/15 text-amber-400',
  red: 'bg-red-500/15 text-red-400',
}

function ScoreCell({ score }) {
  if (!score || score === 0) {
    return <td className="text-center text-xs text-[var(--text-muted)] px-2 py-1.5">--</td>
  }
  const color = getScoreColor(Math.round(score))
  const display = score % 1 === 0 ? score : score.toFixed(1)
  return (
    <td className="text-center px-2 py-1.5">
      <span className={`inline-block font-mono text-xs font-semibold rounded px-1.5 py-0.5 ${cellColorMap[color]}`}>
        {display}
      </span>
    </td>
  )
}

export default function ComparisonTable() {
  const { state } = useAppContext()
  const areas = state.locations || []
  const scorecard = state.scorecard || { weights: {}, scores: {} }

  // Allow selecting up to 5 areas for comparison
  const [selectedIds, setSelectedIds] = useState(() => {
    // Default: top 5 by composite score
    const sorted = [...areas]
      .map((a) => ({
        id: a.id,
        score: calculateCompositeScore(scorecard.scores[a.id], scorecard.weights),
      }))
      .sort((a, b) => b.score - a.score)
    return sorted.slice(0, 5).map((a) => a.id)
  })

  const [expandedCats, setExpandedCats] = useState({})

  const toggleArea = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 5 ? [...prev, id] : prev
    )
  }

  const toggleCat = (catId) => {
    setExpandedCats((prev) => ({ ...prev, [catId]: !prev[catId] }))
  }

  const selectedAreas = useMemo(
    () => selectedIds.map((id) => areas.find((a) => a.id === id)).filter(Boolean),
    [selectedIds, areas]
  )

  if (areas.length === 0) {
    return (
      <div className="text-center py-10 text-[var(--text-muted)]">
        <p>No areas to compare. Add areas in the Locations module first.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Area selector */}
      <div>
        <h3 className="text-sm font-medium mb-2">Select Areas to Compare (max 5)</h3>
        <div className="flex flex-wrap gap-2">
          {areas.map((area) => {
            const isSelected = selectedIds.includes(area.id)
            return (
              <button
                key={area.id}
                onClick={() => toggleArea(area.id)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--accent)]/15 border-[var(--accent)]/30 text-[var(--accent)]'
                    : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                {area.name.split(' / ')[0]}
                {isSelected && (
                  <span className="ml-1 font-mono">
                    ({calculateCompositeScore(scorecard.scores[area.id], scorecard.weights).toFixed(1)})
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {selectedAreas.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] text-center py-6">Select at least one area to compare.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="text-left py-2 px-2 text-xs text-[var(--text-muted)] font-medium min-w-[180px]">Criterion</th>
                {selectedAreas.map((area) => (
                  <th key={area.id} className="text-center py-2 px-2 min-w-[80px]">
                    <div className="text-xs font-medium truncate max-w-[100px]" title={area.name}>
                      {area.name.split(' / ')[0]}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">{area.state}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Overall composite */}
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
                <td className="py-2 px-2 font-semibold text-sm">Overall Score</td>
                {selectedAreas.map((area) => (
                  <td key={area.id} className="text-center py-2 px-2">
                    <ScoreBadge score={calculateCompositeScore(scorecard.scores[area.id], scorecard.weights)} />
                  </td>
                ))}
              </tr>

              {/* Categories */}
              {CATEGORIES.map((cat) => {
                const isExpanded = expandedCats[cat.id]
                return (
                  <tbody key={cat.id}>
                    {/* Category header row */}
                    <tr
                      className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)]/30 cursor-pointer"
                      onClick={() => toggleCat(cat.id)}
                    >
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-1.5">
                          <svg
                            className={`w-3 h-3 text-[var(--text-muted)] transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                          <span className="font-medium text-xs text-[var(--accent)]">{cat.name}</span>
                          <span className="text-[10px] text-[var(--text-muted)] font-mono">
                            ({scorecard.weights[cat.id] ?? cat.defaultWeight}%)
                          </span>
                        </div>
                      </td>
                      {selectedAreas.map((area) => (
                        <ScoreCell
                          key={area.id}
                          score={calculateCategoryAvg(scorecard.scores[area.id], cat.id)}
                        />
                      ))}
                    </tr>

                    {/* Criteria rows (expanded) */}
                    {isExpanded && cat.criteria.map((criterion) => (
                      <tr
                        key={criterion.id}
                        className="border-b border-[var(--border-color)]/50"
                      >
                        <td className="py-1.5 px-2 pl-8">
                          <span className="text-xs text-[var(--text-secondary)]">{criterion.name}</span>
                        </td>
                        {selectedAreas.map((area) => {
                          const s = scorecard.scores[area.id]?.[cat.id]?.[criterion.id]?.score || 0
                          return <ScoreCell key={area.id} score={s} />
                        })}
                      </tr>
                    ))}
                  </tbody>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
