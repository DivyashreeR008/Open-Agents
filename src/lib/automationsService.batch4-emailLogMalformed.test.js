import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { getEmailLogs } from './automationsService'

describe('automation email log malformed store', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('returns an empty list for corrupt email log JSON', () => {
    localStorage.setItem('oa_automation_email_logs_v2', '{broken')
    expect(getEmailLogs()).toEqual([])
  })
})
