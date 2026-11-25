import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, expect, it } from 'vitest'
import Navbar from './Navbar'
import { expectNoA11yViolations } from '../test/a11y'

beforeEach(() => localStorage.clear())
afterEach(() => localStorage.clear())
const mount = () =>
  render(
    <MemoryRouter>
      <Navbar sidebarOpen={false} setSidebarOpen={() => {}} />
    </MemoryRouter>
  )

it('keeps entirely unknown zero runs visible and labels omissions instead of implying free usage', async () => {
  localStorage.setItem(
    'oa_session_spend',
    JSON.stringify({ runs: [{ model: '<img src=x>', totalCost: 0 }] })
  )
  const { container } = mount()
  const button = screen.getByRole('button', { name: 'Session spend' })
  expect(button).toHaveTextContent('?')
  fireEvent.click(button)
  expect(button).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByRole('region', { name: 'Spend breakdown' })).toHaveTextContent(
    '2 input/output cost components unknown'
  )
  expect(screen.getByText('<img src=x>')).toBeInTheDocument()
  expect(container.querySelector('img')).toBeNull()
  await expectNoA11yViolations(container)
  fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
  expect(screen.queryByRole('button', { name: 'Session spend' })).not.toBeInTheDocument()
})

it('separates reported, estimated and legacy amounts while keeping each run source visible', () => {
  localStorage.setItem(
    'oa_session_spend',
    JSON.stringify({
      runs: [
        {
          model: 'mixed',
          inputCost: 1,
          outputCost: 2,
          totalCost: 3,
          costProvenance: { version: 1, input: 'reported', output: 'estimated' },
        },
        { model: 'legacy', inputCost: 0.1, outputCost: 0.2, totalCost: 0.3 },
        {
          model: 'free',
          inputCost: 0,
          outputCost: 0,
          totalCost: 0,
          costProvenance: { version: 1, input: 'reported', output: 'reported' },
        },
      ],
    })
  )
  mount()
  fireEvent.click(screen.getByRole('button', { name: 'Session spend' }))
  const region = screen.getByRole('region', { name: 'Spend breakdown' })
  expect(region).toHaveTextContent('Reported$1.00')
  expect(region).toHaveTextContent('Estimated$2.00')
  expect(region).toHaveTextContent('Source unknown$0.3')
  expect(region).toHaveTextContent('Mixed · $3.00')
  expect(region).toHaveTextContent('Reported · $0.00')
  expect(region).toHaveTextContent('newest 3 retained runs')
})
