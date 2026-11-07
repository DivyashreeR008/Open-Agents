import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import SkipToMainContentLink, { MAIN_CONTENT_ID } from './SkipToMainContentLink'

describe('skip link contract', () => {
  it('exports the main landmark id the app shell uses', () => {
    expect(MAIN_CONTENT_ID).toBe('main-content')
  })

  it('targets that id without opening a new tab', () => {
    render(<SkipToMainContentLink />)

    const link = screen.getByRole('link', { name: 'Skip to main content' })
    expect(link).toHaveAttribute('href', '#main-content')
    expect(link).not.toHaveAttribute('target')
    expect(link).not.toHaveAttribute('rel')
  })
})
