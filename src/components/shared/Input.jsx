export default function Input({
  label,
  error,
  prefix,
  suffix,
  type = 'text',
  className = '',
  ...props
}) {
  const isTextarea = type === 'textarea'
  const Tag = isTextarea ? 'textarea' : 'input'

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-[var(--text-muted)] text-sm pointer-events-none">
            {prefix}
          </span>
        )}
        <Tag
          type={isTextarea ? undefined : type}
          className={`w-full bg-[var(--bg-secondary)] border border-[var(--border-color-strong)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-200 ${
            prefix ? 'pl-8' : ''
          } ${suffix ? 'pr-8' : ''} ${isTextarea ? 'min-h-[80px] resize-y' : ''} ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 text-[var(--text-muted)] text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
