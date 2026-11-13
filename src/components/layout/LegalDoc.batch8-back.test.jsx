import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import LegalDoc from './LegalDoc'

function renderDoc() {
  return render(
    <LegalDoc
      eyebrow="Legal"
      title="Privacy"
      updated="Today"
      intro="Intro"
      sections={[]}
      footerTitle="Contact"
      footerBody="Body"
    />
  )
}

describe('LegalDoc navigation fallback', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/privacy')
  })

  afterEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('goes to the catalogue when a direct visit has no in-app history', () => {
    renderDoc()

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))

    expect(window.location.pathname).toBe('/agents')
  })
})
