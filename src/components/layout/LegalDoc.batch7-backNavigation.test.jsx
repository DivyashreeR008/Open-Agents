import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Shield } from 'lucide-react'
import LegalDoc from './LegalDoc'

describe('LegalDoc back navigation', () => {
  it('asks the browser to return to the previous page', () => {
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {})

    render(
      <LegalDoc
        eyebrow="Legal"
        title="Privacy"
        updated="Updated today"
        intro="Intro copy."
        sections={[{ icon: Shield, title: 'Data', content: 'We store little.' }]}
        footerTitle="Questions"
        footerBody="Contact us."
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /Back/ }))
    expect(back).toHaveBeenCalledTimes(1)
  })
})
