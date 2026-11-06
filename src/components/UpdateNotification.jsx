import { RefreshCw, X } from 'lucide-react'
import { usePwaUpdate } from '../lib/usePwaUpdate'

/**
 * Toast / banner notifying users when a new version of the PWA is available.
 * Accessible with role="status", polite live region, and keyboard operable.
 */
export default function UpdateNotification({
  // Optional props for direct unit testing or override
  updateAvailable: forcedUpdateAvailable,
  onUpdate: forcedOnUpdate,
  onDismiss: forcedOnDismiss,
} = {}) {
  const pwa = usePwaUpdate()

  const isAvailable =
    typeof forcedUpdateAvailable === 'boolean' ? forcedUpdateAvailable : pwa.updateAvailable
  const handleUpdate = forcedOnUpdate || pwa.applyUpdate
  const handleDismiss = forcedOnDismiss || pwa.dismiss

  if (!isAvailable) {
    return null
  }

  return (
    <aside
      role="status"
      aria-live="polite"
      aria-label="Application update available"
      className="fixed bottom-5 left-5 z-50 flex max-w-sm items-center gap-3 border border-zinc-300 bg-white px-4 py-3 shadow-pop dark:border-border dark:bg-surface-card"
    >
      <div className="flex-1 text-xs">
        <p className="font-semibold text-zinc-900 dark:text-text-primary">
          Update Available
        </p>
        <p className="text-zinc-600 dark:text-text-secondary">
          A new version of Open Agents is ready.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleUpdate}
          className="inline-flex items-center gap-1.5 border border-zinc-900 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-zinc-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500"
          aria-label="Reload and apply update"
        >
          <RefreshCw size={13} aria-hidden="true" />
          <span>Update</span>
        </button>

        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 text-zinc-400 hover:text-zinc-700 dark:text-text-muted dark:hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500"
          aria-label="Dismiss update notification"
        >
          <X size={15} aria-hidden="true" />
        </button>
      </div>
    </aside>
  )
}
