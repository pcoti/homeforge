import { useState } from 'react'
import WeightConfig from './WeightConfig'
import RankingBoard from './RankingBoard'
import AreaEvaluation from './AreaEvaluation'
import ComparisonTable from './ComparisonTable'

const TABS = [
  { id: 'rankings', label: 'Rankings' },
  { id: 'compare', label: 'Compare' },
]

export default function ScorecardView() {
  const [activeTab, setActiveTab] = useState('rankings')
  const [selectedAreaId, setSelectedAreaId] = useState(null)
  const [showWeights, setShowWeights] = useState(false)

  // If an area is selected for evaluation, show that view
  if (selectedAreaId) {
    return (
      <div className="space-y-6">
        <AreaEvaluation areaId={selectedAreaId} onBack={() => setSelectedAreaId(null)} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-semibold mb-1">Location Scorecard</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Evaluate and compare areas across 11 categories with 61 weighted criteria.
          Click any area to score it in detail.
        </p>
      </div>

      {/* Weight config toggle */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden">
        <button
          onClick={() => setShowWeights(!showWeights)}
          className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--bg-secondary)]/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            <span className="text-sm font-medium">Scoring Weights</span>
          </div>
          <svg
            className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${showWeights ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        {showWeights && (
          <div className="px-4 pb-4 border-t border-[var(--border-color)]">
            <div className="pt-4">
              <WeightConfig />
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[var(--border-color)]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'rankings' && (
        <RankingBoard onSelectArea={setSelectedAreaId} />
      )}
      {activeTab === 'compare' && (
        <ComparisonTable />
      )}

      {/* Scoring methodology */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-4">
        <h3 className="text-sm font-medium mb-3">Scoring Methodology</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[var(--text-muted)]">
          <div>
            <p className="font-medium text-[var(--text-secondary)] mb-1">How Scores Work</p>
            <ul className="space-y-1">
              <li>Each criterion is scored <span className="font-mono">1-10</span></li>
              <li>Category average = mean of its criteria scores</li>
              <li>Composite = weighted average of all category averages</li>
              <li>Weights must sum to <span className="font-mono">100</span> for accurate results</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-[var(--text-secondary)] mb-1">Score Scale</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                <span><span className="font-mono">8-10</span> — Excellent / Strong advantage</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                <span><span className="font-mono">6-7</span> — Good / Above average</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
                <span><span className="font-mono">4-5</span> — Average / Acceptable</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                <span><span className="font-mono">1-3</span> — Poor / Concern</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
