import { useId, useRef } from 'react'
import { FolderPlus, X } from 'lucide-react'
import { useDialogFocus } from '../hooks/useDialogFocus'

export default function CollectionModal({ title, description, value, onChange, error, onClose, onSubmit, submitLabel = 'Save', destructive = false, children }) {
  const panelRef = useRef(null)
  const titleId = useId()
  useDialogFocus(panelRef, { onClose })

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className="w-full max-w-md border border-gray-200 bg-white shadow-pop dark:border-border dark:bg-surface-card">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5 dark:border-border">
          <div className="flex items-start gap-3">
            <div className=" bg-zinc-500/10 p-2 text-zinc-600 dark:text-zinc-300"><FolderPlus size={18} /></div>
            <div>
              <h2 id={titleId} className="text-base font-semibold text-gray-900 dark:text-text-primary">{title}</h2>
              {description && <p className="mt-1 text-sm text-gray-500 dark:text-text-secondary">{description}</p>}
            </div>
          </div>
          <button type="button" onClick={onClose} className=" p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-text-primary" aria-label="Close dialog"><X size={18} /></button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 p-5">
          {children || (
            <label className="block text-sm font-medium text-gray-700 dark:text-text-secondary">
              Collection name
              <input
                data-autofocus
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="mt-2 w-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/40 dark:border-border dark:bg-surface-input dark:text-text-primary"
                placeholder="e.g. Launch planning"
              />
            </label>
          )}
          {error && <p className=" border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-500/30 dark:bg-zinc-500/10 dark:text-zinc-300">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className=" border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 dark:border-border dark:bg-surface-input dark:text-text-secondary dark:hover:text-text-primary">Cancel</button>
            <button type="submit" className={` px-4 py-2 text-sm font-semibold transition active:scale-[0.98] ${destructive ? 'bg-zinc-600 hover:bg-zinc-500 text-white' : 'bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200'}`}>{submitLabel}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
