import { describe, expect, it } from 'vitest'
import {
  DEFAULT_MISSED_POLICY,
  MAX_CATCH_UP_RUNS,
  MISSED_RUN_POLICIES,
  ON_TIME_GRACE_MS,
  describeUnexecutedRun,
  dueWindows,
  isUnexecutedRun,
  normalizeMissedPolicy,
  planDueRuns,
  summarizeHistory,
} from './missedRuns'

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR
const NOW = Date.UTC(2026, 10, 3, 12, 0, 0)

describe('dueWindows', () => {
  it('has nothing due before the first window', () => {
    expect(dueWindows({ nextRunAt: NOW + 1, intervalMs: DAY, now: NOW })).toBeNull()
  })

  it('has one on-time window when the app was open', () => {
    expect(dueWindows({ nextRunAt: NOW - 30_000, intervalMs: DAY, now: NOW })).toEqual({
      count: 1, first: NOW - 30_000, last: NOW - 30_000, lastOnTime: true, intervalMs: DAY,
    })
  })

  it('counts a window that is due exactly now', () => {
    const due = dueWindows({ nextRunAt: NOW, intervalMs: DAY, now: NOW })
    expect(due).toMatchObject({ count: 1, lastOnTime: true })
  })

  it('counts every window that passed while the app was closed', () => {
    // daily, first window 3.5 days ago: windows at -3.5d, -2.5d, -1.5d and -0.5d
    const due = dueWindows({ nextRunAt: NOW - 3.5 * DAY, intervalMs: DAY, now: NOW })
    expect(due).toMatchObject({ count: 4, first: NOW - 3.5 * DAY, last: NOW - 0.5 * DAY, lastOnTime: false })
  })

  it('treats a newest window within the grace period as on time', () => {
    const due = dueWindows({ nextRunAt: NOW - DAY - ON_TIME_GRACE_MS, intervalMs: DAY, now: NOW })
    expect(due).toMatchObject({ count: 2, lastOnTime: true })
    const late = dueWindows({ nextRunAt: NOW - DAY - ON_TIME_GRACE_MS - 1, intervalMs: DAY, now: NOW })
    expect(late).toMatchObject({ count: 2, lastOnTime: false })
  })

  it('plans a year of hourly windows with arithmetic, not a loop', () => {
    const due = dueWindows({ nextRunAt: NOW - 365 * DAY, intervalMs: HOUR, now: NOW })
    expect(due.count).toBe(365 * 24 + 1)
    expect(due.last).toBe(NOW)
  })

  it.each([
    ['no next run time', { nextRunAt: undefined }],
    ['a null next run time', { nextRunAt: null }],
    ['a NaN next run time', { nextRunAt: NaN }],
    ['a zero interval', { intervalMs: 0 }],
    ['a negative interval', { intervalMs: -HOUR }],
    ['an unknown interval', { intervalMs: undefined }],
  ])('returns null for %s', (_label, override) => {
    expect(dueWindows({ nextRunAt: NOW - DAY, intervalMs: DAY, now: NOW, ...override })).toBeNull()
  })
})

