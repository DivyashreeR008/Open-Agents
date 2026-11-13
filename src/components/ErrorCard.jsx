import { AlertTriangle, XCircle, Wifi } from 'lucide-react'

export default function ErrorCard({ message }) {
  // Determine icon based on error content
  let Icon = XCircle
  let color = 'error'

  // Only call .includes if message is a string!
  if (typeof message === 'string' && /rate limit|quota used up/i.test(message)) {
    Icon = AlertTriangle
    color = 'warning'
  } else if (typeof message === 'string' && /connection|reach/i.test(message)) {
    Icon = Wifi
    color = 'warning'
  }

  return (
    <div
      role={color === 'error' ? 'alert' : 'status'}
      className={`animate-fade-in border p-4 ${
        color === 'error' ? 'border-red-500/30 bg-red-500/5' : 'border-amber-500/30 bg-amber-500/5'
      }`}
    >
      <div className="flex items-start gap-3">
        <Icon
          size={18}
          aria-hidden="true"
          className={`mt-0.5 flex-shrink-0 ${
            color === 'error'
              ? 'text-red-600 dark:text-red-400'
              : 'text-amber-600 dark:text-amber-400'
          }`}
        />
        <div>
          <h4
            className={`mb-1 text-sm font-semibold ${
              color === 'error'
                ? 'text-red-700 dark:text-red-300'
                : 'text-amber-700 dark:text-amber-300'
            }`}
          >
            {color === 'error' ? 'Error' : 'Warning'}
          </h4>
          {typeof message === 'string' ? (
            <p className="text-xs dark:text-text-secondary text-gray-600 leading-relaxed whitespace-pre-wrap">
              {message}
            </p>
          ) : (
            <div className="text-xs dark:text-text-secondary text-gray-600 leading-relaxed whitespace-pre-wrap">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
