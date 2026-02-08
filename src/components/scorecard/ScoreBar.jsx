// Visual score bar component — shows a 1-10 score with color coding
import { getScoreColor, getScoreLabel } from './criteria'

const colorMap = {
  green: 'bg-emerald-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
}

const bgMap = {
  green: 'bg-emerald-500/15',
  blue: 'bg-blue-500/15',
  amber: 'bg-amber-500/15',
  red: 'bg-red-500/15',
}

const textMap = {
  green: 'text-emerald-400',
  blue: 'text-blue-400',
  amber: 'text-amber-400',
  red: 'text-red-400',
}

// Letter grade helper — maps 1-10 numeric score to letter grade + color
export function getLetterGrade(score) {
  if (!score || score <= 0) return { letter: '--', color: 'gray' }
  if (score >= 9) return { letter: 'A+', color: 'emerald' }
  if (score >= 8) return { letter: 'A', color: 'emerald' }
  if (score >= 7) return { letter: 'B+', color: 'blue' }
  if (score >= 6) return { letter: 'B', color: 'blue' }
  if (score >= 5) return { letter: 'C+', color: 'amber' }
  if (score >= 4) return { letter: 'C', color: 'amber' }
  if (score >= 3) return { letter: 'D', color: 'red' }
  return { letter: 'F', color: 'red' }
}

const gradeBgMap = {
  emerald: 'bg-emerald-500/15',
  blue: 'bg-blue-500/15',
  amber: 'bg-amber-500/15',
  red: 'bg-red-500/15',
  gray: 'bg-[var(--bg-secondary)]',
}

const gradeTextMap = {
  emerald: 'text-emerald-400',
  blue: 'text-blue-400',
  amber: 'text-amber-400',
  red: 'text-red-400',
  gray: 'text-[var(--text-muted)]',
}

export default function ScoreBar({ score, showLabel = false, compact = false }) {
  if (!score || score === 0) {
    return (
      <div className={`flex items-center gap-2 ${compact ? '' : 'min-w-[120px]'}`}>
        <div className="flex-1 h-1.5 rounded-full bg-[var(--bg-secondary)]" />
        <span className="text-xs text-[var(--text-muted)] font-mono w-6 text-right">--</span>
      </div>
    )
  }

  const color = getScoreColor(score)
  const pct = (score / 10) * 100

  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'min-w-[120px]'}`}>
      <div className={`flex-1 h-1.5 rounded-full ${bgMap[color]}`}>
        <div
          className={`h-full rounded-full ${colorMap[color]} transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-mono w-6 text-right font-semibold ${textMap[color]}`}>
        {score}
      </span>
      {showLabel && (
        <span className={`text-xs ${textMap[color]}`}>{getScoreLabel(score)}</span>
      )}
    </div>
  )
}

// Composite score badge — shows letter grade as primary, numeric as secondary
export function ScoreBadge({ score, size = 'md' }) {
  if (!score || score === 0) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-[var(--bg-secondary)] ${size === 'lg' ? 'w-14 h-14' : 'w-10 h-10'}`}>
        <span className="text-xs text-[var(--text-muted)]">--</span>
      </div>
    )
  }

  const grade = getLetterGrade(score)
  const displayScore = score % 1 === 0 ? score : score.toFixed(1)

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg ${gradeBgMap[grade.color]} ${size === 'lg' ? 'w-14 h-14' : 'w-10 h-10'}`}
      title={`Score: ${displayScore}/10`}
    >
      <span className={`font-mono font-bold ${gradeTextMap[grade.color]} ${size === 'lg' ? 'text-lg' : 'text-sm'}`}>
        {grade.letter}
      </span>
      <span className={`text-[10px] font-mono ${gradeTextMap[grade.color]} opacity-75`}>
        ({displayScore})
      </span>
    </div>
  )
}
