import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, render, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import ScrollRestoration from './ScrollRestoration'

let navigate

function Harness() {
  navigate = useNavigate()
  return (
    <>
      <ScrollRestoration />
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route
          path="/two"
          element={
            <div>
              <h1>Two</h1>
              <div id="section">Section</div>
            </div>
          }
        />
      </Routes>
    </>
  )
}

afterEach(() => {
  vi.restoreAllMocks()
  delete HTMLElement.prototype.scrollIntoView
})

describe('ScrollRestoration cross-page hash links', () => {
  it('scrolls to the target section after a navigation with a hash', async () => {
    const scrollIntoView = vi.fn()
    HTMLElement.prototype.scrollIntoView = scrollIntoView
    window.scrollTo = vi.fn()

    render(
      <MemoryRouter initialEntries={['/']}>
        <Harness />
      </MemoryRouter>
    )

    act(() => navigate('/two#section'))

    await waitFor(() => expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start' }))
    expect(scrollIntoView.mock.instances[0]).toHaveAttribute('id', 'section')
  })
})
