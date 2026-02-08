import { useState, useMemo } from 'react'
import { useAppContext } from '../../store/AppContext'
import { ActionTypes } from '../../store/reducer'
import Button from '../shared/Button'
import AreaCard from './LocationCard'
import AreaModal from './AreaModal'
import PropertyModal from './PropertyModal'

export default function LocationView() {
  const { state, dispatch } = useAppContext()
  const areas = state.locations || []
  const properties = state.properties || []

  const [showAreaModal, setShowAreaModal] = useState(false)
  const [editingArea, setEditingArea] = useState(null)
  const [showPropertyModal, setShowPropertyModal] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)
  const [activeAreaId, setActiveAreaId] = useState(null)
  const [expandedAreas, setExpandedAreas] = useState({})
  const [tagFilter, setTagFilter] = useState('')

  // Collect all tags for filter
  const allTags = useMemo(() => {
    const tagSet = new Set()
    areas.forEach((a) => (a.tags || []).forEach((t) => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [areas])

  // Filter areas by tag
  const filteredAreas = useMemo(() => {
    if (!tagFilter) return areas
    return areas.filter((a) => (a.tags || []).includes(tagFilter))
  }, [areas, tagFilter])

  const toggleExpand = (id) => {
    setExpandedAreas((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Area CRUD
  const handleAddArea = () => { setEditingArea(null); setShowAreaModal(true) }
  const handleEditArea = (area) => { setEditingArea(area); setShowAreaModal(true) }
  const handleDeleteArea = (id) => {
    const propCount = properties.filter((p) => p.areaId === id).length
    const msg = propCount > 0
      ? `Delete this area and its ${propCount} properties?`
      : 'Delete this area?'
    if (window.confirm(msg)) {
      dispatch({ type: ActionTypes.DELETE_AREA, payload: id })
    }
  }
  const handleSaveArea = (data) => {
    if (editingArea) {
      dispatch({ type: ActionTypes.UPDATE_AREA, payload: { id: editingArea.id, ...data } })
    } else {
      dispatch({ type: ActionTypes.ADD_AREA, payload: data })
    }
    setShowAreaModal(false)
  }

  // Property CRUD
  const handleAddProperty = (areaId) => {
    setActiveAreaId(areaId)
    setEditingProperty(null)
    setShowPropertyModal(true)
  }
  const handleEditProperty = (prop) => {
    setActiveAreaId(prop.areaId)
    setEditingProperty(prop)
    setShowPropertyModal(true)
  }
  const handleDeleteProperty = (id) => {
    dispatch({ type: ActionTypes.DELETE_PROPERTY, payload: id })
  }
  const handleSaveProperty = (data) => {
    if (editingProperty) {
      dispatch({ type: ActionTypes.UPDATE_PROPERTY, payload: { id: editingProperty.id, ...data } })
    } else {
      dispatch({ type: ActionTypes.ADD_PROPERTY, payload: data })
    }
    setShowPropertyModal(false)
  }

  // Empty state
  if (areas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg className="w-16 h-16 text-[var(--text-muted)] mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        <h2 className="font-serif text-xl font-semibold mb-2">No Areas Yet</h2>
        <p className="text-[var(--text-muted)] text-center max-w-md mb-2">
          Start by adding a region or county you're researching.
          Each area holds context like climate, taxes, and infrastructure,
          with specific properties nested underneath.
        </p>
        <p className="text-[var(--text-muted)] text-center max-w-md mb-6 text-sm">
          Example: "Round Top Area" → Fayette County, TX → then add specific land parcels inside it.
        </p>
        <div className="flex gap-3">
          <Button onClick={handleAddArea}>+ Add Area</Button>
          <Button variant="secondary" onClick={() => window.location.href = '/chat'}>
            Ask AI for Suggestions
          </Button>
        </div>

        <AreaModal open={showAreaModal} onClose={() => setShowAreaModal(false)} onSave={handleSaveArea} area={null} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top bar: tag filters + add */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <button
            onClick={() => setTagFilter('')}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-all cursor-pointer ${
              !tagFilter
                ? 'bg-[var(--accent)]/15 border-[var(--accent)]/30 text-[var(--accent)]'
                : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            All ({areas.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tag === tagFilter ? '' : tag)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-all cursor-pointer ${
                tagFilter === tag
                  ? 'bg-[var(--accent)]/15 border-[var(--accent)]/30 text-[var(--accent)]'
                  : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <Button onClick={handleAddArea}>+ Add Area</Button>
      </div>

      {/* Area cards */}
      <div className="space-y-4">
        {filteredAreas.map((area) => (
          <AreaCard
            key={area.id}
            area={area}
            properties={properties.filter((p) => p.areaId === area.id)}
            expanded={!!expandedAreas[area.id]}
            onToggle={() => toggleExpand(area.id)}
            onEdit={handleEditArea}
            onDelete={handleDeleteArea}
            onAddProperty={() => handleAddProperty(area.id)}
            onEditProperty={handleEditProperty}
            onDeleteProperty={handleDeleteProperty}
          />
        ))}
      </div>

      <AreaModal open={showAreaModal} onClose={() => setShowAreaModal(false)} onSave={handleSaveArea} area={editingArea} />
      <PropertyModal open={showPropertyModal} onClose={() => setShowPropertyModal(false)} onSave={handleSaveProperty} property={editingProperty} areaId={activeAreaId} />
    </div>
  )
}
