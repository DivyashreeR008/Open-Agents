import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart3, Activity, Users, Flame, Zap,
  TrendingUp, ArrowRight, Trash2, Bot, Trophy,
  Calendar, Clock, Target, Download, Filter,
} from 'lucide-react'
import { useAnalytics } from '../lib/useAnalytics'
import { useSessionSpend } from '../lib/useSessionSpend'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// ── Provider colors ─────────────────────────────────────────────────────────
const PROVIDER_COLORS = {
  openai: { color: '#D4D4D4', label: 'OpenAI' },
  anthropic: { color: '#C7C7C7', label: 'Anthropic' },
  gemini: { color: '#B8B8B8', label: 'Gemini' },
  openrouter: { color: '#9E9E9E', label: 'OpenRouter' },
  unknown: { color: '#737373', label: 'Unknown' },
}

// ── Category color mapping (matches HomePage categoryMeta) ───────────────────
const CATEGORY_COLORS = {
  Productivity: 'bg-zinc-400',
  Research: 'bg-zinc-400',
  Marketing: 'bg-zinc-400',
  Engineering: 'bg-zinc-400',
  HR: 'bg-zinc-400',
  Business: 'bg-zinc-400',
  Education: 'bg-zinc-400',
  Legal: 'bg-zinc-400',
  Design: 'bg-zinc-400',
  Product: 'bg-zinc-400',
  'Developer Tools': 'bg-zinc-400',
  DevOps: 'bg-zinc-400',
  Finance: 'bg-zinc-400',
  Healthcare: 'bg-zinc-400',
  Sales: 'bg-zinc-400',
  Cybersecurity: 'bg-zinc-400',
  'Data Science': 'bg-zinc-400',
  Gaming: 'bg-zinc-400',
  'Real Estate': 'bg-zinc-400',
  Web3: 'bg-zinc-400',
}
const DEFAULT_CATEGORY_COLOR = 'bg-zinc-500'

