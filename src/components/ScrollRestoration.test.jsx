import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, act, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import ScrollRestoration from './ScrollRestoration'

let nav
let scrollY = 0
let scrollTo

function Harness() {
  nav = useNavigate()
  return (
    <>
      <ScrollRestoration />
      <Link to="/two">Open two</Link>
      <Link to="/#section">Jump to section</Link>
      <Routes>
        <Route path="/" element={<h1>One</h1>} />
        <Route path="/two" element={<h1>Two</h1>} />
      </Routes>
    </>
  )
}

function renderAt(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Harness />
    </MemoryRouter>
  )
}

function moveTo(offset) {
  scrollY = offset
  act(() => {
    window.dispatchEvent(new Event('scroll'))
  })
}

beforeEach(() => {
  scrollY = 0
  scrollTo = vi.fn((x, y) => {
    scrollY = typeof x === 'object' && x !== null ? x.top : y
  })
  window.scrollTo = scrollTo
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    get: () => scrollY,
  })
  Object.defineProperty(window.history, 'scrollRestoration', {
    configurable: true,
    writable: true,
    value: 'auto',
  })
})

afterEach(() => {
  delete window.history.scrollRestoration
  vi.restoreAllMocks()
})

describe('ScrollRestoration', () => {
  it('leaves the initial entry where the browser placed it', () => {
    scrollY = 240
    renderAt('/')
    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('opens a pushed page at the top', () => {
    renderAt('/')
    moveTo(640)
    act(() => nav('/two'))
    expect(scrollTo).toHaveBeenLastCalledWith(0, 0)
    expect(scrollY).toBe(0)
  })

  it('opens a replaced page at the top', () => {
    renderAt('/')
    moveTo(420)
    act(() => nav('/two', { replace: true }))
    expect(scrollTo).toHaveBeenLastCalledWith(0, 0)
    expect(scrollY).toBe(0)
  })

  it('restores the offset of the entry the user returns to', async () => {
    renderAt('/')
    moveTo(640)
    act(() => nav('/two'))
    moveTo(80)
    act(() => nav(-1))
    await waitFor(() => expect(scrollTo).toHaveBeenCalledWith(0, 640))
    expect(scrollY).toBe(640)
  })

  it('returns to the top when the restored entry had not been scrolled', async () => {
    renderAt('/')
    act(() => nav('/two'))
    moveTo(300)
    act(() => nav(-1))
    await waitFor(() => expect(scrollY).toBe(0))
  })

  it('keeps trying while lazy content grows tall enough', async () => {
    let contentReady = false
    scrollTo.mockImplementation((x, y) => {
      const target = typeof x === 'object' && x !== null ? x.top : y
      scrollY = contentReady ? target : 0
    })
    renderAt('/')
    moveTo(520)
    act(() => nav('/two'))
    moveTo(60)
    act(() => nav(-1))
    await waitFor(() => expect(scrollTo.mock.calls.length).toBeGreaterThan(2))
    contentReady = true
    await waitFor(() => expect(scrollY).toBe(520))
  })

  it('skips scroll changes for in-page anchors', () => {
    renderAt('/')
    moveTo(280)
    act(() => nav('/#section'))
    expect(scrollTo).not.toHaveBeenCalled()
    expect(scrollY).toBe(280)
  })

  it('takes over scroll restoration and hands control back on unmount', () => {
    const { unmount } = renderAt('/')
    expect(window.history.scrollRestoration).toBe('manual')
    unmount()
    expect(window.history.scrollRestoration).toBe('auto')
  })
})
