const colorClasses = {
  amber: 'bg-amber-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
}

export default function ProgressBar({
  percentage = 0,
  label,
  valueText,
  color = 'amber',
  size = 'md',
  className = '',
}) {
  const clamped = Math.min(100, Math.max(0, percentage))
  const barHeight = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-4' : 'h-2.5'

  return (
    <div className={className}>
      {(label || valueText) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-sm text-[var(--text-secondary)]">{label}</span>}
          {valueText && (
            <span className="text-sm font-mono font-medium text-[var(--text-primary)]">
              {valueText}
            </span>
          )}
        </div>
      )}
      <div className={`w-full ${barHeight} bg-[var(--bg-secondary)] rounded-full overflow-hidden`}>
        <div
          className={`${barHeight} ${colorClasses[color] || colorClasses.amber} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
