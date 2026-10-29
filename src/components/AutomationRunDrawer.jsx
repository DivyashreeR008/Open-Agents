import { useId, useRef } from 'react'
import { useTimedState } from '../lib/useTimedState'
import { useDialogFocus } from '../hooks/useDialogFocus'
import {
  X, CheckCircle2, AlertCircle, Clock, Zap, Copy, Check,
  Mail, Calendar, FileText, ChevronRight, Share2, Download
} from 'lucide-react'
import OutputRenderer from './OutputRenderer'

export default function AutomationRunDrawer({ run, isOpen, onClose }) {
  const [copied, setCopied] = useTimedState(false, isOpen && Boolean(run))
  const panelRef = useRef(null)
  const titleId = useId()
  useDialogFocus(panelRef, { active: isOpen && Boolean(run), onClose })

  if (!isOpen || !run) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(run.output || run.error || '')
    setCopied(true, 2000)
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([run.output || run.error || ''], { type: 'text/markdown' })
    element.href = URL.createObjectURL(file)
    element.download = `${run.automationName.replace(/\s+/g, '_')}_${new Date(run.startedAt).toISOString().split('T')[0]}.md`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const formatDate = (ts) => {
    if (!ts) return '—'
    return new Date(ts).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className="relative w-full max-w-2xl h-full bg-white dark:bg-[#111111] text-gray-900 dark:text-gray-100 shadow-pop border-l dark:border-border/80 border-gray-200 z-10 flex flex-col animate-fade-in">
        {/* Header */}
        <div className="p-6 border-b dark:border-border/60 border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 flex items-center justify-center ${
              run.status === 'success' ? 'bg-zinc-500/15 text-zinc-500' :
              run.status === 'running' ? 'bg-zinc-500/15 text-zinc-500 animate-spin' :
              'bg-zinc-500/15 text-zinc-500'
            }`}>
              {run.status === 'success' ? <CheckCircle2 size={18} /> :
               run.status === 'running' ? <Zap size={18} /> :
               <AlertCircle size={18} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id={titleId} className="text-base font-bold truncate max-w-sm">
                  Run Execution Details
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 uppercase ${
                  run.status === 'success' ? 'bg-zinc-500/15 text-zinc-500' :
                  run.status === 'running' ? 'bg-zinc-500/15 text-zinc-500' :
                  'bg-zinc-500/15 text-zinc-500'
                }`}>
                  {run.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {run.automationName} • {run.agentName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy output"
              className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 dark:hover:bg-surface-hover dark:hover:text-white transition-colors"
              title="Copy Output"
            >
              {copied ? <Check size={16} className="text-zinc-500" /> : <Copy size={16} />}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              aria-label="Download markdown"
              className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 dark:hover:bg-surface-hover dark:hover:text-white transition-colors"
              title="Download Markdown"
            >
              <Download size={16} />
            </button>
            <button
              type="button"
              onClick={onClose}
              data-autofocus
              aria-label="Close run details"
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-surface-hover transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Metadata KPI Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 dark:bg-surface-card bg-gray-50 border dark:border-border/60 border-gray-200">
              <span className="text-[10px] font-medium text-gray-500 uppercase">Duration</span>
              <p className="text-sm font-bold mt-0.5">{(run.duration / 1000).toFixed(2)}s</p>
            </div>
            <div className="p-3 dark:bg-surface-card bg-gray-50 border dark:border-border/60 border-gray-200">
              <span className="text-[10px] font-medium text-gray-500 uppercase">Est. Tokens</span>
              <p className="text-sm font-bold mt-0.5">{run.tokens || '—'}</p>
            </div>
            <div className="p-3 dark:bg-surface-card bg-gray-50 border dark:border-border/60 border-gray-200">
              <span className="text-[10px] font-medium text-gray-500 uppercase">Started At</span>
              <p className="text-xs font-semibold mt-0.5 truncate">{formatDate(run.startedAt)}</p>
            </div>
            <div className="p-3 dark:bg-surface-card bg-gray-50 border dark:border-border/60 border-gray-200">
              <span className="text-[10px] font-medium text-gray-500 uppercase">Email Sent</span>
              <p className="text-xs font-semibold mt-0.5 flex items-center gap-1">
                {run.emailSent ? (
                  <span className="text-zinc-500 flex items-center gap-1">
                    <Mail size={12} /> Delivered
                  </span>
                ) : (
                  <span className="text-gray-400">Disabled/None</span>
                )}
              </p>
            </div>
          </div>

          {/* Error Diagnostics if failed */}
          {run.error && (
            <div className="p-4 border border-zinc-500/20 bg-zinc-500/10 text-zinc-500 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertCircle size={16} />
                <span>Execution Error Diagnostics</span>
              </div>
              <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed opacity-90">
                {run.error}
              </pre>
            </div>
          )}

          {/* Output Content */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Generated Agent Output
              </h4>
              <span className="text-[11px] font-mono text-gray-400">
                {run.output ? `${run.output.length} characters` : 'Empty'}
              </span>
            </div>

            <div className="p-4 border dark:border-border/70 border-gray-200 dark:bg-surface-card bg-white ">
              {run.output ? (
                <OutputRenderer
                  content={run.output}
                  outputType="markdown"
                  agentName={run.agentName}
                  systemPrompt=""
                />
              ) : (
                <div className="py-8 text-center text-xs text-gray-400">
                  No output generated for this run.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
