/**
 * Render text with case-insensitive query matches wrapped in <mark>.
 *
 * The original casing is preserved, repeated matches are all marked, and the
 * query is treated as literal text rather than a regular expression.
 */
export default function HighlightedText({ text, query }) {
  const value = String(text ?? '')
  const needle = String(query ?? '').trim()

  if (!needle) return value

  const lowerValue = value.toLowerCase()
  const lowerNeedle = needle.toLowerCase()
  const parts = []
  let cursor = 0
  let matchIndex = lowerValue.indexOf(lowerNeedle)
  let matchNumber = 0

  while (matchIndex !== -1) {
    if (matchIndex > cursor) {
      parts.push(value.slice(cursor, matchIndex))
    }
    parts.push(
      <mark key={`match-${matchNumber}`} className="bg-zinc-200 text-inherit dark:bg-zinc-700">
        {value.slice(matchIndex, matchIndex + needle.length)}
      </mark>
    )
    matchNumber += 1
    cursor = matchIndex + needle.length
    matchIndex = lowerValue.indexOf(lowerNeedle, cursor)
  }

  if (matchNumber === 0) return value

  parts.push(value.slice(cursor))
  return parts
}
