const CharCounter = ({ value = '', maxLength = 5000, showLimit = false }) => {
  const length = String(value ?? '').length
  const atLimit = length >= maxLength

  return (
    <p className="mt-1 text-[11px] text-gray-400 dark:text-text-muted">
      <span aria-hidden="true">
        {length} / {maxLength} characters
      </span>
      <span className="sr-only">
        {length} of {maxLength} characters used.
      </span>
      <span
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={showLimit ? 'dark:text-text-secondary text-gray-600 font-medium' : 'sr-only'}
      >
        {atLimit ? (showLimit ? ' Limit reached' : ' Character limit reached.') : ''}
      </span>
    </p>
  )
}

export default CharCounter
