export default function StatCard({
  icon,
  label,
  value,
  subtitle,
  trend,
  className = '',
}) {
  return (
    <div
      className={`bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 shadow-sm transition-colors duration-200 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[var(--text-muted)] mb-1">{label}</p>
          <p className="text-2xl font-mono font-semibold truncate">{value}</p>
          {subtitle && (
            <p className="text-sm text-[var(--text-secondary)] mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-[var(--accent)] ml-3 flex-shrink-0">{icon}</div>
        )}
      </div>
      {trend && (
        <p
          className={`text-xs mt-2 ${
            trend.startsWith('+') || trend.startsWith('↑')
              ? 'text-green-400'
              : trend.startsWith('-') || trend.startsWith('↓')
                ? 'text-red-400'
                : 'text-[var(--text-muted)]'
          }`}
        >
          {trend}
        </p>
      )}
    </div>
  )
}
