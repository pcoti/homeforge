import { useAppContext } from '../../store/AppContext'
import { ActionTypes } from '../../store/reducer'
import { formatCurrency } from '../../utils/format'
import Card from '../shared/Card'
import Input from '../shared/Input'
import ProgressBar from '../shared/ProgressBar'
import BudgetTable from './BudgetTable'
import SavingsProjection from './SavingsProjection'

export default function FinanceView() {
  const { state, dispatch } = useAppContext()
  const { settings, finances } = state

  const homeEquity = settings.homeValue - settings.mortgageBalance
  const totalAvailable = homeEquity + finances.savings
  const estimatedTotalCost = finances.categories.reduce((sum, c) => sum + c.estimate, 0)
  const gapToFill = Math.max(0, estimatedTotalCost - totalAvailable)

  const updateSetting = (field, value) => {
    dispatch({ type: ActionTypes.UPDATE_SETTINGS, payload: { [field]: Number(value) || 0 } })
  }

  const updateFinance = (field, value) => {
    dispatch({ type: ActionTypes.UPDATE_FINANCES, payload: { [field]: Number(value) || 0 } })
  }

  // AI suggestion cards
  const suggestions = []
  const contingencyPct =
    finances.categories.find((c) => c.name === 'Contingency')?.estimate / estimatedTotalCost
  if (contingencyPct && contingencyPct < 0.1) {
    suggestions.push({
      id: 'contingency-low',
      text: `Your contingency is ${Math.round(contingencyPct * 100)}% of total budget. Most experts recommend 10-15% for custom home builds.`,
      type: 'warning',
    })
  }
  if (gapToFill > 0 && finances.monthlyContribution === 0) {
    suggestions.push({
      id: 'no-contribution',
      text: `You have a ${formatCurrency(gapToFill)} gap to fill. Setting a monthly contribution could help you reach your goal.`,
      type: 'info',
    })
  }
  if (totalAvailable >= estimatedTotalCost) {
    suggestions.push({
      id: 'fully-funded',
      text: `Great news! Your available funds cover the estimated total cost. Consider if your budget categories accurately reflect current market rates.`,
      type: 'success',
    })
  }

  return (
    <div className="space-y-6">
      {/* Key Financial Inputs */}
      <Card title="Financial Overview">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Current Home Value"
            type="number"
            prefix="$"
            value={settings.homeValue}
            onChange={(e) => updateSetting('homeValue', e.target.value)}
          />
          <Input
            label="Home Purchase Price"
            type="number"
            prefix="$"
            value={settings.homePurchasePrice}
            disabled
          />
          <Input
            label="Mortgage Balance"
            type="number"
            prefix="$"
            value={settings.mortgageBalance}
            onChange={(e) => updateSetting('mortgageBalance', e.target.value)}
          />
          <Input
            label="Cash Savings"
            type="number"
            prefix="$"
            value={finances.savings}
            onChange={(e) => updateFinance('savings', e.target.value)}
          />
          <Input
            label="Monthly Contribution"
            type="number"
            prefix="$"
            value={finances.monthlyContribution}
            onChange={(e) => updateFinance('monthlyContribution', e.target.value)}
          />
          <Input
            label="Budget Minimum"
            type="number"
            prefix="$"
            value={settings.budgetMin}
            onChange={(e) => updateSetting('budgetMin', e.target.value)}
          />
          <Input
            label="Budget Maximum"
            type="number"
            prefix="$"
            value={settings.budgetMax}
            onChange={(e) => updateSetting('budgetMax', e.target.value)}
          />
          <Input
            label="Target Year"
            type="number"
            value={settings.targetYear}
            onChange={(e) => updateSetting('targetYear', e.target.value)}
          />
        </div>
      </Card>

      {/* Summary Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4">
          <p className="text-xs text-[var(--text-muted)] mb-1">Home Equity</p>
          <p className="text-xl font-mono font-semibold">{formatCurrency(homeEquity)}</p>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4">
          <p className="text-xs text-[var(--text-muted)] mb-1">Total Available</p>
          <p className="text-xl font-mono font-semibold">{formatCurrency(totalAvailable)}</p>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4">
          <p className="text-xs text-[var(--text-muted)] mb-1">Estimated Total Cost</p>
          <p className="text-xl font-mono font-semibold">{formatCurrency(estimatedTotalCost)}</p>
        </div>
        <div
          className={`border rounded-xl p-4 ${
            gapToFill > 0
              ? 'bg-red-500/10 border-red-500/20'
              : 'bg-green-500/10 border-green-500/20'
          }`}
        >
          <p className="text-xs text-[var(--text-muted)] mb-1">Gap to Fill</p>
          <p
            className={`text-xl font-mono font-semibold ${
              gapToFill > 0 ? 'text-red-400' : 'text-green-400'
            }`}
          >
            {gapToFill > 0 ? formatCurrency(gapToFill) : 'Fully Funded!'}
          </p>
        </div>
      </div>

      {/* Budget Categories */}
      <BudgetTable />

      {/* Savings Projection */}
      <SavingsProjection />

      {/* AI Suggestion Cards */}
      {suggestions.length > 0 && (
        <Card title="Insights">
          <div className="space-y-3">
            {suggestions.map((s) => (
              <div
                key={s.id}
                className={`p-3 rounded-lg border text-sm ${
                  s.type === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                    : s.type === 'success'
                      ? 'bg-green-500/10 border-green-500/20 text-green-300'
                      : 'bg-blue-500/10 border-blue-500/20 text-blue-300'
                }`}
              >
                {s.text}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
