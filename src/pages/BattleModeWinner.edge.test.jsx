import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  location: { state: null },
}))

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => mocks.navigate,
  useLocation: () => mocks.location,
}))

import BattleModeWinner from './BattleModeWinner'

describe('BattleModeWinner missing result handling', () => {
  it('redirects to the battle landing page when no winner state exists', () => {
    mocks.navigate.mockClear()
    mocks.location.state = null
    const { container } = render(<BattleModeWinner />)

    expect(container).toBeEmptyDOMElement()
    expect(mocks.navigate).toHaveBeenCalledWith('/battle', { replace: true })
  })

  it('redirects when only a provider label is present without output', () => {
    mocks.navigate.mockClear()
    mocks.location.state = { provider: { label: 'OpenAI' }, content: '' }
    render(<BattleModeWinner />)

    expect(mocks.navigate).toHaveBeenCalledWith('/battle', { replace: true })
    expect(screen.queryByText('OpenAI')).not.toBeInTheDocument()
  })
})
