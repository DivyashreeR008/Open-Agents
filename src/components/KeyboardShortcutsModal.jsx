import { useRef } from 'react'
import { X, Command, CornerDownLeft, Search, Type, HelpCircle } from 'lucide-react'
import { useDialogFocus } from '../hooks/useDialogFocus'

export const KEYBOARD_SHORTCUTS = [
  {
    key: 'Ctrl / Cmd + K',
    description: 'Open the command palette',
    icon: Command,
  },
  {
    key: 'Ctrl + Enter',
    description: 'Run the current agent',
    icon: CornerDownLeft,
  },
  {
    key: '/',
    description: 'Focus the agent search on the catalogue',
    icon: Search,
  },
  {
    key: 'Esc',
    description: 'Clear agent inputs or close the playground',
    icon: X,
  },
  {
    key: 'Alt + 1 / 2 / 3 / 4',
    description: 'Switch provider (OpenAI, Anthropic, Gemini, OpenRouter)',
    icon: Type,
  },
  {
    key: '?',
    description: 'Open this shortcut guide',
    icon: HelpCircle,
  },
]

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  const panelRef = useRef(null)
  useDialogFocus(panelRef, { active: isOpen, onClose })

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyboard-shortcuts-title"
        className="w-full max-w-md bg-white dark:bg-surface-card border border-gray-200 dark:border-border shadow-pop overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-border">
          <h2
            id="keyboard-shortcuts-title"
            className="text-lg font-bold text-gray-900 dark:text-text-primary flex items-center gap-2"
          >
            <Command size={20} className="text-zinc-900 dark:text-white" aria-hidden="true" />
            Keyboard Shortcuts
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-surface-hover transition-colors"
            aria-label="Close keyboard shortcuts dialog"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <ul aria-label="Available keyboard shortcuts" className="px-6 py-4 space-y-4">
          {KEYBOARD_SHORTCUTS.map((shortcut) => {
            const Icon = shortcut.icon
            return (
              <li key={shortcut.key} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    aria-hidden="true"
                    className="w-8 h-8 bg-zinc-500/10 flex items-center justify-center text-zinc-600 dark:text-zinc-300"
                  >
                    <Icon size={14} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-text-secondary">
                    {shortcut.description}
                  </span>
                </div>
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-300 dark:bg-surface-input dark:border-border dark:text-text-muted font-mono shrink-0">
                  {shortcut.key}
                </kbd>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
