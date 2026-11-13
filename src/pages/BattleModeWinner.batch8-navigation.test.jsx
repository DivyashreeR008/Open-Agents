import { describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

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

describe('BattleModeWinner missing state side effects', () => {
  it('does not navigate while rendering', () => {
    mocks.navigate.mockClear()

    const markup = renderToStaticMarkup(<BattleModeWinner />)

    expect(markup).toBe('')
    expect(mocks.navigate).not.toHaveBeenCalled()
  })
})
