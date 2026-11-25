import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import StorageUsage from './StorageUsage'
import { expectNoA11yViolations } from '../test/a11y'
import { LOCAL_PLANNING_BYTES } from '../lib/storageUsage'

let descriptor
const manager = (estimate) =>
  Object.defineProperty(navigator, 'storage', { configurable: true, value: { estimate } })
beforeEach(() => {
  localStorage.clear()
  descriptor = Object.getOwnPropertyDescriptor(navigator, 'storage')
  manager(vi.fn().mockResolvedValue({ usage: 20, quota: 100 }))
})
afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
  if (descriptor) Object.defineProperty(navigator, 'storage', descriptor)
  else delete navigator.storage
})

it('renders separate honest scales, safe feature labels and shared accessibility checks without writing data', async () => {
  localStorage.setItem('OpenAgents_history', 'private-run-marker')
  const set = vi.spyOn(Storage.prototype, 'setItem')
  const remove = vi.spyOn(Storage.prototype, 'removeItem')
  const { container } = render(<StorageUsage />)
  await screen.findByText(/20 B used of 100 B/)
  expect(screen.getByRole('table', { name: 'Largest localStorage consumers' })).toHaveTextContent(
    'History and prompts'
  )
  expect(screen.getByText(/app warning guide is not your browser/)).toBeInTheDocument()
  expect(container).not.toHaveTextContent('private-run-marker')
  expect(container).not.toHaveTextContent('OpenAgents_history')
  expect(set).not.toHaveBeenCalled()
  expect(remove).not.toHaveBeenCalled()
  await expectNoA11yViolations(container)
})

it('warns before the planning reference and origin estimate are full without claiming a measured local quota', async () => {
  localStorage.setItem('OpenAgents_history', 'x'.repeat(Math.ceil(LOCAL_PLANNING_BYTES * 0.41)))
  manager(vi.fn().mockResolvedValue({ usage: 85, quota: 100 }))
  render(<StorageUsage />)
  await screen.findByText(/85 B used of 100 B/)
  expect(screen.getAllByRole('alert')).toHaveLength(2)
  expect(screen.getByText(/localStorage footprint: at least 80%/)).toBeInTheDocument()
  expect(screen.getByText(/does not reveal localStorage’s remaining capacity/)).toBeInTheDocument()
})

it('refreshes after actual storage/focus events and manual refresh without letting old API responses overwrite a newer one', async () => {
  let finishFirst
  const estimate = vi
    .fn()
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishFirst = resolve
        })
    )
    .mockResolvedValue({ usage: 90, quota: 100 })
  manager(estimate)
  render(<StorageUsage />)
  localStorage.setItem('oa_agent_collections', '[]')
  act(() => window.dispatchEvent(new Event('storage')))
  await screen.findByText(/90 B used of 100 B/)
  await act(async () => finishFirst({ usage: 1, quota: 100 }))
  expect(screen.getByText(/90 B used of 100 B/)).toBeInTheDocument()
  expect(screen.queryByText(/1 B used of 100 B/)).not.toBeInTheDocument()
  act(() => window.dispatchEvent(new Event('focus')))
  fireEvent.click(screen.getByRole('button', { name: 'Refresh storage usage' }))
  await waitFor(() => expect(estimate.mock.calls.length).toBeGreaterThanOrEqual(3))
  expect(screen.getByRole('table')).toHaveTextContent('Collections')
})

it('shows blocked and unsupported reads as unavailable, not zero free capacity', async () => {
  localStorage.setItem('entry', 'private value')
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('private failure')
  })
  Object.defineProperty(navigator, 'storage', { configurable: true, value: undefined })
  const { container } = render(<StorageUsage />)
  await screen.findByText(/does not expose an origin storage estimate/)
  expect(container).toHaveTextContent('not assumed empty')
  expect(container).not.toHaveTextContent('0 B')
})
