import { useMemo } from 'react'

export function parseScorecardText(text) {
  if (typeof text !== 'string') return text
  const trimmed = text.trim()
  if (!trimmed) return null

  try {
    return JSON.parse(trimmed)
  } catch {
    // fall through to fence / brace handling below
  }

  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  if (fence && fence[1]) {
    try {
      return JSON.parse(fence[1].trim())
    } catch {
      // try brace fallback below
    }
  }

  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) {
    try {
      return JSON.parse(trimmed.slice(start, end + 1))
    } catch {
      return null
    }
  }

  return null
}

export default function ScorecardOutput({ data }) {
  const parsed = useMemo(() => {
    if (typeof data === 'string') {
      return parseScorecardText(data)
    }
    return data
  }, [data])

  if (!parsed) {
    return (
      <div className="p-4 dark:bg-surface-card bg-white border dark:border-border border-gray-200">
        <p className="text-sm dark:text-text-secondary text-gray-600">
          Could not parse the response as a scorecard. Raw output:
        </p>
        <pre className="mt-2 text-xs dark:text-text-primary text-gray-900 whitespace-pre-wrap font-mono">
          {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
        </pre>
      </div>
    )
  }

  const hasScore = Number.isFinite(parsed?.matchScore)
  const score = hasScore ? Math.min(100, Math.max(0, parsed.matchScore)) : null
  const scoreTone = !hasScore
    ? {
        text: 'text-gray-700 dark:text-text-secondary',
        stroke: 'stroke-gray-500 dark:stroke-gray-400',
        bar: 'bg-gray-400',
        label: 'Not scored',
      }
    : score >= 70
      ? {
          text: 'text-emerald-700 dark:text-emerald-300',
          stroke: 'stroke-emerald-700 dark:stroke-emerald-300',
          bar: 'bg-emerald-600',
          label: 'Strong',
        }
      : score >= 40
        ? {
            text: 'text-amber-700 dark:text-amber-300',
            stroke: 'stroke-amber-700 dark:stroke-amber-300',
            bar: 'bg-amber-600',
            label: 'Average',
          }
        : {
            text: 'text-red-700 dark:text-red-300',
            stroke: 'stroke-red-700 dark:stroke-red-300',
            bar: 'bg-red-600',
            label: 'Needs work',
          }

  const recommendation = parsed?.recommendation || 'N/A'
  const recColor =
    {
      'Strong Yes':
        'bg-emerald-500/10 text-emerald-800 border-emerald-500/30 dark:text-emerald-200',
      Yes: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/30 dark:text-emerald-200',
      Maybe: 'bg-amber-500/10 text-amber-800 border-amber-500/30 dark:text-amber-200',
      No: 'bg-red-500/10 text-red-800 border-red-500/30 dark:text-red-200',
    }[recommendation] || 'bg-gray-500/10 text-gray-800 border-gray-500/30 dark:text-gray-200'

  // SVG circle params
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - ((score ?? 0) / 100) * circumference

  return (
    <div className="animate-fade-in space-y-4">
      {/* Top: Score + Recommendation */}
      <div className="flex flex-wrap items-center gap-6 p-5 dark:bg-surface-card bg-white border dark:border-border border-gray-200">
        {/* Circular Score */}
        <div
          className="score-circle"
          role="img"
          aria-label={hasScore ? `Match score ${score} out of 100` : 'Match score not provided'}
        >
          <svg width={130} height={130} aria-hidden="true">
            <circle
              cx={65}
              cy={65}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={6}
              className="dark:text-text-primary text-gray-900"
            />
            <circle
              cx={65}
              cy={65}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={scoreTone.stroke}
              style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
            />
          </svg>
          <span className={`score-value ${scoreTone.text}`}>{hasScore ? score : 'N/A'}</span>
        </div>

        <div className="flex-1 min-w-[200px]">
          <div className="text-xs uppercase tracking-wider dark:text-text-muted text-gray-600 mb-1">
            Match Score
          </div>
          <div className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary mb-1">
            {hasScore ? `${score}/100` : 'Not provided'}
          </div>
          <div className={`mb-3 text-xs font-medium ${scoreTone.text}`}>{scoreTone.label}</div>
          <div
            className={`inline-flex items-center px-3 py-1 text-xs font-semibold border ${recColor}`}
          >
            {recommendation}
          </div>
        </div>
      </div>

      {/* Criteria Breakdown */}
      {parsed?.criteria &&
        typeof parsed.criteria === 'object' &&
        !Array.isArray(parsed.criteria) && (
          <div className="p-4 dark:bg-surface-card bg-white border dark:border-border border-gray-200">
            <h3 className="text-sm font-semibold dark:text-text-primary text-gray-900 mb-3">
              Criteria Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(parsed.criteria).map(([name, val]) => {
                const criterionHasScore = Number.isFinite(
                  typeof val === 'number' ? val : val?.score
                )
                const criterionScore = criterionHasScore
                  ? Math.min(100, Math.max(0, typeof val === 'number' ? val : val.score))
                  : null
                const criterionTone =
                  criterionScore === null
                    ? { text: 'text-gray-700 dark:text-text-secondary', bar: 'bg-gray-400' }
                    : criterionScore >= 70
                      ? {
                          text: 'text-emerald-700 dark:text-emerald-300',
                          bar: 'bg-emerald-600',
                        }
                      : criterionScore >= 40
                        ? {
                            text: 'text-amber-700 dark:text-amber-300',
                            bar: 'bg-amber-600',
                          }
                        : { text: 'text-red-700 dark:text-red-300', bar: 'bg-red-600' }

                return (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium dark:text-text-secondary text-gray-700">
                        {name}
                      </span>
                      <span className={`text-xs font-bold ${criterionTone.text}`}>
                        {criterionScore === null ? 'Not scored' : `${criterionScore}/100`}
                      </span>
                    </div>
                    <div className="w-full h-2 dark:bg-surface-input bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 ease-out ${criterionTone.bar}`}
                        style={{ width: `${criterionScore ?? 0}%` }}
                      />
                    </div>
                    {val?.comment && (
                      <p className="text-[11px] dark:text-text-secondary text-gray-600 mt-0.5">
                        {val.comment}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

      {/* Strengths & Gaps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.isArray(parsed?.strengths) && parsed.strengths.length > 0 && (
          <div className="p-4 dark:bg-surface-card bg-white border dark:border-border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200 mb-2">
              Top Strengths
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {parsed.strengths.map((s, i) => (
                <span
                  key={i}
                  className="inline-block px-2.5 py-1 text-[11px] font-medium bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 dark:text-emerald-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {Array.isArray(parsed?.gaps) && parsed.gaps.length > 0 && (
          <div className="p-4 dark:bg-surface-card bg-white border dark:border-border border-gray-200">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">Top Gaps</h3>
            <div className="flex flex-wrap gap-1.5">
              {parsed.gaps.map((g, i) => (
                <span
                  key={i}
                  className="inline-block px-2.5 py-1 text-[11px] font-medium bg-amber-500/10 text-amber-800 border border-amber-500/20 dark:text-amber-200"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reasoning */}
      {parsed?.reasoning && (
        <div className="p-4 dark:bg-surface-card bg-white border dark:border-border border-gray-200">
          <h3 className="text-sm font-semibold dark:text-text-primary text-gray-900 mb-2">
            Reasoning
          </h3>
          <p className="text-xs dark:text-text-secondary text-gray-600 leading-relaxed">
            {parsed.reasoning}
          </p>
        </div>
      )}
    </div>
  )
}
