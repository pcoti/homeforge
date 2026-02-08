import { useState, useMemo } from 'react'
import { useAppContext } from '../../store/AppContext'
import { ActionTypes } from '../../store/reducer'
import Card from '../shared/Card'
import Button from '../shared/Button'
import Badge from '../shared/Badge'
import RequirementCard from './RequirementCard'
import RequirementModal from './RequirementModal'

const priorities = ['all', 'must-have', 'nice-to-have', 'dream']
const categories = ['Land', 'Structure', 'Infrastructure', 'Interior', 'Exterior', 'Lifestyle', 'Other']

export default function RequirementsView() {
  const { state, dispatch } = useAppContext()
  const { requirements } = state
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingReq, setEditingReq] = useState(null)

  const filtered = useMemo(() => {
    return requirements.filter((r) => {
      if (filter !== 'all' && r.priority !== filter) return false
      if (search && !r.item.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [requirements, filter, search])

  const grouped = useMemo(() => {
    const groups = {}
    for (const cat of categories) {
      const items = filtered.filter((r) => r.category === cat)
      if (items.length > 0) groups[cat] = items
    }
    // Include uncategorized
    const other = filtered.filter((r) => !categories.includes(r.category))
    if (other.length > 0) groups['Other'] = [...(groups['Other'] || []), ...other]
    return groups
  }, [filtered])

  const stats = {
    'must-have': { total: requirements.filter((r) => r.priority === 'must-have').length, done: requirements.filter((r) => r.priority === 'must-have' && r.done).length },
    'nice-to-have': { total: requirements.filter((r) => r.priority === 'nice-to-have').length, done: requirements.filter((r) => r.priority === 'nice-to-have' && r.done).length },
    dream: { total: requirements.filter((r) => r.priority === 'dream').length, done: requirements.filter((r) => r.priority === 'dream' && r.done).length },
  }

  const handleToggle = (id) => {
    const req = requirements.find((r) => r.id === id)
    dispatch({ type: ActionTypes.UPDATE_REQUIREMENT, payload: { id, done: !req.done } })
  }

  const handleDelete = (id) => {
    dispatch({ type: ActionTypes.DELETE_REQUIREMENT, payload: id })
  }

  const handleEdit = (req) => {
    setEditingReq(req)
    setShowModal(true)
  }

  const handleAdd = () => {
    setEditingReq(null)
    setShowModal(true)
  }

  const handleSave = (data) => {
    if (editingReq) {
      dispatch({ type: ActionTypes.UPDATE_REQUIREMENT, payload: { id: editingReq.id, ...data } })
    } else {
      dispatch({ type: ActionTypes.ADD_REQUIREMENT, payload: data })
    }
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {priorities.map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-all cursor-pointer ${
                filter === p
                  ? 'bg-[var(--accent)]/15 border-[var(--accent)]/30 text-[var(--accent)]'
                  : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              {p === 'all' ? 'All' : p}
            </button>
          ))}
        </div>
        <div className="flex-1 flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search requirements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-color-strong)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <Button onClick={handleAdd}>+ Add</Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(stats).map(([priority, { total, done }]) => (
          <div key={priority} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 text-center">
            <Badge priority={priority} className="mb-2">{priority}</Badge>
            <p className="text-2xl font-mono font-semibold">{done}/{total}</p>
            <p className="text-xs text-[var(--text-muted)]">completed</p>
          </div>
        ))}
      </div>

      {/* Grouped display */}
      {Object.keys(grouped).length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            <p className="text-[var(--text-muted)]">No requirements match your filters.</p>
            <Button className="mt-4" onClick={handleAdd}>Add Requirement</Button>
          </div>
        </Card>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <Card key={cat} title={`${cat} (${items.length})`}>
            <div className="space-y-2">
              {items.map((req) => (
                <RequirementCard
                  key={req.id}
                  requirement={req}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </Card>
        ))
      )}

      <RequirementModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        requirement={editingReq}
      />
    </div>
  )
}
