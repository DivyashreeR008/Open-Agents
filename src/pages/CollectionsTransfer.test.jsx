import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CollectionsPage from './CollectionsPage'
import { useCollections, COLLECTIONS_STORAGE_KEY } from '../lib/useCollections'
import { serializeCollection } from '../lib/collectionTransfer'
import { expectNoA11yViolations } from '../test/a11y'
import { renderHook, act } from '@testing-library/react'

vi.mock('../lib/useAgents', () => {
  const agents = [
    { id: 'a1', name: 'Agent One' },
    { id: 'a2', name: 'Agent Two' },
  ]
  return { useAgents: () => ({ agents, loading: false, error: null }) }
})

function seed() {
  const { result } = renderHook(() => useCollections())
  act(() => {
    const id = result.current.createCollection('Reads').collection.id
    result.current.addAgentToCollection(id, 'a1')
  })
}

const names = () =>
  JSON.parse(localStorage.getItem(COLLECTIONS_STORAGE_KEY))
    .filter((c) => !c.isDefault)
    .map((c) => c.name)

function renderPage() {
  return render(
    <MemoryRouter>
      <CollectionsPage />
    </MemoryRouter>
  )
}

function chooseFile(text, name = 'c.json') {
  const input = screen.getByLabelText('Collection file')
  const file = new File([text], name, { type: 'application/json' })
  fireEvent.change(input, { target: { files: [file] } })
}

describe('collections export, duplicate and import', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('duplicates a collection from its card', () => {
    seed()
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Duplicate Reads' }))
    expect(screen.getByRole('status')).toHaveTextContent('Reads (copy)')
    expect(names()).toEqual(['Reads (copy)', 'Reads'])
  })

  it('exports a collection as a json download', async () => {
    seed()
    let blobText = ''
    vi.stubGlobal(
      'Blob',
      class {
        constructor(parts) {
          blobText = parts.join('')
        }
      }
    )
    URL.createObjectURL = vi.fn(() => 'blob:x')
    URL.revokeObjectURL = vi.fn()
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Export Reads' }))

    expect(click).toHaveBeenCalled()
    expect(JSON.parse(blobText).collection).toEqual({ name: 'Reads', agentIds: ['a1'] })
    vi.unstubAllGlobals()
  })

  it('previews a valid file and imports it', async () => {
    const text = serializeCollection({ name: 'Shared set', agentIds: ['a1', 'a2', 'gone'] })
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Import' }))
    chooseFile(text)

    await waitFor(() => expect(screen.getByText('Shared set')).toBeInTheDocument())
    expect(screen.getByText('2 agents will be added')).toBeInTheDocument()
    expect(screen.getByText('Agent One')).toBeInTheDocument()
    expect(screen.getByText(/1 agent is not in this catalogue/)).toBeInTheDocument()
    await expectNoA11yViolations(screen.getByRole('dialog'))

    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Import' }))
    expect(names()).toEqual(['Shared set'])
    expect(JSON.parse(localStorage.getItem(COLLECTIONS_STORAGE_KEY)).find((c) => c.name === 'Shared set').agentIds).toEqual(['a1', 'a2'])
  })

  it('shows an error for a bad file and writes nothing', async () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Import' }))
    chooseFile('{"format":"open-agents.collection","version":9,"collection":{}}')
    await waitFor(() => expect(screen.getByText(/unsupported collection file version/i)).toBeInTheDocument())
    expect(screen.queryByText('will be added', { exact: false })).not.toBeInTheDocument()
    expect(localStorage.getItem(COLLECTIONS_STORAGE_KEY)).toBeNull()
  })

  it('asks for a file before importing', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Import' }))
    const dialog = screen.getByRole('dialog')
    fireEvent.submit(dialog.querySelector('form'))
    expect(screen.getByText('Choose a collection file first.')).toBeInTheDocument()
  })
})
