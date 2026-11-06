// Working out which scheduled runs were missed, and what to do about them.
//
// An automation fires at `nextRunAt` and then every `intervalMs`. The engine only ticks while the
// app is open, so after the tab was closed or the machine slept, one or more of those windows can
// have passed with nothing run. These helpers are pure: they take times in, and say which windows
// are due and which of them to run, so the rules can be tested without a clock or a browser.

export const MISSED_RUN_POLICIES = [
  {
    value: 'run_once',
    label: 'Run once when I come back',
    description: 'Runs one time to catch up. The other missed runs are recorded, not run.',
  },
  {
    value: 'catch_up',
    label: 'Catch up (a few runs)',
    description: 'Runs the most recent missed runs, up to a limit. Older ones are recorded, not run.',
  },
  {
    value: 'skip',
    label: 'Skip missed runs',
    description: 'Does not run anything for the time the app was closed. Missed runs are recorded.',
  },
]

/** What every automation did before this setting existed: one run when the app is opened. */
export const DEFAULT_MISSED_POLICY = 'run_once'

/** The most runs a "catch up" policy will make in one go. Each run calls the model provider. */
export const MAX_CATCH_UP_RUNS = 3

/**
 * A window the engine sees within this long of its time counts as on time, not missed. The engine
 * ticks every minute, and runs for several automations are done one after another, so a window can
 * be a little late without the app ever having been closed.
 */
export const ON_TIME_GRACE_MS = 10 * 60 * 1000

export function normalizeMissedPolicy(value) {
  return MISSED_RUN_POLICIES.some(p => p.value === value) ? value : DEFAULT_MISSED_POLICY
}

/**
 * The windows that are due at `now`.
 *
 * Windows are `nextRunAt`, `nextRunAt + intervalMs`, and so on, up to `now`. Returns null when
 * nothing is due (or the schedule is unusable). Otherwise:
 *   count        how many windows are due
 *   first, last  times of the oldest and the newest due window
 *   lastOnTime   true when the newest window is within the grace period, so the app was running
 *
 * The count is worked out with arithmetic, so a schedule that was closed for a year is as cheap to
 * plan as one that was closed for a minute.
 */
export function dueWindows({ nextRunAt, intervalMs, now, graceMs = ON_TIME_GRACE_MS }) {
  if (!Number.isFinite(nextRunAt) || !Number.isFinite(now)) return null
  if (!Number.isFinite(intervalMs) || intervalMs <= 0) return null
  if (now < nextRunAt) return null

  const count = Math.floor((now - nextRunAt) / intervalMs) + 1
  const last = nextRunAt + (count - 1) * intervalMs
  return { count, first: nextRunAt, last, lastOnTime: now - last <= graceMs, intervalMs }
}

/**
 * Decides, for the due windows, how many to run and how many to record as missed.
 *
 * The windows that are run are always the most recent ones. The rest (the oldest) are not run:
 * they are the missed windows, and are reported as one range.
 *
 *   skip      runs only a window that is on time; everything else is missed
 *   run_once  runs the newest window (the normal run if it is on time, otherwise one catch-up run)
 *   catch_up  runs the newest windows, at most `maxCatchUp`
 *
 * Returns { runWindows: number[] (oldest first), missed: null | { count, first, last } }
 */
export function planDueRuns(due, policy, { maxCatchUp = MAX_CATCH_UP_RUNS } = {}) {
  if (!due) return { runWindows: [], missed: null }

  const { count, first, last, intervalMs, lastOnTime } = due
  const chosen = normalizeMissedPolicy(policy)

  let runCount
  if (chosen === 'skip') runCount = lastOnTime ? 1 : 0
  else if (chosen === 'catch_up') runCount = Math.min(count, Math.max(1, maxCatchUp))
  else runCount = 1

  const runWindows = []
  for (let i = runCount; i >= 1; i--) runWindows.push(last - (i - 1) * intervalMs)

  const missedCount = count - runCount
  const missed =
    missedCount > 0 ? { count: missedCount, first, last: first + (missedCount - 1) * intervalMs } : null

  return { runWindows, missed }
}

/** Whether a run record is a scheduled window that did not run. */
export function isUnexecutedRun(run) {
  return run?.status === 'missed' || run?.status === 'skipped'
}

function formatWindow(ts) {
  return new Date(ts).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

/**
 * Plain-language text for a missed or skipped record in the history.
 * Returns { title, detail }.
 */
export function describeUnexecutedRun(run) {
  const missed = run?.status === 'missed'
  const count = (missed ? run.missedCount : run?.skippedCount) || 1
  const noun = count === 1 ? 'run' : 'runs'
  const first = run?.firstWindow ?? run?.startedAt
  const last = run?.lastWindow ?? run?.startedAt
  const when = first === last ? formatWindow(first) : `${formatWindow(first)} to ${formatWindow(last)}`

  if (missed) {
    const setting = MISSED_RUN_POLICIES.find(p => p.value === run.policy)
    return {
      title: `${count} ${noun} missed`,
      detail:
        `Due ${when}, while the app was not running (closed, or the computer was asleep), so ` +
        `${count === 1 ? 'it was' : 'they were'} not run.` +
        (setting ? ` The missed-run setting was "${setting.label}".` : ''),
    }
  }
  return {
    title: `${count} ${noun} skipped`,
    detail:
      run?.reason === 'no_key'
        ? `Due ${when}, but no API key is stored for this automation, so the run could not start. Edit the automation and enter a key.`
        : `Due ${when}, but the run could not start.`,
  }
}

/** The history of an automation, split into what happened, what was skipped and what was missed. */
export function summarizeHistory(runs) {
  const summary = { ran: 0, skipped: 0, missed: 0 }
  for (const run of runs || []) {
    if (run.status === 'missed') summary.missed += run.missedCount || 1
    else if (run.status === 'skipped') summary.skipped += run.skippedCount || 1
    else summary.ran += 1
  }
  return summary
}
