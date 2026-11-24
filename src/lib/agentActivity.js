export const ACTIVITY_EVENT = 'oa_activity_update'

const KEYS = {
  manual: 'OpenAgents_history',
  automation: 'oa_automation_runs_v2',
  scheduler: 'oa_scheduler_results',
  automations: 'oa_automations_v2',
  jobs: 'oa_scheduled_jobs',
}

function identifier(value) {
  return typeof value === 'string' && value.length > 0
    ? value
    : typeof value === 'number' && Number.isFinite(value)
      ? String(value)
      : null
}

function agentsByDefinition(definitions) {
  const agents = new Map()
  for (const entry of definitions) {
    const id = identifier(entry.id)
    const agent = identifier(entry.agentId)
    if (!id || !agent) continue
    agents.set(id, agents.has(id) && agents.get(id) !== agent ? null : agent)
  }
  return agents
}

function agentFor(record, agents, foreignKey) {
  const explicit = identifier(record.agentId)
  if (explicit) return explicit
  const foreign = identifier(record[foreignKey])
  if (!foreign) return null
  return agents.get(foreign) ?? null
}

/** Read retained histories without seeding, migrating, copying, or deleting records. */
export function readAgentActivity(agentId) {
  const unavailable = []
  function read(source) {
    try {
      const raw = localStorage.getItem(KEYS[source])
      if (raw === null) return []
      const value = JSON.parse(raw)
      if (!Array.isArray(value)) throw new Error('Invalid history')
      return value.filter((row) => row && typeof row === 'object' && !Array.isArray(row))
    } catch {
      unavailable.push(source)
      return []
    }
  }
  const manual = read('manual')
  const automation = read('automation')
  const scheduler = read('scheduler')
  const automations = agentsByDefinition(read('automations'))
  const jobs = agentsByDefinition(read('jobs'))
  const target = identifier(agentId)
  if (!target) return { runs: [], unavailable }
  const runs = new Map()
  for (const [source, records] of Object.entries({ manual, automation, scheduler })) {
    for (const record of records) {
      const id = identifier(record.id)
      const owner =
        source === 'manual'
          ? identifier(record.agentId)
          : agentFor(
              record,
              source === 'automation' ? automations : jobs,
              source === 'automation' ? 'automationId' : 'jobId'
            )
      if (!id || owner !== target) continue
      const key = `${source}:${id}`
      if (runs.has(key)) continue
      const at =
        source === 'manual'
          ? record.timestamp
          : source === 'automation'
            ? record.startedAt
            : record.ranAt
      const scheduled =
        typeof record.scheduledFor === 'number' &&
        Number.isFinite(record.scheduledFor) &&
        record.scheduledFor > 0
      const trigger =
        source === 'manual'
          ? 'manual'
          : ['manual', 'scheduled'].includes(record.trigger)
            ? record.trigger
            : scheduled
              ? 'scheduled'
              : 'unknown'
      runs.set(key, {
        key,
        id,
        source,
        trigger,
        timestamp:
          typeof at === 'number' && at > 0 && Number.isFinite(new Date(at).getTime()) ? at : null,
        status: ['running', 'success', 'failed', 'missed', 'skipped'].includes(record.status)
          ? record.status
          : record.error
            ? 'failed'
            : source === 'automation'
              ? 'unknown'
              : 'success',
        output: typeof record.output === 'string' ? record.output : '',
        error: typeof record.error === 'string' ? record.error : '',
      })
    }
  }
  return {
    runs: [...runs.values()].sort(
      (a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0) || a.key.localeCompare(b.key)
    ),
    unavailable,
  }
}
