import { useId, useRef } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { useDialogFocus } from '../hooks/useDialogFocus'

const CANCEL_BUTTON =
  'border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:text-gray-900 dark:border-border dark:bg-surface-input dark:text-text-secondary dark:hover:text-text-primary'
const CONFIRM_BUTTON =
  'bg-zinc-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-500 active:scale-[0.98]'

/**
 * Modal confirmation for destructive actions.
 *
 * Focus starts on the safe action, Escape and the close control dismiss the
 * dialog, and tab movement stays inside the panel.
 */
export default function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
}) {
  const panelRef = useRef(null)
  const titleId = useId()
  const descriptionId = useId()
  useDialogFocus(panelRef, { onClose })

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="w-full max-w-md border border-gray-200 bg-white shadow-pop dark:border-border dark:bg-surface-card"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5 dark:border-border">
          <div className="flex items-start gap-3">
            <div className="bg-zinc-500/10 p-2 text-zinc-600 dark:text-zinc-300">
              <AlertTriangle size={18} aria-hidden="true" />
            </div>
            <div>
              <h2
                id={titleId}
                className="text-base font-semibold text-gray-900 dark:text-text-primary"
              >
                {title}
              </h2>
              {description && (
                <p
                  id={descriptionId}
                  className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-text-secondary"
                >
                  {description}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-text-primary"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex justify-end gap-2 p-5">
          <button type="button" data-autofocus onClick={onClose} className={CANCEL_BUTTON}>
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className={CONFIRM_BUTTON}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
