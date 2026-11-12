import React from 'react'
import { AlertTriangle } from 'lucide-react'

const STORAGE_ERROR_NAMES = new Set([
  'QuotaExceededError',
  'NS_ERROR_DOM_QUOTA_REACHED',
  'SecurityError',
  'InvalidStateError',
])

const STORAGE_MESSAGE_PATTERN =
  /(?:\b(?:local|session)storage\b|\bindexeddb\b|\bquota(?:exceeded)?\b|\bjson\.parse\b|\bunexpected (?:token|end).*\bjson\b|\bstorage (?:access )?(?:is |was )?(?:blocked|denied|unavailable)\b|\bfailed to read (?:saved|stored|local) data\b)/i

const FALLBACK_COPY = {
  app: {
    title: 'Something went wrong',
    description:
      'This screen could not be displayed. Try again, or reload the page if the problem continues.',
  },
  output: {
    title: 'Could not display this output',
    description:
      'The generated response could not be rendered. Try again, or reload the page if the problem continues.',
  },
}

const STORAGE_COPY = {
  title: 'Saved data could not be read',
  description:
    'A browser storage error stopped this screen from loading. Reload the page to try again, or clear the data saved by this site if the problem continues.',
}

const PRIMARY_BUTTON =
  'px-4 py-2 bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200'
const SECONDARY_BUTTON =
  'border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-border dark:text-zinc-300 dark:hover:bg-surface-hover'

export function isStorageFailure(error) {
  if (!error) return false

  const name = typeof error.name === 'string' ? error.name : ''
  if (STORAGE_ERROR_NAMES.has(name)) return true

  const message = typeof error.message === 'string' ? error.message : String(error)
  return STORAGE_MESSAGE_PATTERN.test(message)
}

function reloadPage() {
  if (typeof window !== 'undefined' && typeof window.location?.reload === 'function') {
    window.location.reload()
  }
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, confirmingClear: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error, confirmingClear: false }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, confirmingClear: false })
  }

  handleReload = () => {
    const reload = this.props.onReload || reloadPage
    reload()
  }

  handleClearAndReload = () => {
    try {
      window.localStorage?.clear()
    } catch {
      // The reload can still recover when storage itself is unavailable.
    }

    try {
      window.sessionStorage?.clear()
    } catch {
      // The reload can still recover when storage itself is unavailable.
    }

    this.handleReload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const storageFailure = isStorageFailure(this.state.error)
    const copy = storageFailure
      ? STORAGE_COPY
      : FALLBACK_COPY[this.props.variant] || FALLBACK_COPY.app
    const diagnostic = this.state.error?.toString() || 'Unknown error'

    return (
      <div role="alert" className="my-4 border border-zinc-500/30 bg-zinc-500/10 p-6 text-center">
        <AlertTriangle className="mx-auto mb-4 text-zinc-500 dark:text-zinc-400" size={48} />
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-text-primary">
          {copy.title}
        </h3>
        <p className="mb-4 text-sm text-gray-600 dark:text-text-secondary">{copy.description}</p>
        <pre
          aria-label="Error details"
          className="overflow-x-auto whitespace-pre-wrap border border-gray-200 bg-white p-4 text-left text-xs text-gray-700 dark:border-border dark:bg-surface-card dark:text-zinc-300"
        >
          {diagnostic}
        </pre>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {storageFailure ? (
            <>
              <button type="button" onClick={this.handleReload} className={PRIMARY_BUTTON}>
                Reload page
              </button>
              <button
                type="button"
                onClick={() => this.setState({ confirmingClear: true })}
                className={SECONDARY_BUTTON}
              >
                Clear saved data
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={this.handleReset} className={PRIMARY_BUTTON}>
                Try Again
              </button>
              <button type="button" onClick={this.handleReload} className={SECONDARY_BUTTON}>
                Reload page
              </button>
            </>
          )}
        </div>

        {storageFailure && this.state.confirmingClear && (
          <div className="mt-4 border-t border-zinc-500/30 pt-4">
            <p className="text-xs text-gray-600 dark:text-text-secondary">
              This removes API keys, automations, preferences, and any sign-in state saved by this
              site.
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <button type="button" onClick={this.handleClearAndReload} className={PRIMARY_BUTTON}>
                Yes, clear and reload
              </button>
              <button
                type="button"
                onClick={() => this.setState({ confirmingClear: false })}
                className={SECONDARY_BUTTON}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default ErrorBoundary
