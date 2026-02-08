import { CATEGORIES } from './criteria'
import { useAppContext } from '../../store/AppContext'
import { ActionTypes } from '../../store/reducer'

export default function WeightConfig() {
  const { state, dispatch } = useAppContext()
  const weights = state.scorecard?.weights || {}

  const totalWeight = CATEGORIES.reduce((sum, c) => sum + (weights[c.id] ?? c.defaultWeight), 0)

  const setWeight = (catId, value) => {
    const num = Math.max(0, Math.min(100, parseInt(value) || 0))
    dispatch({ type: ActionTypes.UPDATE_SCORECARD_WEIGHTS, payload: { [catId]: num } })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Category Weights</h3>
        <span className={`text-xs font-mono ${totalWeight === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
          Total: {totalWeight}/100
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {CATEGORIES.map((cat) => {
          const w = weights[cat.id] ?? cat.defaultWeight
          return (
            <div key={cat.id} className="bg-[var(--bg-secondary)] rounded-lg p-2.5">
              <label className="text-xs text-[var(--text-muted)] block mb-1 truncate" title={cat.name}>
                {cat.name}
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={w}
                  onChange={(e) => setWeight(cat.id, e.target.value)}
                  className="flex-1 h-1 accent-[var(--accent)] cursor-pointer"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={w}
                  onChange={(e) => setWeight(cat.id, e.target.value)}
                  className="w-10 text-xs font-mono text-center bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-1 py-0.5"
                />
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-xs text-[var(--text-muted)]">
        Adjust weights to reflect your priorities. Higher weight = more influence on the composite score.
        Weights should sum to 100 for proper scoring.
      </p>
    </div>
  )
}
