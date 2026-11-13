import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import ApiKeyInfo from './ApiKeyInfo'

describe('ApiKeyInfo keyboard access', () => {
  it('exposes a focusable help trigger with a provider-specific name', () => {
    render(<ApiKeyInfo provider="OpenAI" url="https://platform.openai.com/api-keys" />)

    expect(screen.getByRole('button', { name: 'OpenAI API key help' })).toBeInTheDocument()
  })

  it('keeps the dashboard link safe and reachable from the tooltip', () => {
    render(<ApiKeyInfo provider="Anthropic" url="https://console.anthropic.com" />)

    fireEvent.click(screen.getByRole('button', { name: 'Anthropic API key help' }))
    const link = screen.getByRole('link', { name: /Anthropic dashboard/ })
    expect(link).toHaveAttribute('href', 'https://console.anthropic.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('reveals the guidance from the trigger and dismisses it again', () => {
    render(<ApiKeyInfo provider="Gemini" url="https://aistudio.google.com" />)

    const trigger = screen.getByRole('button', { name: 'Gemini API key help' })
    fireEvent.click(trigger)
    expect(screen.getByText('Get your Gemini API key')).toBeVisible()

    fireEvent.click(trigger)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
