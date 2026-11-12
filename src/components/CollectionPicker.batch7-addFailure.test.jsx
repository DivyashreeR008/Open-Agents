import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

const mocks = vi.hoisted(() => ({ addAgentToCollection: vi.fn() }))

vi.mock('../lib/useCollections', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useCollections: () => ({
      collections: [{ id: 'c1', name: 'Research', agentIds: [] }],
      createCollection: vi.fn(),
      addAgentToCollection: mocks.addAgentToCollection,
      isAgentInCollection: () => false,
    }),
  }
})

import CollectionPicker from './CollectionPicker'

beforeEach(() => {
  vi.clearAllMocks()
  mocks.addAgentToCollection.mockReturnValue({
    ok: false,
    error: 'Collections can contain up to 15 agents.',
  })
})

describe('CollectionPicker adding to an existing collection', () => {
  it('surfaces the failure returned by addAgentToCollection', () => {
    render(<CollectionPicker agentId="a1" onClose={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: /Research/ }))

    expect(mocks.addAgentToCollection).toHaveBeenCalledWith('c1', 'a1')
    expect(screen.getByText('Collections can contain up to 15 agents.')).toBeInTheDocument()
  })
})
