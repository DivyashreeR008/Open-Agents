import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { createEvent, fireEvent, render, screen } from '@testing-library/react'
import RecommendationWizardEntry from './RecommendationWizardEntry'

describe('RecommendationWizardEntry', () => {
  it('renders the default label and forwards a ref to the button', () => {
    const ref = createRef()
    render(<RecommendationWizardEntry ref={ref} onOpen={vi.fn()} />)

    const button = screen.getByRole('button', {
      name: 'Open smart agent recommendation wizard',
    })
    expect(button).toHaveTextContent('Find my agent')
    expect(ref.current).toBe(button)
  })

  it('prevents the default click and calls the open handler', () => {
    const onOpen = vi.fn()
    render(<RecommendationWizardEntry onOpen={onOpen} />)
    const button = screen.getByRole('button', {
      name: 'Open smart agent recommendation wizard',
    })
    const click = createEvent.click(button)

    fireEvent(button, click)

    expect(click.defaultPrevented).toBe(true)
    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('disables the button while disabled', () => {
    const onOpen = vi.fn()
    render(<RecommendationWizardEntry disabled onOpen={onOpen} />)
    const button = screen.getByRole('button', {
      name: 'Open smart agent recommendation wizard',
    })

    expect(button).toBeDisabled()
    fireEvent.click(button)
    expect(onOpen).not.toHaveBeenCalled()
  })

  it('shows the loading label while preserving the accessible name', () => {
    const { rerender } = render(<RecommendationWizardEntry loading={false} onOpen={vi.fn()} />)
    const button = screen.getByRole('button', {
      name: 'Open smart agent recommendation wizard',
    })
    expect(button).toHaveTextContent('Find my agent')

    rerender(<RecommendationWizardEntry loading onOpen={vi.fn()} />)

    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Loading agents')
    expect(button).toHaveAccessibleName('Open smart agent recommendation wizard')
  })

  it('hides the leading icon from assistive technology', () => {
    const { container } = render(<RecommendationWizardEntry onOpen={vi.fn()} />)
    const icon = container.querySelector('svg')

    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })
})
