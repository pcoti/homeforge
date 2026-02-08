import Badge from '../shared/Badge'

export default function RequirementCard({ requirement, onToggle, onEdit, onDelete }) {
  const { id, item, priority, notes, done } = requirement

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
        done
          ? 'bg-green-500/5 border-green-500/20'
          : 'bg-[var(--bg-secondary)] border-[var(--border-color)]'
      }`}
    >
      <button
        onClick={() => onToggle(id)}
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 transition-all cursor-pointer flex items-center justify-center ${
          done
            ? 'bg-green-500 border-green-500'
            : 'border-[var(--border-color-strong)] hover:border-[var(--accent)]'
        }`}
      >
        {done && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-medium ${done ? 'line-through text-[var(--text-muted)]' : ''}`}>
            {item}
          </span>
          <Badge priority={priority}>{priority}</Badge>
        </div>
        {notes && (
          <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{notes}</p>
        )}
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onEdit(requirement)}
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
  )
}
