import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  SkipForward,
  Sparkles,
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
} from 'lucide-react'
import { useAgents } from '../lib/useAgents'

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
 * SuiteWizard
 * Walks the user through a suite's quiz questions and recommends agents
 * based on the tags associated with each answer.
 *
 * Props:
 *   suite  — suite object from suitesData.js
 *   onBack — callback to return to the suites browse view
 */
export default function SuiteWizard({ suite, onBack }) {
  const navigate = useNavigate()
  const { agents: allAgents } = useAgents()

  const questions = useMemo(
    () =>
      Array.isArray(suite.quiz?.questions)
        ? suite.quiz.questions.filter(
            (question) => question && typeof question === 'object' && !Array.isArray(question)
          )
        : [],
    [suite.quiz?.questions]
  )

  // ── State
  const [step, setStep] = useState(0) // current question index, -1 = results
  const [answers, setAnswers] = useState(Array(questions.length).fill(null))
  // selected option index for current question
  // tagCounts maps agentId → number of times it appeared in chosen tags
  const [tagCounts, setTagCounts] = useState({})
  const [answeredCount, setAnsweredCount] = useState(0)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== 'Enter' || event.repeat) return

      const active = document.activeElement

      if (active) {
        const tag = active.tagName

        const isInteractive = ['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'A'].includes(tag)

        const isSelectedOptionButton =
          active.dataset.option === 'true' && Number(active.dataset.index) === answers[step]

        if (isInteractive && !isSelectedOptionButton) {
          return
        }
      }

      if (answers[step] == null) return

      event.preventDefault()
      handleNext()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [answers, step])

  // ── Helpers

  // Look up a full agent object by id from the loaded agents list
  const allKnownAgents = Array.isArray(allAgents) ? allAgents : []
  const suiteAgentIds = Array.isArray(suite.agents) ? suite.agents : []
  const optionsFor = (question) => (Array.isArray(question?.options) ? question.options : [])

  // Commit the current answer and advance
  const handleNext = () => {
    const newCounts = {}
    let newAnsweredCount = 0

    answers.forEach((selected, questionIndex) => {
      if (selected == null) return

      newAnsweredCount++

      const option = optionsFor(questions[questionIndex])[selected]
      if (!option) return

      const tags = Array.isArray(option.tags) ? option.tags : []
      tags.forEach((tag) => {
        if (typeof tag !== 'string') return
        newCounts[tag] = (newCounts[tag] || 0) + 1
      })
    })

    setTagCounts(newCounts)
    setAnsweredCount(newAnsweredCount)

    advance()
  }

  // Skip current question without recording an answer
  const handleSkip = () => {
    advance()
  }

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1)
    }
  }
  const advance = () => {
    if (step + 1 >= questions.length) {
      setShowResults(true)
    } else {
      setStep((s) => s + 1)
    }
  }

  // Skip quiz entirely — show all suite agents unranked
  const handleViewAll = () => {
    setTagCounts({})
    setAnsweredCount(0)
    setShowResults(true)
  }

  // ── Build ranked agent list
  const rankedAgents = useMemo(() => {
    const totalQ = answeredCount || 0

    return suiteAgentIds
      .map((id) => {
        const agent = allKnownAgents.find((a) => a.id === id)
        const mentions = tagCounts[id] || 0
        const pct = totalQ > 0 ? Math.round((mentions / totalQ) * 100) : 0
        return { id, agent, mentions, pct }
      })
      .sort((a, b) => b.pct - a.pct || (a.agent?.name ?? a.id).localeCompare(b.agent?.name ?? b.id))
  }, [tagCounts, answeredCount, suiteAgentIds, allKnownAgents])

  // ── Badge colour based on match %
  const badgeClass = (pct, answeredCount) => {
    if (answeredCount === 0)
      return 'bg-gray-100 text-gray-500 dark:bg-surface-hover dark:text-text-muted'
    if (pct >= 80) return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400'
    if (pct >= 60) return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400'
    return 'bg-gray-100 text-gray-500 dark:bg-surface-hover dark:text-text-muted'
  }

  // ─────────────────────────────────────────────────────
  // RESULTS VIEW
  // ─────────────────────────────────────────────────────
  if (showResults) {
    const matched = rankedAgents.filter((r) => r.pct > 0)
    const unmatched = rankedAgents.filter((r) => r.pct === 0)
    const SuiteIcon = SUITE_ICONS[suite.icon] || Code2

    return (
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="p-1.5 transition-colors dark:hover:bg-surface-hover hover:bg-gray-100 dark:text-text-secondary text-gray-500"
            aria-label="Back to suites"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            <SuiteIcon size={18} style={{ color: suite.color }} />
            <div>
              <h2 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary">
                {suite.name}
              </h2>
              <p className="text-xs dark:text-text-muted text-gray-400">
                {answeredCount > 0
                  ? `Recommended based on your answers`
                  : 'All agents in this suite'}
              </p>
            </div>
          </div>
        </div>

        {/* Matched agents */}
        {matched.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-zinc-600 dark:text-zinc-300" />
              <span className="eyebrow">Best matches for you</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {matched.map(({ id, agent, pct }) => (
                <AgentResultCard
                  key={id}
                  id={id}
                  agent={agent}
                  pct={pct}
                  answeredCount={answeredCount}
                  badgeClass={badgeClass}
                  onClick={() => agent && navigate(`/agent/${agent.id}`)}
                />
              ))}
            </div>
          </>
        )}

        {/* Unmatched agents */}
        {unmatched.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-3 mt-2">
              <span className="eyebrow">Also in this suite</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {unmatched.map(({ id, agent, pct }) => (
                <AgentResultCard
                  key={id}
                  id={id}
                  agent={agent}
                  pct={pct}
                  answeredCount={answeredCount}
                  badgeClass={badgeClass}
                  onClick={() => agent && navigate(`/agent/${agent.id}`)}
                />
              ))}
            </div>
          </>
        )}

        {/* If no agents found at all */}
        {rankedAgents.length === 0 && (
          <div className="text-center py-12 dark:text-text-muted text-gray-400 text-sm">
            No agents found in this suite.
          </div>
        )}
      </div>
    )
  }

  // ─────────────────────────────────────────────────────
  // QUIZ VIEW
  // ─────────────────────────────────────────────────────
  if (questions.length === 0) {
    const SuiteIcon = SUITE_ICONS[suite.icon] || Code2
    return (
      <div className="max-w-xl mx-auto animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="p-1.5 transition-colors dark:hover:bg-surface-hover hover:bg-gray-100 dark:text-text-secondary text-gray-500"
            aria-label="Back to suites"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            <SuiteIcon size={16} style={{ color: suite.color }} />
            <h2 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary">
              {suite.name}
            </h2>
          </div>
        </div>
        <div
          role="status"
          className="border border-zinc-200 bg-white p-8 text-center dark:border-border dark:bg-surface-card"
        >
          <p className="text-sm font-medium text-zinc-900 dark:text-text-primary">
            This suite has no quiz questions.
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-text-muted">
            You can still browse every agent included in the suite.
          </p>
          <button
            onClick={handleViewAll}
            className="mt-4 h-8 border border-zinc-300 px-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-border dark:text-white dark:hover:bg-surface-hover"
          >
            View all agents
          </button>
        </div>
      </div>
    )
  }

  const question = questions[step]
  const options = optionsFor(question)
  const progress =
    questions.length > 0
      ? Math.min(
          100,
          Math.max(0, ((Math.min(step, questions.length - 1) + 1) / questions.length) * 100)
        )
      : 0
  const SuiteIcon = SUITE_ICONS[suite.icon] || Code2

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      {/* Back + title */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-1.5 transition-colors dark:hover:bg-surface-hover hover:bg-gray-100 dark:text-text-secondary text-gray-500"
          aria-label="Back to suites"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          <SuiteIcon size={16} style={{ color: suite.color }} />
          <div>
            <h2 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary">
              {suite.name}
            </h2>
            <p className="text-xs dark:text-text-muted text-gray-400">
              Question {step + 1} of {questions.length}
            </p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-1.5 bg-gray-200 dark:bg-surface-hover mb-2 overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div
          className="h-full bg-zinc-900 dark:bg-white transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-gray-500 dark:text-text-muted mb-8">
        {Math.round(progress)}% complete
      </p>

      {/* Question */}
      <h3 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary mb-6 leading-snug">
        {question?.question || 'Untitled question'}
      </h3>

      {/* Options — 2-col grid */}
      {options.length === 0 ? (
        <div
          role="status"
          className="mb-8 border border-dashed border-zinc-300 p-6 text-center text-sm text-gray-500 dark:border-border dark:text-text-muted"
        >
          No answer options are available for this question. Skip it to continue.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {options.map((opt, idx) => (
            <button
              key={idx}
              data-option="true"
              data-index={idx}
              onClick={() => {
                const updated = [...answers]
                updated[step] = idx
                setAnswers(updated)
              }}
              className={`text-left px-4 py-3.5 border text-sm font-medium transition-all duration-150
              ${
                answers[step] === idx
                  ? 'border-zinc-900 bg-zinc-900/5 dark:bg-white/10 dark:border-white text-zinc-900 dark:text-white'
                  : 'dark:bg-surface-card dark:border-border dark:text-text-primary dark:hover:border-zinc-400 bg-white border-gray-200 text-gray-700 hover:border-zinc-400/60'
              }`}
            >
              {opt?.label || 'Untitled option'}
            </button>
          ))}
        </div>
      )}

      {/* Footer controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleSkip}
          className="flex items-center gap-1.5 text-xs dark:text-text-muted text-gray-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <SkipForward size={13} />
          Skip this question
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="px-3 py-2 text-sm border disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleViewAll}
            className="text-xs dark:text-text-muted text-gray-400 hover:text-black dark:hover:text-white transition-colors px-2 py-1.5"
          >
            View all agents
          </button>
          <button
            onClick={handleNext}
            disabled={answers[step] === null}
            className="flex items-center gap-1.5 h-8 px-3 text-sm font-semibold text-white bg-black hover:bg-zinc-800 dark:text-black dark:bg-white dark:hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 active:scale-[0.97]"
          >
            Next
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Small result card component
function AgentResultCard({ id, agent, pct, answeredCount, badgeClass, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={!agent}
      className="text-left p-4 border transition-all duration-150 group dark:bg-surface-card dark:border-border dark:hover:border-zinc-400 bg-white border-gray-200 hover:border-zinc-400/60 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className="text-sm font-semibold dark:text-text-primary text-gray-900 leading-tight group-hover:text-black dark:group-hover:text-white transition-colors">
          {agent?.name ?? id}
        </span>
        {answeredCount > 0 && (
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 flex-shrink-0 ${badgeClass(pct, answeredCount)}`}
          >
            {pct}%
          </span>
        )}
      </div>
      {agent?.description && (
        <p className="text-[11px] dark:text-text-muted text-gray-500 line-clamp-2 leading-relaxed">
          {agent.description}
        </p>
      )}
      {!agent && <p className="text-[11px] text-gray-400 italic">Agent not found</p>}
    </button>
  )
}
