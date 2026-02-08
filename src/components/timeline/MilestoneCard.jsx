import Badge from '../shared/Badge'
import { formatDate } from '../../utils/format'

const statusOptions = ['not-started', 'in-progress', 'complete', 'blocked']

export default function MilestoneCard({ milestone, onStatusChange, onEdit, onDelete }) {
  const { id, milestone: name, targetDate, status, notes } = milestone

  const now = new Date()
  const target = new Date(targetDate)
  const isOverdue = status !== 'complete' && target < now

  return (
    <div
      className={`relative pl-8 py-3 pr-3 rounded-lg transition-all ${
        isOverdue
          ? 'border border-red-500/40 bg-red-500/5'
          : 'border border-transparent'
      }`}
    >
      {/* Dot on the timeline */}
      <div
        className={`absolute left-1.5 top-4 w-4 h-4 rounded-full border-2 ${
          status === 'complete'
            ? 'bg-green-500 border-green-500'
            : status === 'in-progress'
              ? 'bg-blue-500 border-blue-500'
              : status === 'blocked'
                ? 'bg-red-500 border-red-500'
                : 'bg-[var(--bg-secondary)] border-[var(--border-color-strong)]'
        }`}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-medium ${status === 'complete' ? 'line-through text-[var(--text-muted)]' : ''}`}>
              {name}
            </span>
            <Badge status={status}>{status}</Badge>
            {isOverdue && <Badge color="red">Overdue</Badge>}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-[var(--text-muted)]">
              Target: {formatDate(targetDate)}
            </span>
            {notes && (
              <span className="text-xs text-[var(--text-muted)] truncate">
                — {notes}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <select
            value={status}
            onChange={(e) => onStatusChange(id, e.target.value)}
            className="text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded px-2 py-1 text-[var(--text-primary)] cursor-pointer"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={() => onEdit(milestone)}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-1 text-[var(--text-muted)] hover:text-red-400 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
