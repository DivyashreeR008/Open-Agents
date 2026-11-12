const CharCounter = ({ value = '', maxLength = 5000, showLimit = false }) => {
  const length = String(value ?? '').length
  const atLimit = length >= maxLength

  return (
    <p className="mt-1 text-[11px] text-gray-400 dark:text-text-muted">
      {length} / {maxLength} characters
      {showLimit && (
        <span aria-live="polite" className="dark:text-text-secondary text-gray-600 font-medium">
          {atLimit ? ' Limit reached' : ''}
        </span>
      )}
    </p>
  )
}

export default CharCounter
