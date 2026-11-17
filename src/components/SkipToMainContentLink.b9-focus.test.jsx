import { afterEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import SkipToMainContentLink, { MAIN_CONTENT_ID } from './SkipToMainContentLink'

afterEach(() => {
  document.getElementById(MAIN_CONTENT_ID)?.remove()
})

describe('SkipToMainContentLink focus transfer', () => {
  it('moves focus to the main landmark when activated', () => {
    const main = document.createElement('main')
    main.id = MAIN_CONTENT_ID
    main.tabIndex = -1
    document.body.appendChild(main)

    render(<SkipToMainContentLink />)
    const link = screen.getByRole('link', { name: 'Skip to main content' })
    link.focus()
    fireEvent.click(link)

    expect(main).toHaveFocus()
    expect(link).toHaveAttribute('href', `#${MAIN_CONTENT_ID}`)
  })
})
