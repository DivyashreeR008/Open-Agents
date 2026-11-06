import { useCallback, useEffect, useRef, useState } from 'react'

const BOOT_MS = 350
const PROGRESS_MS = 1000
const PROGRESS_TICK_MS = 40
const PROGRESS_TICKS = PROGRESS_MS / PROGRESS_TICK_MS
const PROGRESS_HOLD_MS = 150
const REVEAL_MS = 750
const EXIT_MS = 500

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * The prompt mark from the main logo, without the wordmark. The original
 * 320×48 viewBox is sized for the full lockup; using it here made the mark
 * microscopic inside the preloader tiles.
 */
function PreloaderMark({ size = 20 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 48"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2" y="6" width="36" height="36" />
      <g strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13.8 16.7 22 24 13.8 31.3" />
        <path d="M23 31.3h7.5" />
      </g>
    </svg>
  )
}

/**
 * Preloader — cinematic black-and-white entry animation.
 *
 * Stages:
 *  1. Boot terminal screen
 *  2. Deterministic progress with a human-readable percentage
 *  3. Full-screen wordmark reveal
 *  4. Fade out and hand off to the app
 *
 * The intro is short, skippable, and collapses to an immediate hand-off when
 * the visitor prefers reduced motion. While it is visible, the app behind it
 * is inert and page scrolling is locked.
 */