describe('planDueRuns', () => {
  const lateDue = dueWindows({ nextRunAt: NOW - 3.5 * DAY, intervalMs: DAY, now: NOW }) // 4 windows, newest late
  const onTimeDue = dueWindows({ nextRunAt: NOW - 2 * DAY - 30_000, intervalMs: DAY, now: NOW }) // 3 windows, newest on time
  const single = dueWindows({ nextRunAt: NOW - 30_000, intervalMs: DAY, now: NOW })

  it('does nothing when nothing is due', () => {
    expect(planDueRuns(null, 'catch_up')).toEqual({ runWindows: [], missed: null })
  })

  it('does not call a normal on-time run missed, whatever the policy', () => {
    for (const { value } of MISSED_RUN_POLICIES) {
      expect(planDueRuns(single, value)).toEqual({ runWindows: [single.last], missed: null })
    }
  })

  describe('run_once', () => {
    it('runs the newest window once and records the rest as missed', () => {
      const plan = planDueRuns(lateDue, 'run_once')
      expect(plan.runWindows).toEqual([NOW - 0.5 * DAY])
      expect(plan.missed).toEqual({ count: 3, first: NOW - 3.5 * DAY, last: NOW - 1.5 * DAY })
    })

    it('runs the on-time window as the one run', () => {
      const plan = planDueRuns(onTimeDue, 'run_once')
      expect(plan.runWindows).toEqual([onTimeDue.last])
      expect(plan.missed).toEqual({ count: 2, first: onTimeDue.first, last: onTimeDue.first + DAY })
    })
  })

  describe('catch_up', () => {
    it('runs the most recent windows, oldest first, up to the limit', () => {
      const plan = planDueRuns(lateDue, 'catch_up')
      expect(plan.runWindows).toEqual([NOW - 2.5 * DAY, NOW - 1.5 * DAY, NOW - 0.5 * DAY])
      expect(plan.runWindows).toHaveLength(MAX_CATCH_UP_RUNS)
      expect(plan.missed).toEqual({ count: 1, first: NOW - 3.5 * DAY, last: NOW - 3.5 * DAY })
    })

    it('never runs more windows than were due', () => {
      const two = dueWindows({ nextRunAt: NOW - 1.5 * DAY, intervalMs: DAY, now: NOW })
      const plan = planDueRuns(two, 'catch_up')
      expect(plan.runWindows).toHaveLength(2)
      expect(plan.missed).toBeNull()
    })

    it('honours a smaller limit, and always allows at least one run', () => {
      expect(planDueRuns(lateDue, 'catch_up', { maxCatchUp: 2 }).runWindows).toHaveLength(2)
      expect(planDueRuns(lateDue, 'catch_up', { maxCatchUp: 0 }).runWindows).toHaveLength(1)
    })

    it('stays bounded however long the app was closed', () => {
      const year = dueWindows({ nextRunAt: NOW - 365 * DAY, intervalMs: HOUR, now: NOW })
      const plan = planDueRuns(year, 'catch_up')
      expect(plan.runWindows).toHaveLength(MAX_CATCH_UP_RUNS)
      expect(plan.missed.count).toBe(year.count - MAX_CATCH_UP_RUNS)
    })
  })

  describe('skip', () => {
    it('runs nothing and records every window as missed when the newest is late', () => {
      const plan = planDueRuns(lateDue, 'skip')
      expect(plan.runWindows).toEqual([])
      expect(plan.missed).toEqual({ count: 4, first: lateDue.first, last: lateDue.last })
    })

    it('still runs a window that is on time', () => {
      const plan = planDueRuns(onTimeDue, 'skip')
      expect(plan.runWindows).toEqual([onTimeDue.last])
      expect(plan.missed).toEqual({ count: 2, first: onTimeDue.first, last: onTimeDue.first + DAY })
    })
  })

  it('accounts for every window exactly once', () => {
    for (const { value } of MISSED_RUN_POLICIES) {
      for (const due of [single, lateDue, onTimeDue]) {
        const { runWindows, missed } = planDueRuns(due, value)
        expect(runWindows.length + (missed ? missed.count : 0)).toBe(due.count)
      }
    }
  })

  it('falls back to the old behaviour for an unknown or missing policy', () => {
    expect(planDueRuns(lateDue, undefined)).toEqual(planDueRuns(lateDue, 'run_once'))
    expect(planDueRuns(lateDue, 'nonsense')).toEqual(planDueRuns(lateDue, 'run_once'))
  })
})

describe('normalizeMissedPolicy', () => {
  it('keeps known policies and defaults the rest', () => {
    expect(DEFAULT_MISSED_POLICY).toBe('run_once')
    for (const { value } of MISSED_RUN_POLICIES) expect(normalizeMissedPolicy(value)).toBe(value)
    for (const bad of [undefined, null, '', 'always', 3]) expect(normalizeMissedPolicy(bad)).toBe('run_once')
  })
})

describe('history helpers', () => {
  const runs = [
    { status: 'success' },
    { status: 'failed' },
    { status: 'running' },
    { status: 'missed', missedCount: 3 },
    { status: 'missed' },
    { status: 'skipped', skippedCount: 2 },
  ]

  it('tells executed runs from missed and skipped ones', () => {
    expect(runs.map(isUnexecutedRun)).toEqual([false, false, false, true, true, true])
    expect(isUnexecutedRun(undefined)).toBe(false)
  })

  it('describes a missed range in plain words', () => {
    const { title, detail } = describeUnexecutedRun({
      status: 'missed', missedCount: 3, firstWindow: NOW - 3 * DAY, lastWindow: NOW - DAY, policy: 'run_once',
    })
    expect(title).toBe('3 runs missed')
    expect(detail).toContain('while the app was not running')
    expect(detail).toContain(' to ')
    expect(detail).toContain('Run once when I come back')
  })

  it('uses the singular and a single time for one missed window', () => {
    const { title, detail } = describeUnexecutedRun({ status: 'missed', missedCount: 1, firstWindow: NOW, lastWindow: NOW })
    expect(title).toBe('1 run missed')
    expect(detail).not.toContain(' to ')
    expect(detail).toContain('it was not run')
  })

  it('says why runs were skipped', () => {
    const noKey = describeUnexecutedRun({ status: 'skipped', skippedCount: 2, startedAt: NOW, reason: 'no_key' })
    expect(noKey.title).toBe('2 runs skipped')
    expect(noKey.detail).toContain('no API key')
    expect(describeUnexecutedRun({ status: 'skipped', startedAt: NOW }).detail).toContain('could not start')
  })

  it('summarises what ran, what was skipped and what was missed', () => {
    expect(summarizeHistory(runs)).toEqual({ ran: 3, skipped: 2, missed: 4 })
    expect(summarizeHistory(undefined)).toEqual({ ran: 0, skipped: 0, missed: 0 })
  })
})
