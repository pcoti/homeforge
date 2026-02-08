import { useState, useEffect } from 'react'
import Modal from '../shared/Modal'
import Button from '../shared/Button'
import Input from '../shared/Input'
import Select from '../shared/Select'

const emptyForm = {
  name: '',
  address: '',
  estLandCost: 0,
  estSiteWorkCost: 0,
  estInfrastructureCost: 0,
  acreage: 0,
  listingUrl: '',
  floodZone: '',
  utilities: '',
  restrictions: '',
  pros: '',
  cons: '',
  notes: '',
  rating: 3,
  status: 'researching',
}

const statusOptions = [
  { value: 'researching', label: 'Researching' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'visited', label: 'Visited' },
  { value: 'offer', label: 'Offer Made' },
  { value: 'passed', label: 'Passed' },
]

export default function PropertyModal({ open, onClose, onSave, property, areaId }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (open) {
      if (property) {
        setForm({
          name: property.name || '',
          address: property.address || '',
          estLandCost: property.estLandCost || 0,
          estSiteWorkCost: property.estSiteWorkCost || 0,
          estInfrastructureCost: property.estInfrastructureCost || 0,
          acreage: property.acreage || 0,
          listingUrl: property.listingUrl || '',
          floodZone: property.floodZone || '',
          utilities: property.utilities || '',
          restrictions: property.restrictions || '',
          pros: (property.pros || []).join(', '),
          cons: (property.cons || []).join(', '),
          notes: property.notes || '',
          rating: property.rating || 3,
          status: property.status || 'researching',
        })
      } else {
        setForm(emptyForm)
      }
    }
  }, [open, property])

  const handleSubmit = () => {
    if (!form.name.trim()) return
    onSave({
      areaId,
      name: form.name.trim(),
      address: form.address.trim(),
      estLandCost: Number(form.estLandCost) || 0,
      estSiteWorkCost: Number(form.estSiteWorkCost) || 0,
      estInfrastructureCost: Number(form.estInfrastructureCost) || 0,
      acreage: Number(form.acreage) || 0,
      listingUrl: form.listingUrl.trim(),
      floodZone: form.floodZone.trim(),
      utilities: form.utilities.trim(),
      restrictions: form.restrictions.trim(),
      pros: form.pros ? form.pros.split(',').map((s) => s.trim()).filter(Boolean) : [],
      cons: form.cons ? form.cons.split(',').map((s) => s.trim()).filter(Boolean) : [],
      notes: form.notes.trim(),
      rating: Number(form.rating) || 3,
      status: form.status,
    })
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={property ? 'Edit Property' : 'Add Property'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Property Name" value={form.name} onChange={set('name')} placeholder="e.g., 15-acre tract on FM 1457" />
          <Select label="Status" value={form.status} onChange={set('status')} options={statusOptions} />
          <Input label="Address / Location" value={form.address} onChange={set('address')} placeholder="e.g., FM 1457 near Carmine" />
          <Input label="Listing URL" value={form.listingUrl} onChange={set('listingUrl')} placeholder="https://..." />
          <Input label="Est. Land Cost" type="number" prefix="$" value={form.estLandCost} onChange={set('estLandCost')} />
          <Input label="Acreage" type="number" value={form.acreage} onChange={set('acreage')} />
          <Input label="Est. Site Work" type="number" prefix="$" value={form.estSiteWorkCost} onChange={set('estSiteWorkCost')} />
          <Input label="Est. Infrastructure" type="number" prefix="$" value={form.estInfrastructureCost} onChange={set('estInfrastructureCost')} />
          <Input label="Flood Zone" value={form.floodZone} onChange={set('floodZone')} placeholder="e.g., X, A, None" />
          <Input label="Utilities On-site" value={form.utilities} onChange={set('utilities')} placeholder="e.g., Electric, Well, Septic" />
          <Input label="Restrictions" value={form.restrictions} onChange={set('restrictions')} placeholder="e.g., Ag exempt, no HOA" />
          <Select label="Rating" value={form.rating} onChange={set('rating')} options={[
            { value: 1, label: '1 - Poor' }, { value: 2, label: '2 - Fair' },
            { value: 3, label: '3 - Good' }, { value: 4, label: '4 - Great' },
            { value: 5, label: '5 - Excellent' },
          ]} />
        </div>
        <Input label="Pros (comma-separated)" value={form.pros} onChange={set('pros')} placeholder="e.g., Cleared, Road frontage, Creek" />
        <Input label="Cons (comma-separated)" value={form.cons} onChange={set('cons')} placeholder="e.g., No trees, Power line easement" />
        <Input label="Notes" type="textarea" value={form.notes} onChange={set('notes')} placeholder="Details about this specific property..." />
      </div>
    </Modal>
  )
}