export default function Preloader({ onFinish }) {
  const [reducedMotion] = useState(prefersReducedMotion)
  const [stage, setStage] = useState(() => (reducedMotion ? 'done' : 'boot'))
  const [progress, setProgress] = useState(0)

  const finishCallbackRef = useRef(onFinish)
  const finishedRef = useRef(false)
  const exitTimerRef = useRef(null)
  const timelineTimersRef = useRef([])
  const progressIntervalRef = useRef(null)

  useEffect(() => {
    finishCallbackRef.current = onFinish
  }, [onFinish])

  const clearTimeline = useCallback(() => {
    timelineTimersRef.current.forEach((timer) => clearTimeout(timer))
    timelineTimersRef.current = []

    if (progressIntervalRef.current !== null) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }, [])

  const schedule = useCallback((callback, delay) => {
    const timer = setTimeout(callback, delay)
    timelineTimersRef.current.push(timer)
    return timer
  }, [])

  const finish = useCallback(
    (exitDelay = EXIT_MS) => {
      if (finishedRef.current) return
      finishedRef.current = true
      clearTimeline()
      setStage('done')
      exitTimerRef.current = setTimeout(() => {
        if (typeof finishCallbackRef.current === 'function') {
          finishCallbackRef.current()
        }
      }, exitDelay)
    },
    [clearTimeline]
  )

  useEffect(() => {
    if (reducedMotion) {
      // No animation, no forced wait. Give React one paint so the initial
      // render does not flash the overlay.
      const timer = setTimeout(() => {
        if (typeof finishCallbackRef.current === 'function') {
          finishCallbackRef.current()
        }
      }, 0)
      return () => clearTimeout(timer)
    }

    schedule(() => {
      setStage('progress')

      let tick = 0
      progressIntervalRef.current = setInterval(() => {
        tick += 1
        setProgress(Math.min(100, Math.round((tick / PROGRESS_TICKS) * 100)))

        if (tick >= PROGRESS_TICKS) {
          clearInterval(progressIntervalRef.current)
          progressIntervalRef.current = null
        }
      }, PROGRESS_TICK_MS)
    }, BOOT_MS)

    schedule(
      () => {
        setProgress(100)
        setStage('reveal')
      },
      BOOT_MS + PROGRESS_MS + PROGRESS_HOLD_MS
    )

    schedule(() => finish(), BOOT_MS + PROGRESS_MS + PROGRESS_HOLD_MS + REVEAL_MS)

    return clearTimeline
  }, [clearTimeline, finish, reducedMotion, schedule])

  useEffect(() => {
    const onKeyDown = (event) => {
      // The app is mounted but inert behind the intro. Block its global
      // shortcuts too, otherwise "?" can open a modal that is waiting when
      // the intro ends.
      if (event.key === 'Escape') {
        event.preventDefault()
        finish()
      }

      if (event.key !== 'Tab') {
        event.stopImmediatePropagation()
      }
    }

    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [finish])

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('preloader-active')
    return () => root.classList.remove('preloader-active')
  }, [])

  useEffect(
    () => () => {
      if (exitTimerRef.current !== null) {
        clearTimeout(exitTimerRef.current)
        exitTimerRef.current = null
      }
    },
    []
  )

  const isDone = stage === 'done'
  const showBootCard = stage === 'boot' || stage === 'progress' || (isDone && progress < 100)
  const showReveal = stage === 'reveal' || (isDone && progress === 100)

  return (
    <div
      className={`fixed inset-y-0 left-0 z-[9999] flex w-screen flex-col items-center justify-center overflow-hidden bg-black text-white transition-opacity duration-500 ${
        isDone ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100'
      }`}
      aria-busy={!isDone}
      aria-hidden={isDone}
    >
      <p className="sr-only" role="status" aria-live="polite">
        {stage === 'boot'
          ? 'Loading Open Agents'
          : stage === 'progress'
            ? 'Preparing the agent catalogue'
            : 'Open Agents ready'}
      </p>

      {/* Scanline overlay for the "boot" feel */}
      <div
        className="scanline pointer-events-none absolute inset-0 z-0 bg-[size:100%_4px]"
        aria-hidden="true"
      />

      {/* Stage 1 + 2: boot terminal + progress */}
      {showBootCard && (
        <div className="preloader-card relative z-10 w-full max-w-md px-6">
          <div className="rounded-sm border border-white/20 bg-black p-6 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-white">
                <PreloaderMark size={20} />
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-white">
                Open<span className="font-bold">Agents</span>
              </span>
            </div>

            <div
              className="mb-3 h-1 w-full overflow-hidden rounded-full bg-white/10"
              role="progressbar"
              aria-label="Loading Open Agents"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div
                className="h-full rounded-full bg-white transition-[width] duration-[40ms] ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-white/60">
              <span>{stage === 'boot' ? 'boot sequence' : 'agent index'}</span>
              <span className="tabular-nums">{progress}%</span>
            </div>

            <div className="font-mono text-[11px] uppercase tracking-widest text-white/50">
              {stage === 'boot'
                ? 'initializing runtime…'
                : progress === 100
                  ? 'agent index ready'
                  : 'loading agent index…'}
            </div>
          </div>
        </div>
      )}

      {/* Stage 3: full-screen B&W reveal */}
      <div
        className={`preloader-reveal absolute inset-0 z-20 flex items-center justify-center bg-black ${
          showReveal ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={stage !== 'reveal'}
      >
        <div
          className={`px-4 text-center transition-all duration-300 ${
            showReveal ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
        >
          <div className="relative mb-6 inline-block">
            <div className="absolute -inset-0.5 rounded-sm bg-white opacity-20 blur motion-reduce:hidden" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-sm border border-white">
              <PreloaderMark size={48} />
            </div>
          </div>
          <div className="text-5xl font-black tracking-tighter text-white sm:text-6xl">
            OpenAgents
          </div>
          <p className="mt-3 text-balance font-mono text-[10px] uppercase tracking-[0.16em] text-white/50 sm:text-xs sm:tracking-[0.3em]">
            build · deploy · scale ai agent workflows
          </p>
        </div>
      </div>

      {!isDone && (
        <button
          type="button"
          onClick={() => finish()}
          className="absolute bottom-5 right-5 z-30 inline-flex min-h-[44px] items-center border border-white/40 bg-black px-4 font-mono text-[11px] uppercase tracking-widest text-white/70 transition-colors hover:border-white hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          style={{
            bottom: 'max(1.25rem, env(safe-area-inset-bottom))',
            right: 'max(1.25rem, env(safe-area-inset-right))',
          }}
        >
          Skip intro
        </button>
      )}
    </div>
  )
}
