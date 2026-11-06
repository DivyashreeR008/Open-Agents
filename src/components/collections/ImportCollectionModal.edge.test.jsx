import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import ImportCollectionModal from './ImportCollectionModal'

const agents = [{ id: 'agent-a', name: 'Alpha Agent' }, { id: 'agent-c' }]

function makeFile({ text = '', size = 100, name = 'collection.json' } = {}) {
  return {
    name,
    size,
    text: vi.fn().mockResolvedValue(text),
  }
}

function exportText(agentIds = ['agent-a'], name = 'Launch plan', version = 1) {
  return JSON.stringify({
    format: 'open-agents.collection',
    version,
    collection: { name, agentIds },
  })
}

function renderModal(overrides = {}) {
  return render(
    <ImportCollectionModal
      agents={agents}
      onImport={vi.fn(() => ({ ok: true }))}
      onClose={vi.fn()}
      {...overrides}
    />
  )
}

function fileInput(container) {
  return container.querySelector('input[type="file"]')
}

function upload(container, file) {
  fireEvent.change(fileInput(container), { target: { files: [file] } })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ImportCollectionModal malformed and empty file selections', () => {
  it('drops a pending preview when the file picker is cleared', async () => {
    const { container } = renderModal()

    upload(container, makeFile({ text: exportText() }))
    expect(await screen.findByText('Launch plan')).toBeInTheDocument()

    fireEvent.change(fileInput(container), { target: { files: [] } })

    expect(screen.queryByText('Launch plan')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Collection file')).toBe(fileInput(container))
  })

  it('rejects an export written with an unsupported version', async () => {
    const { container } = renderModal()

    upload(container, makeFile({ text: exportText(['agent-a'], 'Launch plan', 2) }))

    expect(await screen.findByText('Unsupported collection file version: 2.')).toBeInTheDocument()
    expect(screen.queryByText('Launch plan')).not.toBeInTheDocument()
  })

  it('uses the raw id for a nameless agent and pluralizes several skipped ids', async () => {
    const { container } = renderModal()

    upload(container, makeFile({ text: exportText(['agent-c', 'missing-one', 'missing-two']) }))

    expect(await screen.findByText('Launch plan')).toBeInTheDocument()
    expect(screen.getByText('1 agent will be added')).toBeInTheDocument()
    expect(screen.getByText('agent-c')).toBeInTheDocument()
    expect(
      screen.getByText('2 agents are not in this catalogue and will be skipped.')
    ).toBeInTheDocument()
  })
})
