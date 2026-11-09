import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

beforeEach(() => {
  localStorage.clear()
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Navbar desktop shortcuts button', () => {
  it('opens the shortcuts dialog from the toolbar button', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar sidebarOpen={false} setSidebarOpen={vi.fn()} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Keyboard shortcuts' }))

    expect(screen.getByRole('dialog', { name: /Keyboard Shortcuts/i })).toBeInTheDocument()
  })
})
