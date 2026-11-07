import { describe, expect, it } from 'vitest'
import { supabase } from './supabase'

describe('supabase noop write chain', () => {
  it('keeps insert, update, and gte chained without touching a real backend', async () => {
    const inserted = await supabase
      .from('scheduled_jobs')
      .insert({ id: 'job-1', enabled: true })
      .select('*')
      .gte('created_at', '2026-01-01')
      .order('created_at', { ascending: false })

    const updated = await supabase
      .from('scheduled_jobs')
      .update({ enabled: false })
      .eq('id', 'job-1')
      .select('*')

    expect(inserted).toEqual({ data: [], error: null })
    expect(updated).toEqual({ data: [], error: null })
  })

  it('returns a null single row after an insert when the client is not configured', async () => {
    const result = await supabase
      .from('scheduled_jobs')
      .insert({ label: 'Nightly review' })
      .single()

    expect(result).toEqual({ data: null, error: null })
  })
})
