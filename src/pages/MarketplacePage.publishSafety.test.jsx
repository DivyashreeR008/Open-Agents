import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({
    agents: [
      {
        id: 'a1',
        name: 'Summarizer',
        description: 'Summarizes text',
        category: 'Research',
        provider: 'openai',
        systemPrompt: 'Summarize.',
        outputType: 'text',
      },
    ],
    loading: false,
    error: null,
  }),
}))

import MarketplacePage from './MarketplacePage'

const LISTINGS_KEY = 'oa_marketplace_listings'

function renderPage() {
  return render(
    <MemoryRouter>
      <MarketplacePage />
    </MemoryRouter>
  )
}

async function openPublish(user) {
  await user.click(screen.getByRole('button', { name: /publish to marketplace/i }))
  return screen.getByRole('dialog', { name: /publish agent to marketplace/i })
}

async function fillRequiredFields(user, dialog, { author = '' } = {}) {
  await user.selectOptions(within(dialog).getByLabelText('Agent to publish'), 'a1')
  await user.type(within(dialog).getByPlaceholderText('My Agent Pack'), 'Safety Pack')
  await user.type(within(dialog).getByPlaceholderText('What does this agent do?'), 'Does things')
  if (author) await user.type(within(dialog).getByLabelText('Author'), author)
}

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('MarketplacePage publish safety', () => {
  it('closes a pristine dialog when Escape is pressed', async () => {
    const user = userEvent.setup()
    renderPage()
    await openPublish(user)

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes a pristine dialog when the backdrop is clicked', async () => {
    const user = userEvent.setup()
    renderPage()
    const dialog = await openPublish(user)

    fireEvent.click(dialog.parentElement)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('asks before discarding a filled form through the backdrop', async () => {
    const user = userEvent.setup()
    renderPage()
    const dialog = await openPublish(user)
    await fillRequiredFields(user, dialog)

    fireEvent.click(dialog.parentElement)

    const warning = within(dialog).getByRole('alert')
    expect(warning).toHaveTextContent('Discard this draft?')
    expect(within(dialog).getByRole('button', { name: 'Keep editing' })).toHaveFocus()

    await user.click(within(dialog).getByRole('button', { name: 'Keep editing' }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(within(dialog).getByPlaceholderText('My Agent Pack')).toHaveValue('Safety Pack')
  })

  it('asks before discarding through the Close control', async () => {
    const user = userEvent.setup()
    renderPage()
    const dialog = await openPublish(user)
    await fillRequiredFields(user, dialog)

    await user.click(within(dialog).getByRole('button', { name: 'Close' }))

    expect(within(dialog).getByRole('alert')).toHaveTextContent('Discard this draft?')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('warns on Escape and discards only after confirmation', async () => {
    const user = userEvent.setup()
    renderPage()
    const dialog = await openPublish(user)
    await fillRequiredFields(user, dialog)

    await user.keyboard('{Escape}')

    expect(within(dialog).getByRole('alert')).toHaveTextContent('Discard this draft?')
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Discard draft' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(localStorage.getItem(LISTINGS_KEY)).toBeNull()
  })

  it('dismisses the discard warning when Escape is pressed again', async () => {
    const user = userEvent.setup()
    renderPage()
    const dialog = await openPublish(user)
    await fillRequiredFields(user, dialog)

    await user.keyboard('{Escape}')
    expect(within(dialog).getByRole('alert')).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('lists missing requirements and connects them to the Publish button', async () => {
    const user = userEvent.setup()
    renderPage()
    const dialog = await openPublish(user)
    const publish = within(dialog).getByRole('button', { name: 'Publish' })

    expect(publish).toBeDisabled()
    expect(publish).toHaveAttribute('aria-describedby', 'publish-requirements')
    expect(within(dialog).getByLabelText('Agent to publish')).toBeRequired()
    expect(within(dialog).getByLabelText('Display name')).toBeRequired()
    expect(within(dialog).getByLabelText('Description')).toBeRequired()
    expect(within(dialog).getByRole('status')).toHaveTextContent(
      'To publish, choose an agent, enter a display name, add a description, and enter an author or confirm anonymous publishing.'
    )

    await user.selectOptions(within(dialog).getByLabelText('Agent to publish'), 'a1')
    expect(within(dialog).getByRole('status')).toHaveTextContent(
      'To publish, enter a display name, add a description, and enter an author or confirm anonymous publishing.'
    )

    await user.type(within(dialog).getByPlaceholderText('My Agent Pack'), 'Safety Pack')
    expect(within(dialog).getByRole('status')).toHaveTextContent(
      'To publish, add a description and enter an author or confirm anonymous publishing.'
    )

    await user.type(within(dialog).getByPlaceholderText('What does this agent do?'), 'Does things')
    expect(within(dialog).getByRole('status')).toHaveTextContent(
      'To publish, enter an author or confirm anonymous publishing.'
    )

    await user.type(within(dialog).getByLabelText('Author'), 'Ada')
    expect(within(dialog).getByRole('status')).toHaveTextContent(
      'All required details are complete.'
    )
    expect(publish).toBeEnabled()
  })

  it('requires an explicit anonymous choice and shows the stored attribution', async () => {
    const user = userEvent.setup()
    renderPage()
    const dialog = await openPublish(user)
    await fillRequiredFields(user, dialog)
    const publish = within(dialog).getByRole('button', { name: 'Publish' })

    expect(publish).toBeDisabled()
    expect(
      within(dialog).getByText(
        'Enter an author name or select anonymous publishing. Attribution cannot be changed later.'
      )
    ).toBeInTheDocument()

    await user.click(within(dialog).getByRole('checkbox', { name: /publish anonymously/i }))

    expect(publish).toBeEnabled()
    expect(
      within(dialog).getByText('Attribution: Anonymous. This cannot be changed after publishing.')
    ).toBeInTheDocument()

    await user.click(publish)

    expect(screen.getByText('by Anonymous')).toBeInTheDocument()
    const stored = JSON.parse(localStorage.getItem(LISTINGS_KEY))
    expect(stored[0].author).toBe('Anonymous')
  })

  it('previews a named attribution and removes the anonymous option', async () => {
    const user = userEvent.setup()
    renderPage()
    const dialog = await openPublish(user)
    await fillRequiredFields(user, dialog, { author: 'Ada Lovelace' })

    expect(within(dialog).queryByRole('checkbox', { name: /publish anonymously/i })).toBeNull()
    expect(
      within(dialog).getByText(
        'Attribution: Ada Lovelace. This cannot be changed after publishing.'
      )
    ).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Publish' }))

    const stored = JSON.parse(localStorage.getItem(LISTINGS_KEY))
    expect(stored[0].author).toBe('Ada Lovelace')
  })
})
