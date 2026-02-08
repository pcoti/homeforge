import { useState, useMemo } from 'react'
import { useAppContext } from '../../store/AppContext'
import { ActionTypes } from '../../store/reducer'
import { calculateCompositeScore, getActiveWeights } from '../scorecard/criteria'
import Button from '../shared/Button'
import AreaCard from './LocationCard'
import AreaModal from './AreaModal'
import PropertyModal from './PropertyModal'

const TIER_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'contender', label: 'Contenders' },
  { id: 'shortlist', label: 'Shortlist' },
  { id: 'eliminated', label: 'Eliminated' },
]

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
  const [tierFilter, setTierFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [search, setSearch] = useState('')

  const scorecard = state.scorecard || { weights: {}, scores: {} }
  const weights = getActiveWeights(scorecard)

  // Collect all tags for filter
  const allTags = useMemo(() => {
    const tagSet = new Set()
    areas.forEach((a) => (a.tags || []).forEach((t) => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [areas])

  // Tier counts
  const tierCounts = useMemo(() => {
    const counts = { all: areas.length, contender: 0, shortlist: 0, eliminated: 0 }
    areas.forEach((a) => {
      if (a.tier && counts[a.tier] !== undefined) counts[a.tier]++
    })
    return counts
  }, [areas])

  // Filter areas by tag + search + tier
  const filteredAreas = useMemo(() => {
    let result = areas
    if (tierFilter !== 'all') {
      result = result.filter((a) => a.tier === tierFilter)
    }
    if (tagFilter) {
      result = result.filter((a) => (a.tags || []).includes(tagFilter))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((a) =>
        a.name?.toLowerCase().includes(q) ||
        a.state?.toLowerCase().includes(q) ||
        a.county?.toLowerCase().includes(q) ||
        a.region?.toLowerCase().includes(q)
      )
    }
    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'score': {
          const sa = calculateCompositeScore(scorecard.scores[a.id], weights)
          const sb = calculateCompositeScore(scorecard.scores[b.id], weights)
          return sb - sa
        }
        case 'landCost':
          return (a.landInfo?.avgPricePerAcre || Infinity) - (b.landInfo?.avgPricePerAcre || Infinity)
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'state':
          return (a.state || '').localeCompare(b.state || '')
        case 'name':
        default:
          return (a.name || '').localeCompare(b.name || '')
      }
    })
    return result
  }, [areas, tagFilter, tierFilter, search, sortBy, scorecard])

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

  // Tier update
  const handleUpdateTier = (areaId, tier) => {
    dispatch({ type: ActionTypes.UPDATE_AREA, payload: { id: areaId, tier } })
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
      {/* Top bar: search, sort, tag filters, add */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search areas..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          >
            <option value="name">Sort: Name</option>
            <option value="score">Sort: Scorecard Rating</option>
            <option value="landCost">Sort: Land Cost (low→high)</option>
            <option value="rating">Sort: Star Rating</option>
            <option value="state">Sort: State</option>
          </select>

          <Button onClick={handleAddArea}>+ Add Area</Button>
        </div>

        {/* Tier filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {TIER_FILTERS.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTierFilter(tf.id)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-all cursor-pointer ${
                tierFilter === tf.id
                  ? 'bg-[var(--accent)]/15 border-[var(--accent)]/30 text-[var(--accent)]'
                  : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              {tf.label} ({tierCounts[tf.id] || 0})
            </button>
          ))}
          <span className="text-[var(--text-muted)] text-xs mx-1">|</span>
          {/* Tag filter chips */}
          <button
            onClick={() => setTagFilter('')}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-all cursor-pointer ${
              !tagFilter
                ? 'bg-[var(--accent)]/15 border-[var(--accent)]/30 text-[var(--accent)]'
                : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            All Tags
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
            onUpdateTier={handleUpdateTier}
          />
        ))}
      </div>

      <AreaModal open={showAreaModal} onClose={() => setShowAreaModal(false)} onSave={handleSaveArea} area={editingArea} />
      <PropertyModal open={showPropertyModal} onClose={() => setShowPropertyModal(false)} onSave={handleSaveProperty} property={editingProperty} areaId={activeAreaId} />
    </div>
  )
}
