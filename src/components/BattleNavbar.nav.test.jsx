import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BattleNavbar from './BattleNavbar'

describe('BattleNavbar navigation', () => {
  it('renders one banner with a single route back to battle mode', () => {
    render(
      <MemoryRouter>
        <BattleNavbar />
      </MemoryRouter>
    )

    const navigation = screen.getByRole('navigation')
    const link = screen.getByRole('link', { name: /Battle Mode/ })
    expect(navigation).toContainElement(link)
    expect(link).toHaveAttribute('href', '/battle')
    expect(screen.getAllByRole('link')).toHaveLength(1)
  })
})