// ── Time range options ──────────────────────────────────────────────────────
const TIME_RANGES = [
  { value: 'all', label: 'All Time' },
  { value: '7d',  label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
]

// ── Heatmap intensity ───────────────────────────────────────────────────────
function getHeatmapIntensity(count) {
  if (count === 0) return 'bg-gray-100 dark:bg-white/5'
  if (count <= 2) return 'bg-zinc-200 dark:bg-zinc-500/25'
  if (count <= 5) return 'bg-zinc-400 dark:bg-zinc-500/50'
  return 'bg-zinc-600 dark:bg-zinc-400/80'
}

// ═════════════════════════════════════════════════════════════════════════════
// Main Page
// ═════════════════════════════════════════════════════════════════════════════

export default function AnalyticsPage() {
  useDocumentTitle('Dashboard')
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState('all')
  const { stats, clearAnalytics } = useAnalytics(timeRange)
  const { runs: spendRuns, totalSpend } = useSessionSpend()
  const totalTokens = useMemo(
    () => spendRuns.reduce((sum, r) => sum + (r.inputTokens || 0) + (r.outputTokens || 0), 0),
    [spendRuns]
  )

  // ── Empty state ───────────────────────────────────────────────────────────
  if (stats.totalRuns === 0 && timeRange === 'all') {
    return (
      <div className="animate-fade-in max-w-4xl mx-auto">
        <PageHeader onClear={clearAnalytics} hasData={false} timeRange={timeRange} setTimeRange={setTimeRange} />
        <div className=" border p-12 text-center flex flex-col items-center gap-4 dark:bg-surface-card dark:border-border bg-white border-gray-200">
          <div className="w-16 h-16 bg-zinc-500/10 flex items-center justify-center">
            <BarChart3 size={32} className="text-zinc-900 dark:text-white" />
          </div>
          <h2 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary">
            No analytics yet
          </h2>
          <p className="text-sm dark:text-text-secondary text-gray-500 max-w-md leading-relaxed">
            Run a few agents and your usage stats will automatically appear here —
            top agents, provider breakdown, activity streaks, and more.
          </p>
          <button
            onClick={() => navigate('/agents')}
            className="inline-flex items-center gap-2 h-8 px-3 text-sm font-semibold bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all duration-200 active:scale-[0.97] mt-2"
          >
            <Zap size={16} />
            Run an Agent
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Session spend can exist even with no recorded analytics events
            (e.g. analytics was cleared but session spend wasn't) */}
        {spendRuns.length > 0 && (
          <SectionCard title="Token Usage & Cost (This Session)" icon={<Zap size={16} />} delay={200}>
            <TokenUsageSection runs={spendRuns} totalTokens={totalTokens} totalSpend={totalSpend} />
          </SectionCard>
        )}
      </div>
    )
  }

  // ── Filtered-empty state (has data but not in this range) ─────────────────
  if (stats.totalRuns === 0 && timeRange !== 'all') {
    return (
      <div className="animate-fade-in max-w-5xl mx-auto">
        <PageHeader onClear={clearAnalytics} hasData={true} timeRange={timeRange} setTimeRange={setTimeRange} />
        <div className=" border p-12 text-center flex flex-col items-center gap-4 dark:bg-surface-card dark:border-border bg-white border-gray-200">
          <div className="w-14 h-14 bg-zinc-500/10 flex items-center justify-center">
            <Filter size={28} className="text-zinc-500" />
          </div>
          <h2 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary">
            No data in this range
          </h2>
          <p className="text-sm dark:text-text-secondary text-gray-500 max-w-md leading-relaxed">
            No agent runs found in the selected time range. Try selecting a broader range or "All Time".
          </p>
          <button
            onClick={() => setTimeRange('all')}
            className="inline-flex items-center gap-2 h-8 px-3 text-sm font-semibold text-zinc-900 border border-zinc-500/40 hover:bg-zinc-500/10 dark:text-white dark:border-white/40 transition-all duration-200 active:scale-[0.97] mt-2"
          >
            Show All Time
          </button>
        </div>

        {/* Session spend is not filtered by time range, so it can still
            be shown here even when the selected range has no runs */}
        {spendRuns.length > 0 && (
          <SectionCard title="Token Usage & Cost (This Session)" icon={<Zap size={16} />} delay={200}>
            <TokenUsageSection runs={spendRuns} totalTokens={totalTokens} totalSpend={totalSpend} />
          </SectionCard>
        )}
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <PageHeader onClear={clearAnalytics} hasData={true} timeRange={timeRange} setTimeRange={setTimeRange} />

      {/* ── Primary Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon={<Activity size={18} />}
          label="Total Runs"
          value={stats.totalRuns}
          color="text-zinc-900 dark:text-white"
          delay={0}
        />
        <StatCard
          icon={<Bot size={18} />}
          label="Unique Agents"
          value={stats.uniqueAgents}
          color="text-zinc-500"
          delay={60}
        />
        <StatCard
          icon={<Users size={18} />}
          label="Fav Provider"
          value={formatProvider(stats.favoriteProvider)}
          color="text-zinc-500"
          delay={120}
        />
        <StatCard
          icon={<Flame size={18} />}
          label="Day Streak"
          value={stats.currentStreak}
          color="text-zinc-500"
          delay={180}
        />
      </div>

      {/* ── Secondary Insights Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <MiniStatCard
          icon={<Trophy size={14} />}
          label="Best Streak"
          value={`${stats.longestStreak} days`}
          color="text-zinc-500"
          delay={240}
        />
        <MiniStatCard
          icon={<Target size={14} />}
          label="Avg/Day"
          value={stats.avgRunsPerDay}
          color="text-zinc-500"
          delay={280}
        />
        <MiniStatCard
          icon={<Calendar size={14} />}
          label="Peak Day"
          value={stats.mostProductiveDay || '—'}
          color="text-zinc-500"
          delay={320}
        />
        <MiniStatCard
          icon={<BarChart3 size={14} />}
          label="Categories"
          value={stats.categoryDistribution.length}
          color="text-zinc-500"
          delay={360}
        />
      </div>

      {/* ── Activity Heatmap ── */}
      <SectionCard title="Activity" icon={<TrendingUp size={16} />} delay={400}>
        <ActivityHeatmap data={stats.heatmapData} />
      </SectionCard>

      {/* ── Two-column: Top Agents + Provider Donut ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <div className="lg:col-span-3">
          <SectionCard title="Top Agents" icon={<BarChart3 size={16} />} delay={460}>
            <TopAgentsChart agents={stats.topAgents} navigate={navigate} />
          </SectionCard>
        </div>
        <div className="lg:col-span-2">
          <SectionCard title="Providers" icon={<Users size={16} />} delay={520}>
            <ProviderDonut data={stats.providerDistribution} total={stats.totalRuns} />
          </SectionCard>
        </div>
      </div>

      {/* ── Two-column: Categories + Sparkline ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <SectionCard title="Categories" icon={<BarChart3 size={16} />} delay={580}>
          <CategoryBars data={stats.categoryDistribution} />
        </SectionCard>
        <SectionCard title="Last 30 Days" icon={<Activity size={16} />} delay={640}>
          <Sparkline data={stats.dailyRuns} />
        </SectionCard>
      </div>

      {/* ── Recent Activity Timeline ── */}
      <SectionCard title="Recent Activity" icon={<Clock size={16} />} delay={700}>
        <RecentTimeline runs={stats.recentRuns} navigate={navigate} />
      </SectionCard>

      {/* ── Token Usage & Cost (current session) ── */}
        {spendRuns.length > 0 && (
          <SectionCard title="Token Usage & Cost (This Session)" icon={<Zap size={16} />} delay={760}>
            <TokenUsageSection runs={spendRuns} totalTokens={totalTokens} totalSpend={totalSpend} />
          </SectionCard>
        )}

        {/* ── Export Bar ── */}
        <ExportBar stats={stats} />
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// Sub-components
// ═════════════════════════════════════════════════════════════════════════════

function PageHeader({ onClear, hasData, timeRange, setTimeRange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-zinc-500/10 flex items-center justify-center">
          <BarChart3 size={20} className="text-zinc-900 dark:text-white" />
        </div>
        <div>
          <h1 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary">Dashboard</h1>
          <p className="text-xs dark:text-text-secondary text-gray-500">Your agent usage at a glance</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Time range pills */}
        <div className="flex items-center gap-1 p-0.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-border">
          {TIME_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-2.5 py-1 text-[10px] font-semibold transition-colors duration-200
                ${timeRange === range.value
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'text-gray-500 dark:text-text-muted hover:text-gray-700 dark:hover:text-text-primary'
                }`}
            >
              {range.label}
            </button>
          ))}
        </div>
        {hasData && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-500/10 transition-colors"
          >
            <Trash2 size={13} />
            Clear Data
          </button>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color, delay }) {
  return (
    <div
      className="relative p-4 border border-zinc-200 dark:border-border bg-white dark:bg-surface-card transition-colors duration-200 hover:border-zinc-400 dark:hover:border-zinc-400 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`mb-2 ${color}`}>{icon}</div>
      <div className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary tabular-nums">
        {value}
      </div>
      <div className="text-[11px] dark:text-text-muted text-gray-400 font-medium mt-0.5">
        {label}
      </div>
    </div>
  )
}

function MiniStatCard({ icon, label, value, color, delay }) {
  return (
    <div
      className="flex items-center gap-3 p-3 border dark:bg-surface-card dark:border-border bg-white border-gray-200 animate-fade-in transition-colors duration-200"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`p-2 bg-zinc-500/10 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-bold dark:text-text-primary text-gray-900 tabular-nums truncate">
          {value}
        </div>
        <div className="text-[10px] dark:text-text-muted text-gray-400 font-medium">
          {label}
        </div>
      </div>
    </div>
  )
}

function SectionCard({ title, icon, delay, children }) {
  return (
    <div
      className=" border p-4 mb-4 dark:bg-surface-card dark:border-border bg-white border-gray-200 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-zinc-600 dark:text-zinc-300">{icon}</span>
        <h2 className="eyebrow">
          {title}
        </h2>
      </div>
      {children}
    </div>
  )
}

// ── Activity Heatmap ────────────────────────────────────────────────────────

function ActivityHeatmap({ data }) {
  // Group by weeks (columns)
  const weeks = useMemo(() => {
    const w = []
    let currentWeek = []
    data.forEach((day, i) => {
      currentWeek.push(day)
      if (currentWeek.length === 7 || i === data.length - 1) {
        w.push(currentWeek)
        currentWeek = []
      }
    })
    return w
  }, [data])

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const [activeDay, setActiveDay] = useState(null)

  return (
    <div>
      <div className="flex gap-0.5 overflow-x-auto pb-2">
        {/* Day labels */}
        <div className="flex flex-col gap-0.5 mr-1 shrink-0">
          {dayLabels.map((label, i) => (
            <div key={i} className="h-[14px] w-4 flex items-center justify-center text-[8px] dark:text-text-muted text-gray-400 font-medium">
              {i % 2 === 1 ? label : ''}
            </div>
          ))}
        </div>
        {/* Week columns */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {week.map((day) => (
              <div
                key={day.date}
                className={`h-[14px] w-[14px] transition-all duration-300 ${getHeatmapIntensity(day.count)}`}
                title={`${day.date}: ${day.count} run${day.count !== 1 ? 's' : ''}`}
                role="img"
                tabIndex={0}
                aria-label={`${day.date}: ${day.count} run${day.count !== 1 ? 's' : ''}`}
                onFocus={() => setActiveDay(day)}
                onClick={() => setActiveDay(day)}
              />
            ))}
            {/* Pad short weeks */}
            {week.length < 7 && Array.from({ length: 7 - week.length }).map((_, i) => (
              <div key={`pad-${i}`} className="h-[14px] w-[14px]" />
            ))}
          </div>
        ))}
      </div>
      <p aria-live="polite" className="mt-1 min-h-[1rem] text-[11px] dark:text-text-secondary text-gray-600">
        {activeDay ? `${activeDay.date}: ${activeDay.count} run${activeDay.count !== 1 ? 's' : ''}` : ''}
      </p>
      {/* Legend */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[10px] dark:text-text-muted text-gray-400">Less</span>
        <div className="flex gap-0.5">
          {['bg-gray-100 dark:bg-white/5', 'bg-zinc-200 dark:bg-zinc-500/25', 'bg-zinc-400 dark:bg-zinc-500/50', 'bg-zinc-600 dark:bg-zinc-400/80'].map((cls, i) => (
            <div key={i} className={`h-[10px] w-[10px] -[2px] ${cls}`} />
          ))}
        </div>
        <span className="text-[10px] dark:text-text-muted text-gray-400">More</span>
      </div>
    </div>
  )
}

// ── Top Agents Bar Chart ────────────────────────────────────────────────────

function TopAgentsChart({ agents, navigate }) {
  if (agents.length === 0) return <EmptyMini text="No agent data yet" />

  const maxCount = agents[0]?.count || 1

  return (
    <div className="space-y-2.5">
      {agents.map((agent, i) => {
        const pct = Math.max(5, (agent.count / maxCount) * 100)
        return (
          <div
            key={agent.agentId}
            className="group cursor-pointer"
            onClick={() => navigate(`/agent/${agent.agentId}`)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium dark:text-text-primary text-gray-700 truncate max-w-[200px] group-hover:text-black dark:group-hover:text-white transition-colors">
                {agent.agentName}
              </span>
              <span className="text-[11px] font-bold tabular-nums dark:text-text-muted text-gray-400">
                {agent.count}
              </span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-white/5 overflow-hidden">
              <div
                className="h-full bg-zinc-400 group-hover:bg-zinc-300 transition-[width,background-color] duration-700 ease-out"
                style={{
                  width: `${pct}%`,
                  animationDelay: `${i * 80}ms`,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Provider Donut (SVG) ────────────────────────────────────────────────────

function ProviderDonut({ data, total }) {
  if (data.length === 0) return <EmptyMini text="No provider data" />

  const size = 140
  const strokeWidth = 22
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  let cumulativeOffset = 0
  const segments = data.map((item) => {
    const pct = item.count / total
    const dash = pct * circumference
    const offset = cumulativeOffset
    cumulativeOffset += dash
    const providerInfo = PROVIDER_COLORS[item.name] || PROVIDER_COLORS.unknown
    return { ...item, dash, offset, color: providerInfo.color, label: providerInfo.label }
  })

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-100 dark:text-white/5"
          />
          {/* Segments */}
          {segments.map((seg, i) => (
            <circle
              key={seg.name}
              cx={size / 2} cy={size / 2} r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
              strokeDashoffset={-seg.offset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary tabular-nums">{total}</span>
          <span className="text-[9px] dark:text-text-muted text-gray-400 font-medium">RUNS</span>
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
        {segments.map((seg) => (
          <div key={seg.name} className="flex items-center gap-1.5">
            <div className="w-2 h-2 " style={{ backgroundColor: seg.color }} />
            <span className="text-[10px] font-medium dark:text-text-secondary text-gray-500">
              {seg.label} ({seg.pct}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Category Breakdown Bars ─────────────────────────────────────────────────

function CategoryBars({ data }) {
  if (data.length === 0) return <EmptyMini text="No category data" />

  const maxCount = data[0]?.count || 1

  return (
    <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
      {data.map((cat, i) => {
        const pct = Math.max(5, (cat.count / maxCount) * 100)
        const gradient = CATEGORY_COLORS[cat.name] || DEFAULT_CATEGORY_COLOR
        return (
          <div key={cat.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium dark:text-text-primary text-gray-700">
                {cat.name}
              </span>
              <span className="text-[10px] font-bold tabular-nums dark:text-text-muted text-gray-400">
                {cat.count} ({cat.pct}%)
              </span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-white/5 overflow-hidden">
              <div
                className={`h-full ${gradient} transition-[width,background-color] duration-700 ease-out`}
                style={{ width: `${pct}%`, animationDelay: `${i * 60}ms` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Sparkline (last 30 days) ────────────────────────────────────────────────

function Sparkline({ data }) {
  if (!data || data.length < 2) return <EmptyMini text="Not enough data" />

  const maxCount = Math.max(...data.map((d) => d.count), 1)
  const width = 400
  const height = 100
  const padding = 4

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2)
    const y = height - padding - ((d.count / maxCount) * (height - padding * 2))
    return { x, y, ...d }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28 text-black dark:text-white" preserveAspectRatio="none">
        {/* Gradient fill */}
        <defs>
          <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Area */}
        <path d={areaPath} fill="url(#sparkline-gradient)" />
        {/* Line */}
        <path d={linePath} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots for days with runs */}
        {points.filter((p) => p.count > 0).map((p, i) => (
          <circle
            key={i}
            cx={p.x} cy={p.y} r="3"
            fill="currentColor"
            className="transition-all duration-300"
          >
            <title>{`${p.date}: ${p.count} run${p.count !== 1 ? 's' : ''}`}</title>
          </circle>
        ))}
      </svg>
      {/* X-axis labels */}
      <div className="flex justify-between mt-1">
        <span className="text-[9px] dark:text-text-muted text-gray-400">30 days ago</span>
        <span className="text-[9px] dark:text-text-muted text-gray-400">Today</span>
      </div>
    </div>
  )
}

// ── Recent Activity Timeline ────────────────────────────────────────────────

function RecentTimeline({ runs, navigate }) {
  if (!runs || runs.length === 0) return <EmptyMini text="No recent activity" />

  return (
    <div className="space-y-1">
      {runs.map((run, i) => {
        const time = new Date(run.timestamp)
        const timeStr = time.toLocaleString(undefined, {
          month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })
        const providerInfo = PROVIDER_COLORS[run.provider] || PROVIDER_COLORS.unknown
        const durationStr = run.duration ? `${(run.duration / 1000).toFixed(1)}s` : null

        return (
          <div
            key={run.id || i}
            className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group animate-fade-in"
            style={{ animationDelay: `${i * 40}ms` }}
            onClick={() => {
              const agentId = run.id?.split('_')[0]
              if (agentId) navigate(`/agent/${agentId}`)
            }}
          >
            {/* Timeline dot */}
            <div className="relative flex-shrink-0">
              <div
                className="w-2.5 h-2.5 ring-2 ring-white dark:ring-surface"
                style={{ backgroundColor: providerInfo.color }}
              />
              {i < runs.length - 1 && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-6 bg-gray-200 dark:bg-white/10" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold dark:text-text-primary text-gray-800 truncate group-hover:text-black dark:group-hover:text-white transition-colors">
                  {run.agentName || 'Unknown Agent'}
                </span>
                {run.category && (
                  <span className="text-[9px] font-medium px-1.5 py-0.5 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-text-muted shrink-0">
                    {run.category}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-medium" style={{ color: providerInfo.color }}>
                  {providerInfo.label}
                </span>
                {run.model && (
                  <>
                    <span className="text-[10px] dark:text-text-muted text-gray-300">·</span>
                    <span className="text-[10px] dark:text-text-muted text-gray-400 truncate max-w-[120px]">
                      {run.model}
                    </span>
                  </>
                )}
                {durationStr && (
                  <>
                    <span className="text-[10px] dark:text-text-muted text-gray-300">·</span>
                    <span className="text-[10px] dark:text-text-muted text-gray-400 flex items-center gap-0.5">
                      <Clock size={8} />
                      {durationStr}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Time */}
            <span className="text-[10px] dark:text-text-muted text-gray-400 tabular-nums shrink-0">
              {timeStr}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── Token Usage & Cost Section ──────────────────────────────────────────────

function formatSpend(cost) {
  if (cost == null || isNaN(cost)) return '—'
  if (cost < 0.01) return `$${cost.toFixed(4)}`
  return `$${cost.toFixed(2)}`
}

function TokenUsageSection({ runs, totalTokens, totalSpend }) {
  const recentRuns = runs.slice(0, 10)

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 dark:bg-surface-input bg-gray-50 border dark:border-border border-gray-200">
          <div className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary tabular-nums">
            {totalTokens.toLocaleString()}
          </div>
          <div className="text-[10px] dark:text-text-muted text-gray-400 font-medium">
            Total tokens (session)
          </div>
        </div>
        <div className="p-3 dark:bg-surface-input bg-gray-50 border dark:border-border border-gray-200">
          <div className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary tabular-nums">
            {formatSpend(totalSpend)}
          </div>
          <div className="text-[10px] dark:text-text-muted text-gray-400 font-medium">
            Estimated cost (session)
          </div>
        </div>
      </div>

      <div className="text-[11px] font-medium dark:text-text-muted text-gray-400 mb-2">
        Recent runs
      </div>
      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
        {recentRuns.map((run, i) => (
          <div
            key={`${run.timestamp}-${i}`}
            className="flex items-center justify-between h-8 px-3 dark:bg-surface-input bg-gray-50 border dark:border-border border-gray-200"
          >
            <div className="min-w-0">
              <div className="text-xs font-medium dark:text-text-primary text-gray-800 truncate max-w-[160px]">
                {run.model || 'Unknown model'}
              </div>
              <div className="text-[10px] dark:text-text-muted text-gray-400">
                {(run.inputTokens || 0).toLocaleString()} in · {(run.outputTokens || 0).toLocaleString()} out
              </div>
            </div>
            <div className="text-xs font-semibold dark:text-text-primary text-gray-900 tabular-nums shrink-0">
              {formatSpend(run.totalCost)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Export Bar ───────────────────────────────────────────────────────────────

function ExportBar({ stats }) {
  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      summary: {
        totalRuns: stats.totalRuns,
        uniqueAgents: stats.uniqueAgents,
        favoriteProvider: stats.favoriteProvider,
        currentStreak: stats.currentStreak,
        longestStreak: stats.longestStreak,
        avgRunsPerDay: stats.avgRunsPerDay,
        mostProductiveDay: stats.mostProductiveDay,
      },
      topAgents: stats.topAgents,
      providerDistribution: stats.providerDistribution,
      categoryDistribution: stats.categoryDistribution,
      dailyRuns: stats.dailyRuns,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dashboard-export-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex justify-center mb-8 animate-fade-in" style={{ animationDelay: '760ms' }}>
      <button
        onClick={handleExport}
        className="flex items-center gap-2 h-8 px-3 text-xs font-semibold dark:text-text-secondary text-gray-500 border dark:border-border border-gray-200 hover:border-zinc-400 dark:hover:border-zinc-400 hover:text-black dark:hover:text-white transition-all duration-200 active:scale-[0.97]"
      >
        <Download size={14} />
        Export Dashboard Data
      </button>
    </div>
  )
}

// ── Tiny empty state ────────────────────────────────────────────────────────

function EmptyMini({ text }) {
  return (
    <div className="py-6 text-center text-xs dark:text-text-muted text-gray-400">
      {text}
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatProvider(p) {
  const labels = { openai: 'OpenAI', anthropic: 'Anthropic', gemini: 'Gemini', openrouter: 'OpenRouter' }
  return labels[p] || p || '—'
}
