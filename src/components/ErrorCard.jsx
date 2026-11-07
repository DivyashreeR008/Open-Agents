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
      className={` border p-4 animate-fade-in
      ${
        color === 'error' ? 'bg-zinc-500/5 border-zinc-500/20' : 'bg-zinc-500/5 border-zinc-500/20'
      }`}
    >
      <div className="flex items-start gap-3">
        <Icon
          size={18}
          className={`flex-shrink-0 mt-0.5 ${
            color === 'error' ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-300'
          }`}
        />
        <div>
          <h4
            className={`text-sm font-semibold mb-1 ${
              color === 'error'
                ? 'text-zinc-900 dark:text-white'
                : 'text-zinc-600 dark:text-zinc-300'
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
