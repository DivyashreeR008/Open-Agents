import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  Code2,
  BarChart3,
  TrendingUp,
  DollarSign,
  Palette,
  PenLine,
  GraduationCap,
  Briefcase,
  HeartPulse,
  ShieldCheck,
  Gamepad2,
  Wand2,
  Loader2,
  GitBranch,
} from 'lucide-react'
import { suites } from '../suites/suitesData'
import SuiteWizard from '../components/SuiteWizard'
import PageHeader from '../components/layout/PageHeader'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { generateCustomSuite } from '../lib/customSuiteGenerator'
import { useApiKey } from '../lib/useApiKey'
import ApiKeyBar from '../components/ApiKeyBar'

// Map icon name string → Lucide component
const SUITE_ICONS = {
  Code2,
  BarChart3,
  TrendingUp,
  DollarSign,
  Palette,
  PenLine,
  GraduationCap,
  Briefcase,
  HeartPulse,
  ShieldCheck,
  Gamepad2,
}

/**
 * SuitesPage
 *
 * BROWSE state — shows all suite cards
 * QUIZ state   — shows SuiteWizard for the selected suite
 */
export default function SuitesPage() {
  useDocumentTitle('Suites')
  const navigate = useNavigate()
  const { provider, setProvider, apiKey, setApiKey, saveForSession, setSaveForSession } =
    useApiKey()

  const [activeSuite, setActiveSuite] = useState(null)
  const [selectedModel, setSelectedModel] = useState(null)

  // Custom suite generator state
  const [goal, setGoal] = useState('')
  const [customSuite, setCustomSuite] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [generatorError, setGeneratorError] = useState(null)

  const handleGenerateSuite = async () => {
    if (!goal.trim() || !apiKey) return
    setGenerating(true)
    setCustomSuite(null)
    setGeneratorError(null)
    try {
      const result = await generateCustomSuite(goal, apiKey, provider)
      setCustomSuite(result)
    } catch (err) {
      setGeneratorError("Couldn't generate your suite. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  const handleCreateWorkflow = () => {
    navigate('/workflows/build', {
      state: {
        preselectedAgents: customSuite.agents.map((a) => a.id),
        workflowTitle: customSuite.title,
      },
    })
  }

  // ── QUIZ state
  if (activeSuite) {
    return (
      <div className="animate-fade-in">
        <SuiteWizard suite={activeSuite} onBack={() => setActiveSuite(null)} />
      </div>
    )
  }

  // ── BROWSE state
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Suites"
        meta={suites.length}
        description="Curated agent collections for a specific goal"
      />

      {/* Custom Suite Generator */}
      <div className="panel mb-6 p-4">
        <div className="mb-1 flex items-center gap-2">
          <Wand2 size={14} className="text-zinc-900 dark:text-white" aria-hidden="true" />
          <h2 className="text-[13px] font-semibold text-zinc-900 dark:text-text-primary">
            Build your own suite
          </h2>
          <span className="badge">beta</span>
        </div>
        <p className="mb-4 text-xs leading-relaxed text-zinc-500 dark:text-text-secondary">
          Describe a goal and we'll pick the agents that fit it.
        </p>

        {/* API Key Bar */}
        <div className="mb-4">
          <ApiKeyBar
            provider={provider}
            setProvider={setProvider}
            apiKey={apiKey}
            setApiKey={setApiKey}
            saveForSession={saveForSession}
            setSaveForSession={setSaveForSession}
            agentProvider="any"
            model={selectedModel}
            setModel={setSelectedModel}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateSuite()}
            placeholder="e.g. I want to prepare for a Goldman Sachs interview..."
            className="field h-9 min-w-0 flex-1"
          />
          <button
            onClick={handleGenerateSuite}
            disabled={!goal.trim() || !apiKey || generating}
            className="btn-primary w-full shrink-0 sm:w-auto"
          >
            {generating ? <Loader2 size={13} className="animate-spin" /> : <Wand2 size={13} />}
            {generating ? 'Generating...' : 'Generate'}
          </button>
        </div>

        {generatorError && <p className="text-[11px] text-zinc-500 mt-2">{generatorError}</p>}

        {/* Custom Suite Result */}
        {customSuite && (
          <div className="mt-5 animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={13} className="text-zinc-600 dark:text-zinc-300" />
              <h3 className="text-sm font-bold dark:text-text-primary text-gray-900">
                {customSuite.title}
              </h3>
            </div>
            <p className="text-xs dark:text-text-secondary text-gray-500 mb-3">
              {customSuite.description}
            </p>
            <div className="flex flex-col gap-2">
              {customSuite.agents.map((agent, index) => (
                <div
                  key={agent.id}
                  className="flex items-center gap-3 border border-zinc-200 bg-zinc-50/60 p-2.5 dark:border-border dark:bg-surface-input/60"
                >
                  <span className="text-[11px] font-bold text-zinc-900 dark:text-white w-5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold dark:text-text-primary text-gray-900 truncate">
                      {agent.id}
                    </p>
                    <p className="text-[11px] dark:text-text-muted text-gray-400">{agent.reason}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/agent/${agent.id}`)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-zinc-900 hover:text-black dark:text-white dark:hover:text-zinc-200 transition-colors flex-shrink-0"
                  >
                    Open
                    <ArrowRight size={11} />
                  </button>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 mt-4">
              <button onClick={handleCreateWorkflow} className="btn-primary">
                <GitBranch size={13} aria-hidden="true" />
                Create workflow
              </button>
              <button
                onClick={() => {
                  setCustomSuite(null)
                  setGoal('')
                }}
                className="font-mono text-[11px] text-zinc-400 transition-colors hover:text-black dark:text-text-muted dark:hover:text-white"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Suite cards grid */}
      <div className="mb-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {suites.map((suite) => (
          <SuiteCard key={suite.id} suite={suite} onSelect={() => setActiveSuite(suite)} />
        ))}
      </div>

      {/* Footer note */}
      <div>
        <button
          onClick={() => navigate('/agents')}
          className="font-mono text-[11px] text-zinc-400 transition-colors hover:text-black dark:text-text-muted dark:hover:text-white"
        >
          Prefer to browse? View all agents →
        </button>
      </div>
    </div>
  )
}

// ── Suite card
function SuiteCard({ suite, onSelect }) {
  const IconComponent = SUITE_ICONS[suite.icon] || Code2
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex flex-col border border-zinc-200 bg-white p-3.5 text-left transition-colors hover:border-zinc-400 dark:border-border dark:bg-surface-card dark:hover:border-zinc-400"
    >
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center "
          style={{ backgroundColor: `${suite.color}1f` }}
        >
          <IconComponent size={15} style={{ color: suite.color }} aria-hidden="true" />
        </span>
        <h2 className="min-w-0 truncate text-[13px] font-semibold text-zinc-900 dark:text-text-primary">
          {suite.name}
        </h2>
      </div>

      <p className="mt-2.5 line-clamp-2 flex-1 text-xs leading-relaxed text-zinc-500 dark:text-text-secondary">
        {suite.description}
      </p>

      <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-2.5 dark:border-border/60">
        <span className="eyebrow">{suite.agents.length} agents</span>
        <span className="flex items-center gap-1 text-[11px] font-medium text-zinc-900 dark:text-white opacity-0 transition-opacity group-hover:opacity-100">
          Start
          <ArrowRight size={11} aria-hidden="true" />
        </span>
      </div>
    </button>
  )
}
