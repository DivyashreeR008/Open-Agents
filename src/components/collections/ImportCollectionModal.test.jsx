import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ImportCollectionModal from './ImportCollectionModal'

const agents = [
  { id: 'agent-a', name: 'Alpha Agent' },
  { id: 'agent-b', name: 'Beta Agent' },
]

function makeFile({ text = '', size = 100, name = 'collection.json' } = {}) {
  return {
    name,
    size,
    text: vi.fn().mockResolvedValue(text),
  }
}

function exportText(agentIds = ['agent-a', 'missing-agent'], name = 'Launch plan') {
  return JSON.stringify({
    format: 'open-agents.collection',
    version: 1,
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

function upload(container, file) {
  const input = container.querySelector('input[type="file"]')
  fireEvent.change(input, { target: { files: [file] } })
}

describe('ImportCollectionModal', () => {
  it('renders a labelled dialog and a JSON file input', () => {
    const { container } = renderModal()

    expect(screen.getByRole('dialog', { name: 'Import Collection' })).toBeInTheDocument()
    const input = container.querySelector('input[type="file"]')
    expect(input).toHaveAttribute('accept', 'application/json,.json')
    expect(screen.getByLabelText('Collection file')).toBe(input)
  })

  it('requires a file before submitting', () => {
    const onImport = vi.fn()
    renderModal({ onImport })

    fireEvent.click(screen.getByRole('button', { name: 'Import' }))

    expect(screen.getByText('Choose a collection file first.')).toBeInTheDocument()
    expect(onImport).not.toHaveBeenCalled()
  })

  it('rejects an oversized file without reading it', async () => {
    const { container } = renderModal()
    const file = makeFile({ size: 64 * 1024 + 1 })

    upload(container, file)

    expect(
      await screen.findByText('The file is too large to be a collection export.')
    ).toBeInTheDocument()
    expect(file.text).not.toHaveBeenCalled()
  })

  it('refuses a valid file while the agent catalogue is empty', async () => {
    const { container } = renderModal({ agents: [] })

    upload(container, makeFile({ text: exportText() }))

    expect(
      await screen.findByText('Agents are still loading. Try again in a moment.')
    ).toBeInTheDocument()
  })

  it('reports a file that cannot be read', async () => {
    const { container } = renderModal()
    const file = makeFile()
    file.text.mockRejectedValueOnce(new Error('read failed'))

    upload(container, file)

    expect(await screen.findByText('Could not read that file.')).toBeInTheDocument()
  })

  it('surfaces parser errors for invalid JSON and invalid metadata', async () => {
    const { container } = renderModal()

    upload(container, makeFile({ text: '{' }))
    expect(await screen.findByText('The file is not valid JSON.')).toBeInTheDocument()

    upload(
      container,
      makeFile({
        text: JSON.stringify({ format: 'another-app', version: 1, collection: { name: 'x' } }),
      })
    )
    expect(
      await screen.findByText('This is not an Open Agents collection file.')
    ).toBeInTheDocument()
  })

  it('previews known agents and reports skipped ids', async () => {
    const { container } = renderModal()

    upload(container, makeFile({ text: exportText(['agent-a', 'missing-agent', 'agent-a']) }))

    expect(await screen.findByText('Launch plan')).toBeInTheDocument()
    expect(screen.getByText('1 agent will be added')).toBeInTheDocument()
    expect(screen.getByText('Alpha Agent')).toBeInTheDocument()
    expect(
      screen.getByText(/1 agent is not in this catalogue and will be skipped/)
    ).toBeInTheDocument()
  })

  it('imports the parsed preview through the supplied handler', async () => {
    const onImport = vi.fn(() => ({ ok: true }))
    const { container } = renderModal({ onImport })
    upload(container, makeFile({ text: exportText() }))
    expect(await screen.findByText('Launch plan')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Import' }))

    expect(onImport).toHaveBeenCalledTimes(1)
    expect(onImport).toHaveBeenCalledWith({
      ok: true,
      name: 'Launch plan',
      agentIds: ['agent-a'],
      skippedAgentIds: ['missing-agent'],
    })
  })

  it('keeps the parsed preview when the import handler rejects it', async () => {
    const onImport = vi.fn(() => ({ ok: false, error: 'The collection is already full.' }))
    const { container } = renderModal({ onImport })
    upload(container, makeFile({ text: exportText() }))
    expect(await screen.findByText('Launch plan')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Import' }))

    expect(screen.getByText('The collection is already full.')).toBeInTheDocument()
    expect(screen.getByText('Launch plan')).toBeInTheDocument()
  })

  it('closes through the dialog control', () => {
    const onClose = vi.fn()
    renderModal({ onClose })

    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('describes an empty collection in the preview', async () => {
    const { container } = renderModal()
    upload(container, makeFile({ text: exportText([]) }))

    expect(await screen.findByText('0 agents will be added')).toBeInTheDocument()
  })
})
