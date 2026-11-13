import { isConditionalStep } from './pipelineBranching'

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function branchLabels(step) {
  if (!step?.branches || typeof step.branches !== 'object' || Array.isArray(step.branches)) {
    return []
  }
  return Object.keys(step.branches)
}

/**
 * Describe one workflow chain entry without assuming it is a plain agent id.
 * Conditional objects are intentionally never coerced to strings: rendering
 * String(object) would put "[object Object]" on the page and using the object
 * as a React key would warn or merge unrelated steps.
 */
export function getWorkflowStepInfo(entry, index = 0) {
  if (nonEmptyString(entry)) {
    return {
      kind: 'agent',
      agentId: entry.trim(),
      key: `agent-${entry.trim()}-${index}`,
    }
  }

  if (isConditionalStep(entry)) {
    const condition = nonEmptyString(entry.condition)
    const labels = branchLabels(entry)
    return {
      kind: 'conditional',
      step: entry,
      condition,
      labels,
      key: `conditional-${nonEmptyString(entry.id) ?? condition ?? 'step'}-${index}`,
      label: 'Conditional',
    }
  }

  if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
    const agentId = nonEmptyString(entry.agentId) ?? nonEmptyString(entry.id)
    if (agentId) {
      return {
        kind: 'agent',
        agentId,
        key: `agent-${agentId}-${index}`,
      }
    }
  }

  return {
    kind: 'malformed',
    key: `invalid-step-${index}`,
    label: 'Unavailable step',
  }
}

export function getWorkflowSteps(entries) {
  return Array.isArray(entries)
    ? entries.map((entry, index) => getWorkflowStepInfo(entry, index))
    : []
}

export function getWorkflowStepSummary(entries) {
  const steps = getWorkflowSteps(entries)
  const conditionalCount = steps.filter((step) => step.kind === 'conditional').length
  const malformedCount = steps.filter((step) => step.kind === 'malformed').length
  const label =
    conditionalCount > 0
      ? `${steps.length} step${steps.length === 1 ? '' : 's'}`
      : `${steps.length} agent${steps.length === 1 ? '' : 's'}`
  return { steps, conditionalCount, malformedCount, label }
}

export function getWorkflowStepSearchText(entry, agents) {
  const info = getWorkflowStepInfo(entry)
  if (info.kind === 'agent') {
    const agent = agents?.find((item) => item.id === info.agentId)
    return [info.agentId, agent?.name, agent?.category].filter(Boolean).join(' ')
  }
  if (info.kind === 'conditional') {
    const branchAgentText = Object.values(info.step.branches ?? {})
      .flatMap((value) => (Array.isArray(value) ? value : []))
      .flatMap((agentId) => {
        const agent = agents?.find((item) => item.id === agentId)
        return [agentId, agent?.name, agent?.category]
      })
      .filter(Boolean)
    return [info.step.id, info.condition, ...info.labels, ...branchAgentText]
      .filter(Boolean)
      .join(' ')
  }
  return ''
}
