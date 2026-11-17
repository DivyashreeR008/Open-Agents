import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

const state = vi.hoisted(() => ({ parse: vi.fn() }))

vi.mock('../CollectionModal', () => ({
  default: ({ title, error, children }) => (
    <div>
      <h2>{title}</h2>
      {children}
      {error && <p role="alert">{error}</p>}
    </div>
  ),
}))
vi.mock('../../lib/collectionTransfer', () => ({
  MAX_COLLECTION_IMPORT_BYTES: 1024,
  parseCollectionImport: state.parse,
}))

import ImportCollectionModal from './ImportCollectionModal'

function renderModal() {
  return render(
    <ImportCollectionModal
      agents={[{ id: 'a1', name: 'Agent one' }]}
      onImport={vi.fn()}
      onClose={vi.fn()}
    />
  )
}

beforeEach(() => {
  state.parse.mockReset()
})

describe('ImportCollectionModal file selection', () => {
  it('clears the selected file so the same file can be chosen again', async () => {
    state.parse.mockReturnValue({ ok: false, error: 'Bad collection' })
    renderModal()

    const input = screen.getByLabelText('Collection file')
    fireEvent.change(input, {
      target: { files: [{ size: 10, text: async () => '{}' }] },
    })

    expect(await screen.findByRole('alert')).toHaveTextContent('Bad collection')
    expect(input.value).toBe('')
  })

  it('ignores an earlier file read that finishes after a newer selection', async () => {
    state.parse.mockImplementation((text) => ({
      ok: true,
      name: text,
      agentIds: [],
      skippedAgentIds: [],
    }))
    let resolveFirst
    let resolveSecond
    const firstText = new Promise((resolve) => {
      resolveFirst = resolve
    })
    const secondText = new Promise((resolve) => {
      resolveSecond = resolve
    })

    renderModal()
    const input = screen.getByLabelText('Collection file')

    fireEvent.change(input, { target: { files: [{ size: 10, text: () => firstText }] } })
    fireEvent.change(input, { target: { files: [{ size: 10, text: () => secondText }] } })

    resolveSecond('Second collection')
    expect(await screen.findByText('Second collection')).toBeInTheDocument()

    resolveFirst('First collection')
    await waitFor(() => expect(screen.queryByText('First collection')).not.toBeInTheDocument())
    expect(screen.getByText('Second collection')).toBeInTheDocument()
  })
})
