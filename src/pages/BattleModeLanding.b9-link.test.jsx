import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import BattleModeLanding from './BattleModeLanding'

describe('BattleModeLanding landmarks and calls to action', () => {
  it('uses the shell main landmark and a real navigation link', () => {
    const { container } = render(
      <MemoryRouter>
        <BattleModeLanding />
      </MemoryRouter>
    )

    expect(container.querySelector('main')).toBeNull()
    expect(screen.getByRole('link', { name: 'Start Battle' })).toHaveAttribute(
      'href',
      '/battle/setup'
    )
  })
})
