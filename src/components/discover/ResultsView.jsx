import { ScoreBadge } from '../scorecard/ScoreBar'
import Badge from '../shared/Badge'

export default function ResultsView({ results, onRestart, onViewScorecard }) {
  const matches = results.filter((r) => !r.eliminated)
  const eliminated = results.filter((r) => r.eliminated)

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-serif text-2xl font-semibold mb-2">Your Recommendations</h2>
        <p className="text-[var(--text-muted)]">
          {matches.length} {matches.length === 1 ? 'area matches' : 'areas match'} your criteria
          {eliminated.length > 0 && ` (${eliminated.length} eliminated)`}
        </p>
      </div>

      {/* Top matches */}
      {matches.length === 0 ? (
        <div className="text-center py-10 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6">
          <svg className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-[var(--text-secondary)] mb-2">No areas match all your criteria.</p>
          <p className="text-sm text-[var(--text-muted)] mb-4">Try relaxing some deal-breakers or expanding your region preferences.</p>
          <button onClick={onRestart} className="text-[var(--accent)] hover:underline cursor-pointer text-sm">
            Start Over
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((result, idx) => {
            const { area, compositeScore, insights } = result
            const matchPct = Math.round((compositeScore / 10) * 100)
            const isTop3 = idx < 3

            return (
              <div
                key={area.id}
                className={`bg-[var(--card-bg)] border rounded-xl p-5 transition-all ${
                  isTop3
                    ? 'border-[var(--accent)]/30 shadow-lg shadow-[var(--accent)]/5'
                    : 'border-[var(--border-color)]'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Rank */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <span className={`font-mono font-bold text-lg ${
                      idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-amber-600' : 'text-[var(--text-muted)]'
                    }`}>
                      #{idx + 1}
                    </span>
                    <ScoreBadge score={compositeScore} size="lg" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-serif text-lg font-semibold">{area.name}</h3>
                      <span className="text-xs font-mono text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-full">
                        {matchPct}% match
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mb-3">
                      {[area.county, area.state].filter(Boolean).join(', ')}
                      {area.metroArea && ` — ${area.distanceToMetro || '?'} from ${area.metroArea}`}
                    </p>

                    {/* Strengths */}
                    {insights.strengths.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {insights.strengths.map((s, i) => (
                          <Badge key={i} color="green">{s}</Badge>
                        ))}
                      </div>
                    )}

                    {/* Concerns */}
                    {insights.concerns.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {insights.concerns.map((c, i) => (
                          <Badge key={i} color="red">{c}</Badge>
                        ))}
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(area.tags || []).map((tag, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-[var(--border-color)]">
                  {area.landInfo?.avgPricePerAcre > 0 && (
                    <div>
                      <p className="text-[10px] text-[var(--text-muted)]">Land $/Acre</p>
                      <p className="text-sm font-mono font-medium">${area.landInfo.avgPricePerAcre.toLocaleString()}</p>
                    </div>
                  )}
                  {area.taxInfo?.propertyTaxRate && (
                    <div>
                      <p className="text-[10px] text-[var(--text-muted)]">Property Tax</p>
                      <p className="text-sm font-medium">{area.taxInfo.propertyTaxRate}</p>
                    </div>
                  )}
                  {area.climate?.avgHighSummer && (
                    <div>
                      <p className="text-[10px] text-[var(--text-muted)]">Summer High</p>
                      <p className="text-sm font-medium">{area.climate.avgHighSummer}</p>
                    </div>
                  )}
                  {area.nearestHospital && (
                    <div>
                      <p className="text-[10px] text-[var(--text-muted)]">Hospital / MG</p>
                      <p className="text-sm font-medium truncate" title={area.nearestHospital}>
                        {area.nearestHospital.split(';')[0]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Eliminated areas */}
      {eliminated.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-[var(--text-muted)] mb-3">
            Eliminated ({eliminated.length})
          </h3>
          <div className="space-y-2">
            {eliminated.map((result) => (
              <div
                key={result.area.id}
                className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-3 opacity-60"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium line-through">{result.area.name}</span>
                    <span className="text-xs text-[var(--text-muted)] ml-2">
                      {result.area.state}
                    </span>
                  </div>
                  <div className="text-xs text-red-400">
                    {result.eliminationReasons.slice(0, 2).join(' / ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-center gap-4 pt-4">
        <button
          onClick={onRestart}
          className="px-4 py-2 text-sm border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
        >
          Start Over
        </button>
        <button
          onClick={onViewScorecard}
          className="px-4 py-2 text-sm bg-[var(--accent)] text-white rounded-lg hover:brightness-110 transition-all cursor-pointer"
        >
          View Full Scorecard
        </button>
      </div>
    </div>
  )
}
