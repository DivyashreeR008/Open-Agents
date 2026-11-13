import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ApiKeyInfo from './ApiKeyInfo'

function renderInfo() {
  return render(<ApiKeyInfo provider="OpenAI" url="https://platform.openai.com/api-keys" />)
}

describe('ApiKeyInfo pointer and keyboard dismissal', () => {
  it('opens from a click or keyboard focus and reports its expanded state', () => {
    renderInfo()
    const trigger = screen.getByRole('button', { name: 'OpenAI API key help' })

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('dialog', { name: 'OpenAI API key help' })).toBeVisible()
  })

  it('closes on Escape and returns focus to the trigger', () => {
    renderInfo()
    const trigger = screen.getByRole('button', { name: 'OpenAI API key help' })
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    fireEvent.keyDown(trigger, { key: 'Escape' })

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes when the pointer goes outside without hiding the guidance on pointer leave', () => {
    renderInfo()
    const trigger = screen.getByRole('button', { name: 'OpenAI API key help' })
    fireEvent.click(trigger)

    fireEvent.pointerLeave(trigger)
    expect(screen.getByRole('dialog')).toBeVisible()

    fireEvent.pointerDown(document.body)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
