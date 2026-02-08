import { useState, useEffect } from 'react'
import Modal from '../shared/Modal'
import Button from '../shared/Button'
import Input from '../shared/Input'
import Select from '../shared/Select'

const emptyForm = {
  name: '',
  region: '',
  estLandCost: 0,
  acreage: 0,
  rating: 3,
  pros: '',
  cons: '',
  notes: '',
  link: '',
  distanceToHouston: '',
  internetAvailability: '',
  utilities: '',
  floodZone: '',
  restrictions: '',
}

export default function LocationModal({ open, onClose, onSave, location }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (open) {
      if (location) {
        setForm({
          name: location.name || '',
          region: location.region || '',
          estLandCost: location.estLandCost || 0,
          acreage: location.acreage || 0,
          rating: location.rating || 3,
          pros: (location.pros || []).join(', '),
          cons: (location.cons || []).join(', '),
          notes: location.notes || '',
          link: location.link || '',
          distanceToHouston: location.distanceToHouston || '',
          internetAvailability: location.internetAvailability || '',
          utilities: location.utilities || '',
          floodZone: location.floodZone || '',
          restrictions: location.restrictions || '',
        })
      } else {
        setForm(emptyForm)
      }
    }
  }, [open, location])

  const handleSubmit = () => {
    if (!form.name.trim()) return
    onSave({
      name: form.name.trim(),
      region: form.region.trim(),
      estLandCost: Number(form.estLandCost) || 0,
      acreage: Number(form.acreage) || 0,
      rating: Number(form.rating) || 3,
      pros: form.pros ? form.pros.split(',').map((s) => s.trim()).filter(Boolean) : [],
      cons: form.cons ? form.cons.split(',').map((s) => s.trim()).filter(Boolean) : [],
      notes: form.notes.trim(),
      link: form.link.trim(),
      distanceToHouston: form.distanceToHouston.trim(),
      internetAvailability: form.internetAvailability.trim(),
      utilities: form.utilities.trim(),
      floodZone: form.floodZone.trim(),
      restrictions: form.restrictions.trim(),
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={location ? 'Edit Location' : 'Add Location'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Basic Info */}
        <div>
          <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3">Basic Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Round Top Acreage"
            />
            <Input
              label="Region"
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              placeholder="e.g., Fayette County, TX"
            />
            <Input
              label="Estimated Land Cost"
              type="number"
              prefix="$"
              value={form.estLandCost}
              onChange={(e) => setForm({ ...form, estLandCost: e.target.value })}
            />
            <Input
              label="Acreage"
              type="number"
              value={form.acreage}
              onChange={(e) => setForm({ ...form, acreage: e.target.value })}
            />
            <Select
              label="Rating (1-5)"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
              options={[
                { value: 1, label: '1 - Poor' },
                { value: 2, label: '2 - Fair' },
                { value: 3, label: '3 - Good' },
                { value: 4, label: '4 - Great' },
                { value: 5, label: '5 - Excellent' },
              ]}
            />
            <Input
              label="Link"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Details */}
        <div>
          <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3">Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Distance to Houston"
              value={form.distanceToHouston}
              onChange={(e) => setForm({ ...form, distanceToHouston: e.target.value })}
              placeholder="e.g., 1.5 hours"
            />
            <Input
              label="Internet Availability"
              value={form.internetAvailability}
              onChange={(e) => setForm({ ...form, internetAvailability: e.target.value })}
              placeholder="e.g., Fiber, Starlink"
            />
            <Input
              label="Utilities"
              value={form.utilities}
              onChange={(e) => setForm({ ...form, utilities: e.target.value })}
              placeholder="e.g., Electric, Well water"
            />
            <Input
              label="Flood Zone"
              value={form.floodZone}
              onChange={(e) => setForm({ ...form, floodZone: e.target.value })}
              placeholder="e.g., X, A, None"
            />
          </div>
        </div>

        {/* Pros/Cons/Notes */}
        <div>
          <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3">Assessment</h4>
          <div className="space-y-4">
            <Input
              label="Pros (comma-separated)"
              value={form.pros}
              onChange={(e) => setForm({ ...form, pros: e.target.value })}
              placeholder="e.g., Beautiful views, Low taxes, Near town"
            />
            <Input
              label="Cons (comma-separated)"
              value={form.cons}
              onChange={(e) => setForm({ ...form, cons: e.target.value })}
              placeholder="e.g., Far from hospital, Gravel roads"
            />
            <Input
              label="Restrictions"
              value={form.restrictions}
              onChange={(e) => setForm({ ...form, restrictions: e.target.value })}
              placeholder="e.g., HOA rules, easements"
            />
            <Input
              label="Notes"
              type="textarea"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any additional notes..."
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}
