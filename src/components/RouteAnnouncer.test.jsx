import { describe, it, expect } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import RouteAnnouncer from './RouteAnnouncer'
import { MAIN_CONTENT_ID } from './SkipToMainContentLink'

let nav
function Harness() {
  nav = useNavigate()
  return (
    <>
      <RouteAnnouncer />
      <Link to="/two">Go two</Link>
      <main id={MAIN_CONTENT_ID} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<h1>Page one</h1>} />
          <Route path="/two" element={<h1>Page two</h1>} />
          <Route path="/bare" element={<p>No heading</p>} />
        </Routes>
      </main>
    </>
  )
}

const setup = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Harness />
    </MemoryRouter>
  )

describe('RouteAnnouncer', () => {
  it('does not move focus or announce on initial load', () => {
    setup()
    expect(document.body).toHaveFocus()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('focuses main and announces the new heading on navigation', async () => {
    setup()
    act(() => nav('/two'))
    expect(document.getElementById(MAIN_CONTENT_ID)).toHaveFocus()
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Navigated to Page two')
    )
  })

  it('handles back navigation the same way', async () => {
    setup()
    act(() => nav('/two'))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Page two'))
    act(() => nav(-1))
    expect(document.getElementById(MAIN_CONTENT_ID)).toHaveFocus()
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Navigated to Page one')
    )
  })

  it('falls back to the document title when there is no heading', async () => {
    document.title = 'Fallback Title'
    setup()
    act(() => nav('/bare'))
    await waitFor(
      () => expect(screen.getByRole('status')).toHaveTextContent('Navigated to Fallback Title'),
      { timeout: 3000 }
    )
  })

  it('ignores hash-only changes', () => {
    setup()
    act(() => nav('/#section'))
    expect(document.body).toHaveFocus()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })
})
