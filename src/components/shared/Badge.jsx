const colorMap = {
  red: 'bg-red-500/15 text-red-400 border-red-500/30',
  amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  green: 'bg-green-500/15 text-green-400 border-green-500/30',
  gray: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
}

const priorityColors = {
  'must-have': 'red',
  'nice-to-have': 'amber',
  dream: 'blue',
}

const statusColors = {
  'not-started': 'gray',
  'in-progress': 'blue',
  complete: 'green',
  blocked: 'red',
}

export default function Badge({ children, color, priority, status, className = '' }) {
  const resolvedColor =
    color || priorityColors[priority] || statusColors[status] || 'gray'
  const classes = colorMap[resolvedColor] || colorMap.gray

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border ${classes} ${className}`}
    >
      {children}
    </span>
  )
}
