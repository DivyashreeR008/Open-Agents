import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import RouteAnnouncer from './RouteAnnouncer'
import { MAIN_CONTENT_ID } from './SkipToMainContentLink'

const originalTitle = document.title
let nav

function Harness() {
  nav = useNavigate()
  const { pathname } = useLocation()

  return (
    <>
      <RouteAnnouncer />
      <main
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        style={pathname === '/hidden-main' ? { display: 'none' } : undefined}
      >
        <Routes>
          <Route path="/" element={<h1>Page one</h1>} />
          <Route
            path="/hidden-heading"
            element={
              <>
                <div style={{ display: 'none' }}>
                  <h1>Draft heading</h1>
                </div>
                <h1>Visible heading</h1>
              </>
            }
          />
          <Route path="/hidden-main" element={<h1>Hidden main heading</h1>} />
        </Routes>
      </main>
    </>
  )
}

function setup() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Harness />
    </MemoryRouter>
  )
}

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
  document.title = originalTitle
})

describe('RouteAnnouncer hidden content and repeat visits', () => {
  it('ignores a hidden duplicate heading and announces the rendered one', async () => {
    setup()

    act(() => nav('/hidden-heading'))

    expect(document.getElementById(MAIN_CONTENT_ID)).toHaveFocus()
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Navigated to Visible heading')
    )
    expect(screen.getByRole('status')).not.toHaveTextContent('Draft heading')
  })

  it('falls back to the path when the main landmark stays hidden', () => {
    vi.useFakeTimers()
    document.title = ''
    setup()

    act(() => nav('/hidden-main'))
    act(() => vi.advanceTimersByTime(2000))

    expect(screen.getByRole('status')).toHaveTextContent('Navigated to /hidden-main')
    expect(document.getElementById(MAIN_CONTENT_ID)).not.toHaveFocus()
  })

  it('announces the same destination again after visiting another page', async () => {
    setup()

    act(() => nav('/hidden-heading'))
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Navigated to Visible heading')
    )

    act(() => nav('/'))
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Navigated to Page one')
    )

    act(() => nav('/hidden-heading'))
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Navigated to Visible heading')
    )
  })
})
