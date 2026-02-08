import { useState } from 'react'
import { useAppContext } from '../../store/AppContext'
import { ActionTypes } from '../../store/reducer'
import Button from '../shared/Button'
import LocationCard from './LocationCard'
import LocationModal from './LocationModal'

export default function LocationView() {
  const { state, dispatch } = useAppContext()
  const { locations } = state
  const [showModal, setShowModal] = useState(false)
  const [editingLocation, setEditingLocation] = useState(null)

  const handleAdd = () => {
    setEditingLocation(null)
    setShowModal(true)
  }

  const handleEdit = (loc) => {
    setEditingLocation(loc)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this location?')) {
      dispatch({ type: ActionTypes.DELETE_LOCATION, payload: id })
    }
  }

  const handleSave = (data) => {
    if (editingLocation) {
      dispatch({ type: ActionTypes.UPDATE_LOCATION, payload: { id: editingLocation.id, ...data } })
    } else {
      dispatch({ type: ActionTypes.ADD_LOCATION, payload: data })
    }
    setShowModal(false)
  }

  if (locations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg className="w-16 h-16 text-[var(--text-muted)] mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        <h2 className="font-serif text-xl font-semibold mb-2">No Locations Yet</h2>
        <p className="text-[var(--text-muted)] text-center max-w-md mb-6">
          Start researching potential build locations. Add properties you're considering
          and compare them side by side.
        </p>
        <div className="flex gap-3">
          <Button onClick={handleAdd}>+ Add Location</Button>
          <Button variant="secondary" onClick={() => window.location.href = '/chat'}>
            Ask AI for Suggestions
          </Button>
        </div>

        <LocationModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          location={null}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleAdd}>+ Add Location</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {locations.map((loc) => (
          <LocationCard
            key={loc.id}
            location={loc}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <LocationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        location={editingLocation}
      />
    </div>
  )
}
