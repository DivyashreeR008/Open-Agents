import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

const captured = vi.hoisted(() => ({ element: null }))

vi.mock('react-dom/client', () => {
  const createRoot = () => ({
    render: (element) => {
      captured.element = element
    },
  })
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
vi.mock('./components/UpdateNotification', () => ({
  default: () => <aside aria-label="Update notice">Update notice</aside>,
}))
vi.mock('./index.css', () => ({}))

import './main.jsx'

describe('application shell update notification', () => {
  it('mounts the update notification outside the inert preloader gate', () => {
    render(captured.element)

    const notice = screen.getByLabelText('Update notice')
    expect(notice.closest('[inert]')).toBeNull()
    expect(notice).toBeVisible()
    expect(screen.getByText('App content').parentElement).toHaveAttribute('inert')
  })

  it('keeps the notification mounted after the preloader finishes', () => {
    render(captured.element)

    fireEvent.click(screen.getByRole('button', { name: 'Finish preloader' }))

    expect(screen.queryByRole('button', { name: 'Finish preloader' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('Update notice')).toBeInTheDocument()
  })
})
