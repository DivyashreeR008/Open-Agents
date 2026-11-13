import { useId, useRef, useState } from 'react'
import { X, Clock, Zap, AlertCircle, ShieldCheck, Mail, Lock } from 'lucide-react'
import { SCHEDULE_PRESETS, createAutomation } from '../lib/automationsService'
import { MODEL_MAP, MODELS } from '../lib/resolveAgentModel'
import { apiKeyFieldProps } from '../lib/apiKeyFieldProps'
import { useDialogFocus } from '../hooks/useDialogFocus'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * ScheduleAgentModal
 */
export default function ScheduleAgentModal({
  agent,
  inputs,
  provider,
  apiKey,
  onSchedule,
  onClose,
}) {
  const [label, setLabel] = useState(`${agent.name} Autopilot`)
  const [schedule, setSchedule] = useState('daily')
  const [selectedModel, setSelectedModel] = useState(MODEL_MAP[provider] || MODEL_MAP.openai)
  const [keyOverride, setKeyOverride] = useState(apiKey || '')
  const [emailNotification, setEmailNotification] = useState(false)
  const [notificationEmail, setNotificationEmail] = useState('')
  const [optInConsent, setOptInConsent] = useState(true)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [saving, setSaving] = useState(false)
  const panelRef = useRef(null)
  const nameId = useId()
  const modelId = useId()
  const emailId = useId()
  const emailHintId = `${emailId}-email-hint`
  const emailErrorId = `${emailId}-email-error`

  useDialogFocus(panelRef, { active: true, onClose })

  const missingRequiredInputs =
    agent.inputs?.filter((input) => {
      if (!input.required) return false
      const value = inputs[input.id]
      if (Array.isArray(value)) return value.length === 0
      return !value || String(value).trim() === ''
    }) || []

  const configuredInputCount = Object.values(inputs || {}).filter((value) => {
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'string') return value.trim() !== ''
    return value !== undefined && value !== null
  }).length

  const handleConfirm = async () => {
    if (!label.trim()) {
      setError('Please give this schedule a name.')
      return
    }
    if (missingRequiredInputs.length > 0) {
      setError('Fill all required inputs before scheduling.')
      return
    }
    if (!keyOverride.trim()) {
      setError('An API key is required to run scheduled jobs.')
      return
    }
    if (!optInConsent) {
      setError('Please check the opt-in consent for encrypted storage.')
      return
    }
    if (emailNotification) {
      const recipient = notificationEmail.trim()
      if (!recipient) {
        setError('')
        setEmailError('Please enter a recipient email address.')
        return
      }
      if (!EMAIL_PATTERN.test(recipient)) {
        setError('')
        setEmailError('Enter a valid recipient email address.')
        return
      }
    }
    setEmailError('')

    setError('')
    setSaving(true)
    try {
      await createAutomation({
        name: label.trim(),
        agentId: agent.id,
        agentName: agent.name,
        category: agent.category,
        provider,
        model: selectedModel,
        schedule,
        inputs: { ...inputs },
        systemPrompt: agent.systemPrompt,
        apiKey: keyOverride.trim(),
        emailNotification,
        notificationEmail: notificationEmail.trim(),
      })

      if (onSchedule) {
        onSchedule({
          label: label.trim(),
          schedule,
          model: selectedModel,
          apiKey: keyOverride.trim(),
          provider,
        })
      }
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to save automation')
    } finally {
      setSaving(false)
    }
  }

  const modelsForProvider = MODELS[provider] || MODELS.openai

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-agent-modal-title"
        className="relative w-full max-w-md shadow-pop animate-fade-in dark:bg-[#111111] dark:border dark:border-border bg-white border border-gray-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b dark:border-border border-gray-100 bg-zinc-500/10">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-zinc-900 dark:text-white" aria-hidden="true" />
            <h2
              id="schedule-agent-modal-title"
              className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary"
            >
              Schedule Agent Autopilot
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close schedule dialog"
            className="p-1.5 dark:hover:bg-surface-hover hover:bg-gray-100 transition-colors dark:text-text-muted text-gray-400"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Agent info */}
          <div className="flex items-center gap-3 p-3 dark:bg-surface-hover bg-gray-50">
            <div className="w-8 h-8 bg-zinc-500/15 flex items-center justify-center text-zinc-600 dark:text-zinc-300 flex-shrink-0">
              <Zap size={15} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold dark:text-text-primary text-gray-900 truncate">
                {agent.name}
              </p>
              <p className="text-[11px] dark:text-text-muted text-gray-400">
                {configuredInputCount} input(s) configured
              </p>
            </div>
          </div>

          {/* Schedule name */}
          <div>
            <label
              htmlFor={nameId}
              className="block text-xs font-semibold dark:text-text-secondary text-gray-600 mb-1"
            >
              Schedule name
            </label>
            <input
              id={nameId}
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Daily SEO Analysis"
              className="w-full h-9 px-3 text-sm transition-colors dark:bg-surface-input dark:border-border dark:text-text-primary bg-gray-50 border border-gray-200 text-gray-900 focus:ring-1 focus:ring-zinc-500/40 focus:border-zinc-500 outline-none"
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-xs font-semibold dark:text-text-secondary text-gray-600 mb-1">
              Run Frequency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SCHEDULE_PRESETS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setSchedule(opt.value)}
                  aria-pressed={schedule === opt.value}
                  className={`py-2 text-xs font-medium border transition-colors
                    ${
                      schedule === opt.value
                        ? 'border-zinc-900 bg-zinc-500/10 text-zinc-900 dark:border-white dark:text-white font-semibold'
                        : 'dark:border-border dark:text-text-secondary dark:hover:border-zinc-400 border-gray-200 text-gray-600'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Model */}
          <div>
            <label
              htmlFor={modelId}
              className="block text-xs font-semibold dark:text-text-secondary text-gray-600 mb-1"
            >
              Model
            </label>
            <select
              id={modelId}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full h-9 px-3 text-sm transition-colors dark:bg-surface-input dark:border-border dark:text-text-primary bg-gray-50 border border-gray-200 text-gray-900 focus:ring-1 focus:ring-zinc-500/40 focus:border-zinc-500 outline-none"
            >
              {modelsForProvider.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* This scheduler keeps its key only for the current browser session. */}
          <div className="p-3 border dark:border-zinc-500/30 border-zinc-200 bg-zinc-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                <ShieldCheck size={14} aria-hidden="true" /> Session-only Key Storage
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Clears with session</span>
            </div>
            <div className="relative">
              <input
                aria-label="Provider API key"
                type="password"
                {...apiKeyFieldProps('scheduled-run-api-key')}
                value={keyOverride}
                onChange={(e) => setKeyOverride(e.target.value)}
                placeholder="Enter provider API key"
                className="w-full h-8 pl-8 pr-3 text-xs font-mono dark:bg-surface-input dark:border-border dark:text-text-primary bg-white border border-gray-200 text-gray-900 outline-none"
              />
              <Lock
                size={12}
                aria-hidden="true"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
            <label className="flex items-start gap-1.5 cursor-pointer text-[10px] text-gray-500 dark:text-gray-400">
              <input
                type="checkbox"
                checked={optInConsent}
                onChange={(e) => setOptInConsent(e.target.checked)}
                className="mt-0.5 accent-zinc-500"
              />
              <span>
                Keep this key in session storage for automated runs in this browser session.
              </span>
            </label>
          </div>

          {/* Resend Email Notification */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs font-semibold dark:text-text-secondary text-gray-600">
              <span className="flex items-center gap-1.5">
                <Mail size={14} aria-hidden="true" className="text-zinc-500" /> Email Reports
                (Resend)
              </span>
              <input
                type="checkbox"
                checked={emailNotification}
                onChange={(e) => {
                  setEmailNotification(e.target.checked)
                  if (!e.target.checked) setEmailError('')
                }}
                className="accent-zinc-500"
              />
            </label>
            {emailNotification && (
              <div>
                <label htmlFor={emailId} className="sr-only">
                  Notification email address
                </label>
                <input
                  id={emailId}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={notificationEmail}
                  onChange={(e) => {
                    setNotificationEmail(e.target.value)
                    if (emailError) setEmailError('')
                  }}
                  aria-invalid={emailError ? 'true' : undefined}
                  aria-describedby={emailError ? `${emailHintId} ${emailErrorId}` : emailHintId}
                  placeholder="name@company.com"
                  className={`w-full h-8 px-3 text-xs dark:bg-surface-input dark:border-border bg-gray-50 border outline-none ${
                    emailError ? 'border-red-500/60' : 'border-gray-200'
                  }`}
                />
                <p id={emailHintId} className="mt-1 text-[10px] text-gray-500">
                  We will email a summary after each scheduled run.
                </p>
                {emailError && (
                  <p
                    id={emailErrorId}
                    role="alert"
                    className="mt-1 flex items-center gap-1 text-[10px] text-red-500"
                  >
                    <AlertCircle size={11} aria-hidden="true" />
                    {emailError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-500/10 h-8 px-3 border border-zinc-500/20"
            >
              <AlertCircle size={13} aria-hidden="true" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 pb-5 pt-2 border-t dark:border-border/60 border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-3 text-xs font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={saving}
            aria-busy={saving}
            className="flex items-center gap-2 h-8 px-3 text-xs font-bold bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all active:scale-[0.97]"
          >
            <Clock size={14} aria-hidden="true" />
            {saving ? 'Activating...' : 'Activate Autopilot'}
          </button>
        </div>
      </div>
    </div>
  )
}
