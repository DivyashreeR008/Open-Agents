import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import CollectionPicker from './CollectionPicker'
import { COLLECTIONS_STORAGE_KEY, DEFAULT_COLLECTION_ID } from '../lib/useCollections'

const defaultCollection = {
  id: DEFAULT_COLLECTION_ID,
  name: 'All Agents',
  agentIds: ['a1'],
  isDefault: true,
}

const collections = [
  defaultCollection,
  { id: 'research', name: 'Research', agentIds: ['a1'] },
  { id: 'writing', name: 'Writing', agentIds: ['other'] },
]

function stored() {
  return JSON.parse(localStorage.getItem(COLLECTIONS_STORAGE_KEY))
}

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(collections))
})

describe('CollectionPicker membership changes', () => {
  it('identifies the current collection and moves the agent to another one', () => {
    render(<CollectionPicker agentId="a1" onClose={() => {}} />)

    const current = screen.getByRole('button', { name: /^Research/ })
    expect(current).toBeDisabled()
    expect(current).toHaveTextContent('Current collection')
    expect(current).toHaveAttribute('title', 'This agent is already in Research.')

    fireEvent.click(screen.getByRole('button', { name: /^Writing/ }))

    expect(screen.getByText('Moved to Writing from Research.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Writing/ })).toHaveTextContent('Current collection')
    expect(stored().find((item) => item.id === 'writing').agentIds).toContain('a1')
    expect(stored().find((item) => item.id === 'research').agentIds).not.toContain('a1')
  })
})
