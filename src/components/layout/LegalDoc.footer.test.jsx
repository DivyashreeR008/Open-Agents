import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import LegalDoc from './LegalDoc'

describe('LegalDoc footer treatment', () => {
  it('renders the footer as a heading after the policy sections', () => {
    render(
      <LegalDoc
        eyebrow="Legal"
        title="Policy"
        updated="June 2026"
        intro="Read this."
        sections={[
          { icon: () => null, title: 'First section', content: 'First body' },
          { icon: () => null, title: 'Second section', content: 'Second body' },
        ]}
        footerTitle="Contact Us"
        footerBody="Write to us."
      />
    )

    const headings = screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent)
    expect(headings).toEqual(['First section', 'Second section', 'Contact Us'])
    expect(screen.getByText('Write to us.')).toBeInTheDocument()
  })

  it('calls history.back from the back control', () => {
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {})
    render(
      <LegalDoc
        title="Policy"
        updated="June 2026"
        intro="Read this."
        sections={[]}
        footerTitle="Contact"
        footerBody="Body"
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))

    expect(back).toHaveBeenCalledTimes(1)
  })
})
