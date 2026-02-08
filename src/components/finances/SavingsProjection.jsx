import { useAppContext } from '../../store/AppContext'
import { formatCurrency, formatCompactCurrency } from '../../utils/format'
import Card from '../shared/Card'
import ProgressBar from '../shared/ProgressBar'

export default function SavingsProjection() {
  const { state } = useAppContext()
  const { settings, finances } = state

  const homeEquity = settings.homeValue - settings.mortgageBalance
  const totalAvailable = homeEquity + finances.savings
  const estimatedTotalCost = finances.categories.reduce((sum, c) => sum + c.estimate, 0)

  const now = new Date()
  const targetDate = new Date(settings.targetYear, 11, 31)
  const totalMonths = Math.max(
    0,
    (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth())
  )
  const projectedTotal = totalAvailable + finances.monthlyContribution * totalMonths
  const monthsToGoal =
    finances.monthlyContribution > 0 && estimatedTotalCost > totalAvailable
      ? Math.ceil((estimatedTotalCost - totalAvailable) / finances.monthlyContribution)
      : 0

  // Generate yearly milestones
  const yearPoints = []
  for (let y = now.getFullYear(); y <= settings.targetYear; y++) {
    const monthsFromNow =
      (y - now.getFullYear()) * 12 + (y === now.getFullYear() ? 0 : -now.getMonth())
    const projectedAtYear = totalAvailable + finances.monthlyContribution * Math.max(0, monthsFromNow)
    yearPoints.push({ year: y, projected: projectedAtYear })
  }

  return (
    <Card title="Savings Projection">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-3">
            <p className="text-xs text-[var(--text-muted)] mb-1">Projected at {settings.targetYear}</p>
            <p className="font-mono font-semibold text-lg">{formatCurrency(projectedTotal)}</p>
          </div>
          <div className="bg-[var(--bg-secondary)] rounded-lg p-3">
            <p className="text-xs text-[var(--text-muted)] mb-1">Months to Goal</p>
            <p className="font-mono font-semibold text-lg">
              {monthsToGoal > 0 ? `${monthsToGoal} months` : estimatedTotalCost <= totalAvailable ? 'Funded!' : 'Set contribution'}
            </p>
          </div>
          <div className="bg-[var(--bg-secondary)] rounded-lg p-3">
            <p className="text-xs text-[var(--text-muted)] mb-1">Months Remaining</p>
            <p className="font-mono font-semibold text-lg">{totalMonths} months</p>
          </div>
        </div>

        {/* Visual timeline */}
        <div className="space-y-3">
          {yearPoints.map((point) => {
            const pct = estimatedTotalCost > 0 ? (point.projected / estimatedTotalCost) * 100 : 0
            return (
              <ProgressBar
                key={point.year}
                percentage={Math.min(100, pct)}
                label={String(point.year)}
                valueText={formatCompactCurrency(point.projected)}
                color={pct >= 100 ? 'green' : pct >= 75 ? 'amber' : 'blue'}
                size="sm"
              />
            )
          })}
        </div>
      </div>
    </Card>
  )
}
