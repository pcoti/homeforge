export default function Card({ title, children, className = '', actions }) {
  return (
    <div
      className={`bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5 shadow-sm transition-colors duration-200 ${className}`}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="font-serif text-lg font-semibold">{title}</h3>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
