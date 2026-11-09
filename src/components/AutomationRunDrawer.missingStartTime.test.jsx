import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('./OutputRenderer', () => ({
  default: ({ content }) => <div data-testid="output">{content}</div>,
}))

import AutomationRunDrawer from './AutomationRunDrawer'

describe('AutomationRunDrawer missing start time', () => {
  it('renders a placeholder when a completed run has no start timestamp', () => {
    render(
      <AutomationRunDrawer
        run={{
          id: 'r1',
          status: 'success',
          automationName: 'Daily digest',
          agentName: 'Summarizer',
          duration: 1500,
          tokens: 120,
          output: 'Hello output',
          emailSent: true,
        }}
        isOpen
        onClose={() => {}}
      />
    )

    expect(screen.getByText('\u2014')).toBeInTheDocument()
    expect(screen.getByText('1.50s')).toBeInTheDocument()
    expect(screen.getByText('Delivered')).toBeInTheDocument()
  })
})
