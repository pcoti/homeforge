export function formatCurrency(n) {
  if (n == null || isNaN(n)) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatCompactCurrency(n) {
  if (n == null || isNaN(n)) return '$0'
  if (Math.abs(n) >= 1_000_000) {
    return `$${(n / 1_000_000).toFixed(1)}M`
  }
  if (Math.abs(n) >= 1_000) {
    return `$${(n / 1_000).toFixed(0)}K`
  }
  return formatCurrency(n)
}

export function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatPercentage(n) {
  if (n == null || isNaN(n)) return '0%'
  return `${Math.round(n * 100)}%`
}
