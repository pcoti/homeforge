import { useState, useMemo } from 'react'
import { useAppContext } from '../../store/AppContext'
import { ActionTypes } from '../../store/reducer'
import Card from '../shared/Card'
import Button from '../shared/Button'
import MilestoneCard from './MilestoneCard'
import MilestoneModal from './MilestoneModal'

const phaseOrder = [
  'Research & Planning',
  'Land Acquisition',
  'Design & Permits',
  'Site Preparation',
  'Construction',
  'Move In',
]

export default function TimelineView() {
  const { state, dispatch } = useAppContext()
  const { timeline } = state
  const [showModal, setShowModal] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState(null)

  const phases = useMemo(() => {
    return phaseOrder.map((phase) => {
      const milestones = timeline.filter((m) => m.phase === phase)
      const done = milestones.filter((m) => m.status === 'complete').length
      return { name: phase, milestones, done, total: milestones.length }
    })
  }, [timeline])

  const handleStatusChange = (id, status) => {
    const updates = { id, status }
    if (status === 'complete') {
      updates.completedDate = new Date().toISOString()
    } else {
      updates.completedDate = null
    }
    dispatch({ type: ActionTypes.UPDATE_MILESTONE, payload: updates })
  }

  const handleEdit = (milestone) => {
    setEditingMilestone(milestone)
    setShowModal(true)
  }

  const handleAdd = () => {
    setEditingMilestone(null)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    dispatch({ type: ActionTypes.DELETE_MILESTONE, payload: id })
  }

  const handleSave = (data) => {
    if (editingMilestone) {
      dispatch({ type: ActionTypes.UPDATE_MILESTONE, payload: { id: editingMilestone.id, ...data } })
    } else {
      dispatch({ type: ActionTypes.ADD_MILESTONE, payload: data })
    }
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Phase progress bar row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {phases.map((phase, idx) => {
          const isComplete = phase.total > 0 && phase.done === phase.total
          const pct = phase.total > 0 ? (phase.done / phase.total) * 100 : 0
          return (
            <div
              key={phase.name}
              className={`rounded-xl p-3 border text-center transition-colors ${
                isComplete
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-[var(--bg-card)] border-[var(--border-color)]'
              }`}
            >
              <p className="text-xs text-[var(--text-muted)]">Phase {idx + 1}</p>
              <p className="text-sm font-medium mt-1 truncate">{phase.name}</p>
              <p className={`text-xs mt-1 ${isComplete ? 'text-green-400' : 'text-[var(--text-muted)]'}`}>
                {phase.done}/{phase.total}
              </p>
              <div className="w-full h-1 mt-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                <div
                  className={`h-1 rounded-full transition-all duration-500 ${
                    isComplete ? 'bg-green-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Add button */}
      <div className="flex justify-end">
        <Button onClick={handleAdd}>+ Add Milestone</Button>
      </div>

      {/* Timeline list grouped by phase */}
      <div className="space-y-2">
        {phases.map((phase) => {
          const isComplete = phase.total > 0 && phase.done === phase.total
          return (
            <Card
              key={phase.name}
              title={
                <span className={isComplete ? 'text-green-400' : ''}>
                  {phase.name}
                  {isComplete && (
                    <svg className="w-4 h-4 inline ml-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </span>
              }
            >
              {phase.milestones.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] py-2">
                  No milestones in this phase.
                </p>
              ) : (
                <div className="relative">
                  {/* Connecting line */}
                  <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-[var(--border-color)]" />
                  <div className="space-y-3">
                    {phase.milestones.map((m) => (
                      <MilestoneCard
                        key={m.id}
                        milestone={m}
                        onStatusChange={handleStatusChange}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      <MilestoneModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        milestone={editingMilestone}
      />
    </div>
  )
}
