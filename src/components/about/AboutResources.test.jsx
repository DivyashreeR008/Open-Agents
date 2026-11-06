import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import AboutResources from './AboutResources'

const expectedLinks = [
  ['GitHub Repository', 'Source Code', 'https://github.com/DivyashreeR008/Open-Agents'],
  ['Documentation', 'Docs', 'https://github.com/DivyashreeR008/Open-Agents#readme'],
  [
    'Contribution Guide',
    'Guide',
    'https://github.com/DivyashreeR008/Open-Agents/blob/main/CONTRIBUTING.md',
  ],
  ['Issues & Tasks', 'Issues', 'https://github.com/DivyashreeR008/Open-Agents/issues'],
  ['Discussions', 'Community', 'https://github.com/DivyashreeR008/Open-Agents/discussions'],
]

describe('AboutResources', () => {
  it('renders the section heading and five ordered resource links', () => {
    render(<AboutResources />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Useful Resources & Quick Links' })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Everything you need to navigate, understand, and contribute to the OpenAgents ecosystem.'
      )
    ).toBeInTheDocument()

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(5)
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      expectedLinks.map((entry) => entry[2])
    )
  })

  it('makes every resource a safe external link', () => {
    render(<AboutResources />)

    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(link).toHaveTextContent('(opens in new tab)')
    }
  })

  it('renders each title, description, and tag', () => {
    render(<AboutResources />)
    const headings = screen.getAllByRole('heading', { level: 3 })

    expect(headings).toHaveLength(5)
    expectedLinks.forEach(([title], index) => {
      expect(headings[index]).toHaveTextContent(title)
    })
    for (const [title, tag] of expectedLinks) {
      expect(screen.getByText(title)).toBeInTheDocument()
      expect(screen.getByText(tag)).toBeInTheDocument()
    }
    expect(screen.getByText(/Explore the full codebase/)).toBeInTheDocument()
    expect(screen.getByText(/Step-by-step instructions/)).toBeInTheDocument()
  })

  it('renders resource icons and external-link markers as decorative', () => {
    const { container } = render(<AboutResources />)
    const icons = [...container.querySelectorAll('svg')]

    expect(icons).toHaveLength(10)
    for (const icon of icons) {
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    }
  })
})
