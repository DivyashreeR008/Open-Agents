import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import AboutOpenSource from './AboutOpenSource'

describe('AboutOpenSource', () => {
  it('renders a labelled section and four ordered contribution steps', () => {
    render(<AboutOpenSource />)

    expect(
      screen.getByRole('region', {
        name: 'Open Source Philosophy & Contribution Workflow',
      })
    ).toBeInTheDocument()
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings.map((heading) => heading.textContent)).toEqual([
      'Fork & Clone',
      'Create Branch',
      'Add Agent / Code',
      'Validate & Build',
    ])
    expect(screen.getByText('Step 01')).toBeInTheDocument()
    expect(screen.getByText('Step 04')).toBeInTheDocument()
  })

  it('shows the command for each contribution step', () => {
    render(<AboutOpenSource />)

    expect(
      screen.getByText('git clone https://github.com/YOUR_USERNAME/OpenAgents.git')
    ).toBeInTheDocument()
    expect(screen.getByText('git checkout -b agent/my-new-agent')).toBeInTheDocument()
    expect(screen.getByText('src/agents/definitions/my-new-agent.js')).toBeInTheDocument()
    expect(screen.getAllByText('npm run build').length).toBeGreaterThanOrEqual(2)
  })

  it('links to the contributing guide with safe external attributes', () => {
    render(<AboutOpenSource />)

    const guide = screen.getByRole('link', { name: /Read Full Contributing Guide/ })
    expect(guide).toHaveAttribute(
      'href',
      'https://github.com/DivyashreeR008/Open-Agents/blob/main/CONTRIBUTING.md'
    )
    expect(guide).toHaveAttribute('target', '_blank')
    expect(guide).toHaveAttribute('rel', 'noopener noreferrer')
    expect(guide).toHaveTextContent('(opens in new tab)')
  })

  it('states the build requirement before opening a pull request', () => {
    render(<AboutOpenSource />)

    expect(screen.getByText(/Important Requirement Before Opening PR/)).toBeInTheDocument()
    expect(
      screen.getByText(/Clean, building code keeps the repository healthy/)
    ).toBeInTheDocument()
  })
})
