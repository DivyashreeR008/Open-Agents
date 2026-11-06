import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import CollectionPicker from './CollectionPicker'
import {
  COLLECTIONS_STORAGE_KEY,
  DEFAULT_COLLECTION_ID,
  MAX_COLLECTIONS,
} from '../lib/useCollections'

const defaultCollection = {
  id: DEFAULT_COLLECTION_ID,
  name: 'All Agents',
  agentIds: ['default-agent'],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  isDefault: true,
}

function seed(collections) {
  localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify([defaultCollection, ...collections]))
}

function storedCustomCollections() {
  return JSON.parse(localStorage.getItem(COLLECTIONS_STORAGE_KEY)).filter(
    (collection) => collection.id !== DEFAULT_COLLECTION_ID
  )
}

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  localStorage.clear()
})

describe('CollectionPicker empty and create states', () => {
  it('hides the default collection, creates a named collection, and resets the input', () => {
    render(<CollectionPicker agentId="a1" onClose={() => {}} />)

    expect(screen.getByText('No collections yet.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /All Agents/ })).not.toBeInTheDocument()

    const name = screen.getByLabelText('New collection name')
    fireEvent.change(name, { target: { value: 'Research' } })
    fireEvent.click(screen.getByRole('button', { name: /Create/i }))

    expect(screen.getByText('Added to Research.')).toBeInTheDocument()
    expect(name).toHaveValue('')
    expect(screen.getByRole('button', { name: /Research/ })).toHaveTextContent('Already added')
    expect(storedCustomCollections()).toEqual([
      expect.objectContaining({ name: 'Research', agentIds: ['a1'] }),
    ])
  })

  it('reports blank and duplicate names without writing extra collections', () => {
    seed([{ id: 'reads', name: 'Reads', agentIds: [] }])
    render(<CollectionPicker agentId="a1" onClose={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: /Create/i }))
    expect(screen.getByText('Collection name is required.')).toBeInTheDocument()
    expect(storedCustomCollections()).toHaveLength(1)

    fireEvent.change(screen.getByLabelText('New collection name'), {
      target: { value: '  reads  ' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Create/i }))

    expect(screen.getByText('A collection with that name already exists.')).toBeInTheDocument()
    expect(storedCustomCollections()).toHaveLength(1)
  })

  it('allows the tenth collection and then disables creation at the cap', () => {
    seed(
      Array.from({ length: MAX_COLLECTIONS - 1 }, (_, index) => ({
        id: `set-${index}`,
        name: `Set ${index}`,
        agentIds: [],
      }))
    )
    render(<CollectionPicker agentId="a1" onClose={() => {}} />)

    const name = screen.getByLabelText('New collection name')
    const create = screen.getByRole('button', { name: /Create/i })
    expect(name).toBeEnabled()
    expect(create).toBeEnabled()

    fireEvent.change(name, { target: { value: 'Tenth' } })
    fireEvent.click(create)

    expect(screen.getByText('Added to Tenth.')).toBeInTheDocument()
    expect(storedCustomCollections()).toHaveLength(MAX_COLLECTIONS)
    expect(name).toBeDisabled()
    expect(screen.getByRole('button', { name: /Create/i })).toBeDisabled()
    expect(
      screen.getByText(`You can create up to ${MAX_COLLECTIONS} collections.`)
    ).toBeInTheDocument()
  })

  it('marks existing members as added and surfaces the per-collection agent limit', () => {
    seed([
      { id: 'has-agent', name: 'Has agent', agentIds: ['a1'] },
      {
        id: 'full-set',
        name: 'Full set',
        agentIds: Array.from({ length: 15 }, (_, index) => `other-${index}`),
      },
    ])
    render(<CollectionPicker agentId="a1" onClose={() => {}} />)

    expect(screen.getByRole('button', { name: /Has agent/ })).toBeDisabled()
    expect(screen.getByText('Already added')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Full set/ }))
    expect(screen.getByText('Collections can contain up to 15 agents.')).toBeInTheDocument()
    expect(storedCustomCollections().find((item) => item.id === 'full-set').agentIds).not.toContain(
      'a1'
    )
  })
})
