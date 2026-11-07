import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ApiKeyInfo from './ApiKeyInfo'

describe('ApiKeyInfo keyboard access', () => {
  it('exposes a focusable help trigger with a provider-specific name', () => {
    render(<ApiKeyInfo provider="OpenAI" url="https://platform.openai.com/api-keys" />)

    expect(screen.getByRole('button', { name: 'OpenAI API key help' })).toBeInTheDocument()
  })

  it('keeps the dashboard link safe and reachable from the tooltip', () => {
    render(<ApiKeyInfo provider="Anthropic" url="https://console.anthropic.com" />)

    const link = screen.getByRole('link', { name: /Anthropic dashboard/ })
    expect(link).toHaveAttribute('href', 'https://console.anthropic.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('reveals the tooltip on keyboard focus as well as hover', () => {
    render(<ApiKeyInfo provider="Gemini" url="https://aistudio.google.com" />)

    expect(screen.getByText('Get your Gemini API key').parentElement.className).toContain(
      'group-focus-within:block'
    )
  })
})
