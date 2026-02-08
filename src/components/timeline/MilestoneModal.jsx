import { useState, useEffect } from 'react'
import Modal from '../shared/Modal'
import Button from '../shared/Button'
import Input from '../shared/Input'
import Select from '../shared/Select'

const phases = [
  'Research & Planning',
  'Land Acquisition',
  'Design & Permits',
  'Site Preparation',
  'Construction',
  'Move In',
]

const statuses = ['not-started', 'in-progress', 'complete', 'blocked']

const emptyForm = {
  milestone: '',
  phase: 'Research & Planning',
  targetDate: '',
  status: 'not-started',
  notes: '',
}

export default function MilestoneModal({ open, onClose, onSave, milestone }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (open) {
      setForm(
        milestone
          ? {
              milestone: milestone.milestone,
              phase: milestone.phase,
              targetDate: milestone.targetDate,
              status: milestone.status,
              notes: milestone.notes || '',
            }
          : emptyForm
      )
    }
  }, [open, milestone])

  const handleSubmit = () => {
    if (!form.milestone.trim() || !form.targetDate) return
    onSave({
      ...form,
      milestone: form.milestone.trim(),
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={milestone ? 'Edit Milestone' : 'Add Milestone'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Milestone"
          value={form.milestone}
          onChange={(e) => setForm({ ...form, milestone: e.target.value })}
          placeholder="e.g., Complete foundation"
        />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Phase"
            value={form.phase}
            onChange={(e) => setForm({ ...form, phase: e.target.value })}
            options={phases}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={statuses}
          />
        </div>
        <Input
          label="Target Date"
          type="date"
          value={form.targetDate}
          onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
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
