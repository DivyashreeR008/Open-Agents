import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import RecommendationWizardEntry from './RecommendationWizardEntry'

describe('RecommendationWizardEntry states', () => {
  it('uses an explicit accessible name and prevents default activation', () => {
    const onOpen = vi.fn()
    render(<RecommendationWizardEntry onOpen={onOpen} />)

    const button = screen.getByRole('button', {
      name: 'Open smart agent recommendation wizard',
    })
    fireEvent.click(button)

    expect(onOpen).toHaveBeenCalledTimes(1)
    expect(button).not.toBeDisabled()
  })

  it('disables both loading and explicitly disabled states', () => {
    const { rerender } = render(<RecommendationWizardEntry loading />)
    expect(screen.getByRole('button', { name: /Open smart agent/ })).toBeDisabled()
    expect(screen.getByText('Loading agents…')).toBeInTheDocument()

    rerender(<RecommendationWizardEntry disabled />)
    expect(screen.getByRole('button', { name: /Open smart agent/ })).toBeDisabled()
    expect(screen.getByText('Find my agent')).toBeInTheDocument()
  })
})
