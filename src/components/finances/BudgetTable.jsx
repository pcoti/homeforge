import { useState } from 'react'
import { useAppContext } from '../../store/AppContext'
import { ActionTypes } from '../../store/reducer'
import { formatCurrency } from '../../utils/format'
import Card from '../shared/Card'
import Button from '../shared/Button'
import Modal from '../shared/Modal'
import Input from '../shared/Input'

export default function BudgetTable() {
  const { state, dispatch } = useAppContext()
  const { categories } = state.finances
  const [editingId, setEditingId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', estimate: 0, allocated: 0, spent: 0 })

  const totals = categories.reduce(
    (acc, c) => ({
      estimate: acc.estimate + c.estimate,
      allocated: acc.allocated + c.allocated,
      spent: acc.spent + c.spent,
    }),
    { estimate: 0, allocated: 0, spent: 0 }
  )

  const openAdd = () => {
    setEditingId(null)
    setForm({ name: '', estimate: 0, allocated: 0, spent: 0 })
    setShowModal(true)
  }

  const openEdit = (cat) => {
    setEditingId(cat.id)
    setForm({ name: cat.name, estimate: cat.estimate, allocated: cat.allocated, spent: cat.spent })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    const payload = {
      name: form.name.trim(),
      estimate: Number(form.estimate) || 0,
      allocated: Number(form.allocated) || 0,
      spent: Number(form.spent) || 0,
    }
    if (editingId) {
      dispatch({ type: ActionTypes.UPDATE_BUDGET_CATEGORY, payload: { id: editingId, ...payload } })
    } else {
      dispatch({ type: ActionTypes.ADD_BUDGET_CATEGORY, payload })
    }
    setShowModal(false)
  }

  const handleDelete = (id) => {
    dispatch({ type: ActionTypes.DELETE_BUDGET_CATEGORY, payload: id })
  }

  return (
    <>
      <Card
        title="Budget Categories"
        actions={
          <Button size="sm" onClick={openAdd}>
            + Add Category
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="text-left py-2 pr-4 text-[var(--text-muted)] font-medium">Category</th>
                <th className="text-right py-2 px-4 text-[var(--text-muted)] font-medium">Estimate</th>
                <th className="text-right py-2 px-4 text-[var(--text-muted)] font-medium">Allocated</th>
                <th className="text-right py-2 px-4 text-[var(--text-muted)] font-medium">Spent</th>
                <th className="text-right py-2 px-4 text-[var(--text-muted)] font-medium">Remaining</th>
                <th className="text-right py-2 pl-4 text-[var(--text-muted)] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-card-hover)] transition-colors"
                >
                  <td className="py-3 pr-4 font-medium">{cat.name}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatCurrency(cat.estimate)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatCurrency(cat.allocated)}</td>
                  <td className="py-3 px-4 text-right font-mono">{formatCurrency(cat.spent)}</td>
                  <td className="py-3 px-4 text-right font-mono">
                    {formatCurrency(cat.estimate - cat.spent)}
                  </td>
                  <td className="py-3 pl-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-1 text-[var(--text-muted)] hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[var(--border-color-strong)] font-semibold">
                <td className="py-3 pr-4">Totals</td>
                <td className="py-3 px-4 text-right font-mono">{formatCurrency(totals.estimate)}</td>
                <td className="py-3 px-4 text-right font-mono">{formatCurrency(totals.allocated)}</td>
                <td className="py-3 px-4 text-right font-mono">{formatCurrency(totals.spent)}</td>
                <td className="py-3 px-4 text-right font-mono">
                  {formatCurrency(totals.estimate - totals.spent)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit Category' : 'Add Category'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Category Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g., Roofing"
          />
          <Input
            label="Estimate"
            type="number"
            prefix="$"
            value={form.estimate}
            onChange={(e) => setForm({ ...form, estimate: e.target.value })}
          />
          <Input
            label="Allocated"
            type="number"
            prefix="$"
            value={form.allocated}
            onChange={(e) => setForm({ ...form, allocated: e.target.value })}
          />
          <Input
            label="Spent"
            type="number"
            prefix="$"
            value={form.spent}
            onChange={(e) => setForm({ ...form, spent: e.target.value })}
          />
        </div>
      </Modal>
    </>
  )
}
