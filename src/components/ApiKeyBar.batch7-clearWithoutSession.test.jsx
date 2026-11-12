import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import ApiKeyBar from './ApiKeyBar'
import { MODELS } from '../lib/resolveAgentModel'

describe('ApiKeyBar clearing a key without session saving', () => {
  it('does not change the save preference when session saving is already off', () => {
    const setSaveForSession = vi.fn()
    render(
      <MemoryRouter>
        <ApiKeyBar
          provider="openai"
          setProvider={() => {}}
          apiKey="sk-live"
          setApiKey={() => {}}
          saveForSession={false}
          setSaveForSession={setSaveForSession}
          agentProvider="any"
          model={MODELS.openai[0].value}
          setModel={() => {}}
        />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText('API key'), { target: { value: '' } })

    expect(setSaveForSession).not.toHaveBeenCalled()
    expect(screen.getByRole('checkbox', { name: /Save for session/i })).not.toBeChecked()
  })
})
