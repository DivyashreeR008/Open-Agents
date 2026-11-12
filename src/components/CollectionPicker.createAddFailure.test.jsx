import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

const mocks = vi.hoisted(() => ({
  createCollection: vi.fn(),
  addAgentToCollection: vi.fn(),
}))

vi.mock('../lib/useCollections', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useCollections: () => ({
      collections: [],
      createCollection: mocks.createCollection,
      addAgentToCollection: mocks.addAgentToCollection,
      isAgentInCollection: () => false,
    }),
  }
})

import CollectionPicker from './CollectionPicker'

beforeEach(() => {
  vi.clearAllMocks()
  mocks.createCollection.mockReturnValue({
    ok: true,
    collection: { id: 'c1', name: 'Research' },
  })
  mocks.addAgentToCollection.mockReturnValue({
    ok: false,
    error: 'Collections can contain up to 15 agents.',
  })
})

describe('CollectionPicker create then add failure', () => {
  it('surfaces the add failure after the collection is created', () => {
    render(<CollectionPicker agentId="a1" onClose={() => {}} />)

    fireEvent.change(screen.getByLabelText('New collection name'), {
      target: { value: 'Research' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Create/i }))

    expect(mocks.createCollection).toHaveBeenCalledWith('Research')
    expect(mocks.addAgentToCollection).toHaveBeenCalledWith('c1', 'a1')
    expect(screen.getByText('Collections can contain up to 15 agents.')).toBeInTheDocument()
  })
})
