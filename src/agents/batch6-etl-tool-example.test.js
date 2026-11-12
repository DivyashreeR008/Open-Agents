import { describe, expect, it } from 'vitest'
import agent from './definitions/etl-pipeline-troubleshooter'

describe('ETL troubleshooter example tool', () => {
  it('uses the full option value for the example tool', () => {
    const tool = agent.inputs.find((input) => input.id === 'tool')
    expect(tool.options).toContain(agent.exampleInputs.tool)
  })
})
