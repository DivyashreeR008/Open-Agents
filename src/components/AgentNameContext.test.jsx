import CollectionAgentPicker from './collections/CollectionAgentPicker'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { expectNoA11yViolations } from '../test/a11y'
import AgentNameContext from './AgentNameContext'
import { buildAgentNameContext } from '../lib/agentNameContext'
import pipeline from '../agents/definitions/content-repurposing-pipeline'
import planner from '../agents/definitions/content-repurposing-planner'

describe('similar name comparison context', () => {
  it('renders safe real metadata with explicit uncertainty and no extra interactive targets', async () => {
    const context = buildAgentNameContext([pipeline, planner]).get(pipeline.id)
    const { container } = render(<AgentNameContext context={context} />)
    expect(screen.getByText(`Agent ID: ${pipeline.id}`)).toBeInTheDocument()
    expect(screen.getByText(/Target platforms/)).toBeInTheDocument()
    expect(
      screen.getByText(/Content Repurposing Planner \[content-repurposing-planner\]/)
    ).toBeInTheDocument()
    expect(screen.getByText(/not a duplicate or workflow-stage classification/)).toBeInTheDocument()
    expect(container.querySelector('button,a,input')).toBeNull()
    await expectNoA11yViolations(container)
  })
  it('limits compact peers and renders untrusted text as text', () => {
    const context = {
      id: '<img src=x>',
      inputContext: '<script>bad</script>',
      matches: Array.from({ length: 4 }, (_, i) => ({ name: `Peer ${i}`, id: String(i) })),
    }
    const { container, rerender } = render(<AgentNameContext context={context} compact />)
    expect(container.querySelector('img,script')).toBeNull()
    expect(screen.getByText(/Peer 0.*\+3 more/)).toBeInTheDocument()
    rerender(<AgentNameContext context={context} />)
    expect(screen.getByText(/Peer 2.*\+1 more/)).toBeInTheDocument()
    rerender(<AgentNameContext />)
    expect(container).toBeEmptyDOMElement()
  })
})

it('keeps collection selection bound to the original ID when titles overlap', async () => {
  const onAdd = vi.fn()
  const { container } = render(
    <CollectionAgentPicker
      collection={{ id: 'qa', agentIds: [] }}
      agents={[pipeline, planner]}
      onAddAgent={onAdd}
      onRemoveAgent={vi.fn()}
    />
  )
  fireEvent.click(
    screen.getByRole('checkbox', { name: /Content Repurposing Planner.*Target formats/ })
  )
  expect(onAdd).toHaveBeenCalledWith(planner.id)
  expect(onAdd).not.toHaveBeenCalledWith(pipeline.id)
  await expectNoA11yViolations(container)
})
