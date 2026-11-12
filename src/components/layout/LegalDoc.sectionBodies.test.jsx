import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Shield } from 'lucide-react'
import LegalDoc from './LegalDoc'

describe('LegalDoc section bodies', () => {
  it('renders the body copy for every section in order', () => {
    render(
      <LegalDoc
        eyebrow="Legal"
        title="Terms of Service"
        updated="Updated today"
        intro="The short version."
        sections={[
          { icon: Shield, title: 'Using the service', content: 'Use it lawfully.' },
          { icon: Shield, title: 'Ending access', content: 'You can leave at any time.' },
        ]}
        footerTitle="Questions"
        footerBody="Contact the maintainers."
      />
    )

    expect(screen.getByText('Use it lawfully.')).toBeInTheDocument()
    expect(screen.getByText('You can leave at any time.')).toBeInTheDocument()
  })
})
