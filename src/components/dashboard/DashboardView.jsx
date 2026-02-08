import { useAppContext } from '../../store/AppContext'
import { formatCurrency, formatCompactCurrency, formatPercentage } from '../../utils/format'
import StatCard from '../shared/StatCard'
import Card from '../shared/Card'
import ProgressBar from '../shared/ProgressBar'

const phaseOrder = [
  'Research & Planning',
  'Land Acquisition',
  'Design & Permits',
  'Site Preparation',
  'Construction',
  'Move In',
]

export default function DashboardView() {
  const { state } = useAppContext()
  const { settings, finances, requirements, timeline } = state

  // Computed values
  const homeEquity = settings.homeValue - settings.mortgageBalance
  const totalAvailable = homeEquity + finances.savings
  const estimatedTotalCost = finances.categories.reduce((sum, c) => sum + c.estimate, 0)
  const gapToFill = Math.max(0, estimatedTotalCost - totalAvailable)

  const now = new Date()
  const targetDate = new Date(settings.targetYear, 11, 31)
  const monthsRemaining = Math.max(
    0,
    (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth())
  )
  const projectedAtTarget =
    totalAvailable + finances.monthlyContribution * monthsRemaining
  const progressPercent = settings.budgetMin > 0 ? (totalAvailable / settings.budgetMin) * 100 : 0

  const completedMilestones = timeline.filter((m) => m.status === 'complete').length
  const nextMilestone = timeline.find((m) => m.status !== 'complete')

  const mustHaves = requirements.filter((r) => r.priority === 'must-have')
  const mustHavesDone = mustHaves.filter((r) => r.done).length

  // Phase data
  const phases = phaseOrder.map((phase) => {
    const milestones = timeline.filter((m) => m.phase === phase)
    const done = milestones.filter((m) => m.status === 'complete').length
    return { name: phase, total: milestones.length, done }
  })

  const currentPhaseIdx = phases.findIndex((p) => p.done < p.total)

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Available"
          value={formatCompactCurrency(totalAvailable)}
          subtitle={`${Math.round(progressPercent)}% of ${formatCompactCurrency(settings.budgetMin)} goal`}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
          }
        />
        <StatCard
          label="Budget Range"
          value={`${formatCompactCurrency(settings.budgetMin)}-${formatCompactCurrency(settings.budgetMax)}`}
          subtitle={`Est. cost: ${formatCompactCurrency(estimatedTotalCost)}`}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Milestone Progress"
          value={`${completedMilestones}/${timeline.length}`}
          subtitle={nextMilestone ? `Next: ${nextMilestone.milestone}` : 'All complete!'}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          }
        />
        <StatCard
          label="Must-Have Requirements"
          value={`${mustHavesDone}/${mustHaves.length}`}
          subtitle={`${mustHaves.length - mustHavesDone} remaining`}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Financial Progress */}
      <Card title="Financial Progress">
        <ProgressBar
          percentage={progressPercent}
          label="Progress toward minimum budget"
          valueText={`${formatCurrency(totalAvailable)} / ${formatCurrency(settings.budgetMin)}`}
          color={progressPercent >= 100 ? 'green' : progressPercent >= 50 ? 'amber' : 'red'}
          size="lg"
          className="mb-6"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-3">
            <p className="text-xs text-[var(--text-muted)] mb-1">Home Equity</p>
            <p className="font-mono font-semibold">{formatCurrency(homeEquity)}</p>
          </div>
          <div className="bg-[var(--bg-secondary)] rounded-lg p-3">
            <p className="text-xs text-[var(--text-muted)] mb-1">Cash Savings</p>
            <p className="font-mono font-semibold">{formatCurrency(finances.savings)}</p>
          </div>
          <div className="bg-[var(--bg-secondary)] rounded-lg p-3">
            <p className="text-xs text-[var(--text-muted)] mb-1">Monthly Contribution</p>
            <p className="font-mono font-semibold">{formatCurrency(finances.monthlyContribution)}/mo</p>
          </div>
          <div className="bg-[var(--bg-secondary)] rounded-lg p-3">
            <p className="text-xs text-[var(--text-muted)] mb-1">Projected at {settings.targetYear}</p>
            <p className="font-mono font-semibold">{formatCurrency(projectedAtTarget)}</p>
          </div>
        </div>
        {gapToFill > 0 && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">
              Gap to fill: <span className="font-mono font-semibold">{formatCurrency(gapToFill)}</span>
              {finances.monthlyContribution > 0 && (
                <span>
                  {' '}
                  — at current rate, {Math.ceil(gapToFill / finances.monthlyContribution)} months to close
                </span>
              )}
            </p>
          </div>
        )}
      </Card>

      {/* Timeline Overview */}
      <Card title="Timeline Overview">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {phases.map((phase, idx) => {
            const isComplete = phase.total > 0 && phase.done === phase.total
            const isCurrent = idx === currentPhaseIdx
            return (
              <div
                key={phase.name}
                className={`rounded-lg p-3 border transition-colors ${
                  isComplete
                    ? 'bg-green-500/10 border-green-500/30'
                    : isCurrent
                      ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30'
                      : 'bg-[var(--bg-secondary)] border-[var(--border-color)]'
                }`}
              >
                <p className="text-xs text-[var(--text-muted)] mb-1">Phase {idx + 1}</p>
                <p className="text-sm font-medium truncate">{phase.name}</p>
                <p className="text-xs mt-1">
                  <span className={isComplete ? 'text-green-400' : 'text-[var(--text-muted)]'}>
                    {phase.done}/{phase.total} done
                  </span>
                </p>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Budget Breakdown */}
      <Card title="Budget Breakdown">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {finances.categories.map((cat) => {
            const pct = estimatedTotalCost > 0 ? (cat.estimate / estimatedTotalCost) * 100 : 0
            return (
              <div key={cat.id} className="bg-[var(--bg-secondary)] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium truncate">{cat.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{Math.round(pct)}%</p>
                </div>
                <p className="font-mono text-sm font-semibold mb-2">{formatCurrency(cat.estimate)}</p>
                <ProgressBar percentage={pct} color="amber" size="sm" />
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
