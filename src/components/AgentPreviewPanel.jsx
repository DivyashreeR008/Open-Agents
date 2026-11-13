import { useId, useState } from 'react'
import { ChevronDown, ChevronRight, FileCode2 } from 'lucide-react'
import { resolveAgentIcon } from '../lib/agentIcons'

const providerLabels = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  gemini: 'Gemini',
  openrouter: 'OpenRouter',
  any: 'Any',
}

const typeLabels = {
  text: 'Text',
  textarea: 'Textarea',
  code: 'Code',
  select: 'Select',
  multiselect: 'Multi-select',
}

export default function AgentPreviewPanel({ agent }) {
  const [promptOpen, setPromptOpen] = useState(false)
  const promptPanelId = useId()
  const promptButtonId = useId()
  const IconComponent = resolveAgentIcon(agent.icon)
  const inputs = Array.isArray(agent.inputs) ? agent.inputs : []
  const systemPrompt = typeof agent.systemPrompt === 'string' ? agent.systemPrompt : ''
  const hasSystemPrompt = systemPrompt.trim().length > 0

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Agent identity */}
      <div className="flex items-start gap-4 p-4 border dark:bg-surface-card dark:border-border bg-white border-gray-200">
        <div className="w-12 h-12 bg-zinc-500/10 flex items-center justify-center flex-shrink-0">
          <IconComponent size={24} className="text-zinc-900 dark:text-white" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h2 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary">
              {agent.name || 'Untitled agent'}
            </h2>
            <span className="text-[10px] font-medium px-2 py-0.5 dark:bg-surface-input dark:text-text-muted dark:border-border bg-gray-100 text-gray-500 border border-gray-200">
              {agent.category || 'Uncategorized'}
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 bg-zinc-500/10 text-zinc-900 dark:text-white border border-zinc-500/20">
              {providerLabels[agent.provider] || agent.provider || 'Unknown provider'}
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 dark:bg-surface-input dark:text-text-muted dark:border-border bg-gray-100 text-gray-500 border border-gray-200">
              {agent.outputType || 'Unknown output'}
            </span>
          </div>
          <p className="text-xs dark:text-text-secondary text-gray-500">
            {agent.description || 'No description provided.'}
          </p>
        </div>
      </div>

      {/* Input fields */}
      <div className="p-4 border dark:bg-surface-card dark:border-border bg-white border-gray-200">
        <h3 className="eyebrow mb-3">Input Fields</h3>
        <div className="space-y-2">
          {inputs.length === 0 && (
            <p className="text-xs dark:text-text-secondary text-gray-500">
              No input fields defined.
            </p>
          )}
          {inputs.map((input) => (
            <div
              key={input.id}
              className="flex items-start justify-between gap-3 p-2.5 dark:bg-surface-input bg-gray-50 border dark:border-border border-gray-200"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium dark:text-text-primary text-gray-800">
                    {input.label || 'Untitled field'}
                  </span>
                  {input.required && (
                    <>
                      <span aria-hidden="true" className="text-zinc-900 dark:text-white text-xs">
                        *
                      </span>
                      <span className="sr-only">Required field</span>
                    </>
                  )}
                </div>
                {input.placeholder && (
                  <p className="text-[11px] dark:text-text-muted text-gray-400 mt-0.5">
                    Placeholder: "{input.placeholder}"
                  </p>
                )}
                {input.options && input.options.length > 0 && (
                  <p className="text-[11px] dark:text-text-muted text-gray-400 mt-0.5">
                    Options: {input.options.join(', ')}
                  </p>
                )}
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 whitespace-nowrap dark:bg-surface-hover dark:text-text-secondary bg-gray-100 text-gray-500">
                {typeLabels[input.type] || input.type || 'Unknown type'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* System prompt, collapsed by default */}
      <div className=" border dark:bg-surface-card dark:border-border bg-white border-gray-200">
        <button
          type="button"
          id={promptButtonId}
          aria-expanded={promptOpen}
          aria-controls={promptPanelId}
          onClick={() => setPromptOpen((open) => !open)}
          className="w-full flex items-center justify-between px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-inset"
        >
          <div className="flex items-center gap-2">
            <FileCode2 size={14} aria-hidden="true" className="text-zinc-500 dark:text-zinc-400" />
            <span className="text-xs font-semibold dark:text-text-primary text-gray-700">
              System Prompt
            </span>
          </div>
          {promptOpen ? (
            <ChevronDown
              size={14}
              aria-hidden="true"
              className="dark:text-text-muted text-gray-400"
            />
          ) : (
            <ChevronRight
              size={14}
              aria-hidden="true"
              className="dark:text-text-muted text-gray-400"
            />
          )}
        </button>
        {promptOpen && (
          <div
            id={promptPanelId}
            role="region"
            aria-labelledby={promptButtonId}
            className="px-4 pb-4"
          >
            {hasSystemPrompt ? (
              <pre className="whitespace-pre-wrap break-words text-xs font-mono leading-relaxed p-3 dark:bg-[#0A0A0A] dark:text-text-secondary bg-gray-50 text-gray-700 border dark:border-border border-gray-200">
                {systemPrompt}
              </pre>
            ) : (
              <p className="text-xs dark:text-text-secondary text-gray-500">
                No system prompt provided for this agent.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
