import { useState, useEffect } from 'react'
import Modal from '../shared/Modal'
import Button from '../shared/Button'
import Input from '../shared/Input'
import Select from '../shared/Select'

const categories = ['Land', 'Structure', 'Infrastructure', 'Interior', 'Exterior', 'Lifestyle', 'Other']
const priorities = ['must-have', 'nice-to-have', 'dream']

const emptyForm = {
  item: '',
  category: 'Other',
  priority: 'nice-to-have',
  notes: '',
  estimatedCost: 0,
}

export default function RequirementModal({ open, onClose, onSave, requirement }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (open) {
      setForm(
        requirement
          ? {
              item: requirement.item,
              category: requirement.category,
              priority: requirement.priority,
              notes: requirement.notes || '',
              estimatedCost: requirement.estimatedCost || 0,
            }
          : emptyForm
      )
    }
  }, [open, requirement])

  const handleSubmit = () => {
    if (!form.item.trim()) return
    onSave({
      ...form,
      item: form.item.trim(),
      estimatedCost: Number(form.estimatedCost) || 0,
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={requirement ? 'Edit Requirement' : 'Add Requirement'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Requirement"
          value={form.item}
          onChange={(e) => setForm({ ...form, item: e.target.value })}
          placeholder="e.g., Solar panels on garage"
        />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={categories}
          />
          <Select
            label="Priority"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            options={priorities}
          />
        </div>
        <Input
          label="Estimated Cost"
          type="number"
          prefix="$"
          value={form.estimatedCost}
          onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })}
        />
        <Input
          label="Notes"
          type="textarea"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Any additional details..."
        />
      </div>
    </Modal>
  )
}
