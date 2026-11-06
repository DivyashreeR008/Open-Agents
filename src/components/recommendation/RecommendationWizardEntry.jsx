import { forwardRef } from 'react'
import { SlidersHorizontal } from 'lucide-react'

const RecommendationWizardEntry = forwardRef(function RecommendationWizardEntry(
  { onOpen, disabled = false, loading = false },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={(event) => {
        event.preventDefault()
        onOpen?.(event)
      }}
      disabled={disabled || loading}
      className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold border border-black bg-black text-white hover:bg-zinc-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
      aria-label="Open smart agent recommendation wizard"
    >
      <SlidersHorizontal size={16} aria-hidden="true" />
      {loading ? 'Loading agents…' : 'Find my agent'}
    </button>
  )
})

export default RecommendationWizardEntry
