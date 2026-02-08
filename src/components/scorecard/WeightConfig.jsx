import { useState } from 'react'
import { CATEGORIES, getActiveWeights } from './criteria'
import { useAppContext } from '../../store/AppContext'
import { ActionTypes } from '../../store/reducer'

export default function WeightConfig() {
  const { state, dispatch } = useAppContext()
  const scorecard = state.scorecard || {}
  const profiles = scorecard.weightProfiles || []
  const activeId = scorecard.activeProfileId
  const weights = getActiveWeights(scorecard)

  const [renaming, setRenaming] = useState(null)
  const [renamingValue, setRenamingValue] = useState('')

  const totalWeight = CATEGORIES.reduce((sum, c) => sum + (weights[c.id] ?? c.defaultWeight), 0)

  const setWeight = (catId, value) => {
    const num = Math.max(0, Math.min(100, parseInt(value) || 0))
    dispatch({ type: ActionTypes.UPDATE_SCORECARD_WEIGHTS, payload: { [catId]: num } })
  }

  const addProfile = () => {
    const name = `Profile ${profiles.length + 1}`
    dispatch({ type: ActionTypes.ADD_WEIGHT_PROFILE, payload: { name } })
  }

  const deleteProfile = (id) => {
    if (profiles.length <= 1) return
    dispatch({ type: ActionTypes.DELETE_WEIGHT_PROFILE, payload: id })
  }

  const switchProfile = (id) => {
    dispatch({ type: ActionTypes.SET_ACTIVE_WEIGHT_PROFILE, payload: id })
  }

  const startRename = (profile) => {
    setRenaming(profile.id)
    setRenamingValue(profile.name)
  }

  const finishRename = () => {
    if (renaming && renamingValue.trim()) {
      dispatch({
        type: ActionTypes.RENAME_WEIGHT_PROFILE,
        payload: { id: renaming, name: renamingValue.trim() },
      })
    }
    setRenaming(null)
  }

  return (
    <div className="space-y-3">
      {/* Profile selector */}
      {profiles.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[var(--text-muted)]">Profile:</span>
          {profiles.map((p) => (
            <div key={p.id} className="flex items-center gap-0.5">
              {renaming === p.id ? (
                <input
                  type="text"
                  value={renamingValue}
                  onChange={(e) => setRenamingValue(e.target.value)}
                  onBlur={finishRename}
                  onKeyDown={(e) => e.key === 'Enter' && finishRename()}
                  autoFocus
                  className="px-2 py-1 text-xs bg-[var(--bg-primary)] border border-[var(--accent)] rounded w-24 focus:outline-none"
                />
              ) : (
                <button
                  onClick={() => switchProfile(p.id)}
                  onDoubleClick={() => startRename(p)}
                  title="Click to select, double-click to rename"
                  className={`px-3 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                    activeId === p.id
                      ? 'bg-[var(--accent)]/15 border-[var(--accent)]/30 text-[var(--accent)] font-medium'
                      : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  {p.name}
                </button>
              )}
              {profiles.length > 1 && activeId === p.id && (
                <button
                  onClick={() => deleteProfile(p.id)}
                  title="Delete this profile"
                  className="text-[var(--text-muted)] hover:text-red-400 transition-colors cursor-pointer ml-0.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addProfile}
            className="px-2 py-1 text-xs rounded-lg border border-dashed border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all cursor-pointer"
          >
            + Add
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Category Weights</h3>
        <span className={`text-xs font-mono ${totalWeight === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
          Total: {totalWeight}/100
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
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
        {profiles.length > 0 && ' Double-click a profile name to rename it.'}
      </p>
    </div>
  )
}
