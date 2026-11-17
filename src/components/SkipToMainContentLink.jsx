/** ID for the primary content landmark targeted by the skip link (WCAG 2.4.1). */
export const MAIN_CONTENT_ID = 'main-content'

/**
 * First focusable control in the app shell. Visually hidden until focused,
 * then jumps keyboard and screen-reader users past navbar + sidebar chrome.
 */
export default function SkipToMainContentLink() {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      onClick={() => {
        const main = document.getElementById(MAIN_CONTENT_ID)
        if (main) main.focus({ preventScroll: true })
      }}
      className="fixed top-3 left-3 z-[200] -translate-y-[200%] border border-zinc-300 bg-black px-4 py-2 text-sm font-medium text-white shadow-lg transition-transform focus:translate-y-0 focus:outline-2 focus:outline-offset-2 focus:outline-zinc-500 dark:border-border-light dark:bg-white dark:text-black"
    >
      Skip to main content
    </a>
  )
}
