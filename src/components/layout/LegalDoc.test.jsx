import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Database, Shield } from 'lucide-react'
import LegalDoc from './LegalDoc'

const sections = [
  {
    icon: Shield,
    title: 'Information we collect',
    content: 'We collect the details you choose to provide.',
  },
  {
    icon: Database,
    title: 'How we store data',
    content: 'Data is stored with the providers described in this document.',
  },
]

function renderDoc() {
  return render(
    <LegalDoc
      eyebrow="Legal"
      title="Privacy Policy"
      updated="Updated January 2026"
      intro="This policy explains what the service stores."
      sections={sections}
      footerTitle="Questions"
      footerBody="Contact the maintainers if anything is unclear."
    />
  )
}

describe('LegalDoc', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the page heading, updated date, intro, and footer', () => {
    renderDoc()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })
    ).toBeInTheDocument()
    expect(screen.getByText('Updated January 2026')).toBeInTheDocument()
    expect(screen.getByText('This policy explains what the service stores.')).toBeInTheDocument()
    expect(screen.getByText('Questions')).toBeInTheDocument()
    expect(
      screen.getByText('Contact the maintainers if anything is unclear.')
    ).toBeInTheDocument()
  })

  it('renders every section in order with hidden decorative icons', () => {
    const { container } = renderDoc()
    const headings = screen.getAllByRole('heading', { level: 2 })

    expect(headings.map((heading) => heading.textContent)).toEqual([
      'Information we collect',
      'How we store data',
      'Questions',
    ])
    expect(screen.getByText('We collect the details you choose to provide.')).toBeInTheDocument()
    expect(
      screen.getByText('Data is stored with the providers described in this document.')
    ).toBeInTheDocument()

    const icons = [...container.querySelectorAll('svg')]
    expect(icons).toHaveLength(3)
    for (const icon of icons) {
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('calls the browser history back action from the back control', () => {
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {})
    renderDoc()

    fireEvent.click(screen.getByRole('button', { name: /back/i }))

    expect(back).toHaveBeenCalledTimes(1)
  })

  it('does not throw when there are no sections', () => {
    render(
      <LegalDoc
        eyebrow="Legal"
        title="Terms"
        updated="Updated now"
        intro="Terms intro."
        sections={[]}
        footerTitle="Contact"
        footerBody="Footer."
      />
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Terms' })).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })
})
