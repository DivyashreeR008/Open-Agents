import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Shield } from 'lucide-react'
import LegalDoc from './LegalDoc'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('LegalDoc reading layout', () => {
  it('renders every section and navigates back through browser history', () => {
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {})

    render(
      <LegalDoc
        eyebrow="Legal"
        title="Privacy Policy"
        updated="Updated today"
        intro="What we collect."
        sections={[
          { icon: Shield, title: 'Data we store', content: 'Only what you send.' },
          { icon: Shield, title: 'Your choices', content: 'Delete anything at any time.' },
        ]}
        footerTitle="Questions"
        footerBody="Contact the maintainers."
      />
    )

    expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Data we store' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Your choices' })).toBeInTheDocument()
    expect(screen.getByText('Contact the maintainers.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(back).toHaveBeenCalledTimes(1)
  })
})
