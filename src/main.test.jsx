import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

const captured = vi.hoisted(() => ({ element: null, container: undefined }))

vi.mock('react-dom/client', () => {
  const createRoot = (container) => {
    captured.container = container
    return {
      render: (element) => {
        captured.element = element
      },
    }
  }
  return { default: { createRoot }, createRoot }
})
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
}))
vi.mock('./lib/useAgents', () => ({
  AgentsProvider: ({ children }) => <div>{children}</div>,
}))
vi.mock('./App', () => ({ default: () => <div>App content</div> }))
vi.mock('./components/Preloader', () => ({
  default: ({ onFinish }) => (
    <button type="button" onClick={onFinish}>
      Finish preloader
    </button>
  ),
}))
vi.mock('./index.css', () => ({}))

import './main.jsx'

describe('application bootstrap', () => {
  it('mounts the app behind a busy preloader gate', () => {
    expect(captured.element).not.toBeNull()
    render(captured.element)

    const appContent = screen.getByText('App content')
    const gate = appContent.parentElement
    expect(gate).toHaveAttribute('aria-hidden', 'true')
    expect(gate).toHaveAttribute('aria-busy', 'true')
    expect(gate).toHaveAttribute('inert')
    expect(screen.getByRole('button', { name: 'Finish preloader' })).toBeInTheDocument()
  })

  it('removes the gate and preloader when loading finishes', () => {
    render(captured.element)

    fireEvent.click(screen.getByRole('button', { name: 'Finish preloader' }))

    const gate = screen.getByText('App content').parentElement
    expect(gate).not.toHaveAttribute('aria-hidden')
    expect(gate).not.toHaveAttribute('aria-busy')
    expect(gate).not.toHaveAttribute('inert')
    expect(screen.queryByRole('button', { name: 'Finish preloader' })).not.toBeInTheDocument()
  })
})
