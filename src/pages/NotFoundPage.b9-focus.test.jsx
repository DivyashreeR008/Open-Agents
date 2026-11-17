import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

const navigate = vi.hoisted(() => vi.fn())

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => navigate }
})

import NotFoundPage from './NotFoundPage'

function stubAnimationFrame() {
  const queue = []
  vi.stubGlobal('requestAnimationFrame', (callback) => {
    queue.push(callback)
    return queue.length
  })
  return queue
}

afterEach(() => {
  vi.unstubAllGlobals()
  document.getElementById('agent-search')?.remove()
})

describe('NotFoundPage agent search focus', () => {
  it('focuses the search field as soon as the agents route renders it', () => {
    const queue = stubAnimationFrame()
    render(<NotFoundPage />)

    fireEvent.click(screen.getByRole('button', { name: /search the agent library/i }))
    expect(navigate).toHaveBeenCalledWith('/agents')

    const input = document.createElement('input')
    input.id = 'agent-search'
    document.body.appendChild(input)

    while (queue.length > 0) queue.shift()()

    expect(input).toHaveFocus()
  })
})
