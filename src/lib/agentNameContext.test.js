import { describe, expect, it } from 'vitest'
import { buildAgentNameContext } from './agentNameContext'
import pipeline from '../agents/definitions/content-repurposing-pipeline'
import planner from '../agents/definitions/content-repurposing-planner'

const agent = (id, name, inputs = []) => ({ id, name, inputs })
describe('advisory name context', () => {
  it('distinguishes the actual repurposing pair using existing inputs without changing definitions', () => {
    const before = JSON.stringify([pipeline, planner])
    const map = buildAgentNameContext([pipeline, planner])
    expect(map.get(pipeline.id).matches).toEqual([{ id: planner.id, name: planner.name }])
    expect(map.get(pipeline.id).inputContext).toContain('Target platforms (text)')
    expect(map.get(pipeline.id).inputContext).toContain('Brand tone (text)')
    expect(map.get(pipeline.id).inputContext).not.toContain('Source content')
    expect(map.get(planner.id).inputContext).toContain('Target formats (select)')
    expect(map.get(planner.id).inputContext).toContain('Voice notes (optional) (text)')
    expect(JSON.stringify([pipeline, planner])).toBe(before)
  })
  it('does not match generic single words or unrelated agents', () => {
    expect(
      buildAgentNameContext([
        agent('a', 'AI Code Reviewer'),
        agent('b', 'AI Budget Planner'),
        agent('c', 'Code Assistant'),
      ]).size
    ).toBe(0)
    expect(buildAgentNameContext(null).size).toBe(0)
    expect(buildAgentNameContext([null, {}, agent('', 'Bad'), agent('id', '')]).size).toBe(0)
  })
  it('handles exact, reordered, Unicode and simple plural names deterministically', () => {
    const list = [
      agent('a', 'Ｗｅｅｋｌｙ Report Planner'),
      agent('b', 'Weekly Reports Planner'),
      agent('c', 'Report Weekly Planner'),
      agent('d', 'Weekly Report Planner Agent'),
    ]
    const forward = Object.fromEntries(buildAgentNameContext(list))
    expect(forward).toEqual(Object.fromEntries(buildAgentNameContext([...list].reverse())))
    expect(forward.a.matches).toHaveLength(3)
    expect(forward.a.inputContext).toBe('Input metadata unavailable')
    expect(
      buildAgentNameContext([agent('x', 'AI Assistant'), agent('y', 'AI Assistant')]).size
    ).toBe(2)
    expect(
      buildAgentNameContext([
        agent('x', 'Analysis Focus Access'),
        agent('y', 'Analysis Focus Access Agent'),
      ]).size
    ).toBe(2)
  })
  it('retains distinct IDs, ignores duplicate ID rows, and falls back to shared input metadata', () => {
    const input = { id: 'topic', label: 'Topic', type: 'text' }
    const map = buildAgentNameContext([
      agent('a', 'Topic Writer', [input]),
      agent('b', 'Topic Writer', [input]),
      agent('a', 'Ignored Duplicate'),
    ])
    expect(map.size).toBe(2)
    expect(map.get('a').inputContext).toBe('Inputs: Topic (text)')
    expect(map.get('a').matches[0].id).toBe('b')
  })
  it('bounds visible fields and safely skips malformed input metadata', () => {
    const inputs = [
      null,
      {},
      ...Array.from({ length: 5 }, (_, i) => ({ id: String(i), label: `Field ${i}` })),
    ]
    const map = buildAgentNameContext([
      agent('a', 'Shared Test Name', inputs),
      agent('b', 'Shared Test Name Agent', 'invalid'),
    ])
    expect(map.get('a').inputContext).toBe('Distinct fields: Field 0 · Field 1 · Field 2 · +2 more')
    expect(map.get('b').inputContext).toBe('Input metadata unavailable')
  })
})

it('keeps a large one-word-overlap catalogue ungrouped without hiding a real pair', () => {
  const catalogue = Array.from({ length: 2000 }, (_, i) => ({
    id: `catalogue-${i}`,
    name: `Catalogue Agent ${i}`,
    inputs: [],
  }))
  const result = buildAgentNameContext([...catalogue, pipeline, planner])
  expect([...result.keys()].sort()).toEqual([pipeline.id, planner.id].sort())
})
