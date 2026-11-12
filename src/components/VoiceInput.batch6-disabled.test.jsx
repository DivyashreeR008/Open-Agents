import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import VoiceInput from './VoiceInput'

class FakeSpeechRecognition {
  start = vi.fn()
  stop = vi.fn()
}

beforeEach(() => {
  window.SpeechRecognition = FakeSpeechRecognition
})

afterEach(() => {
  delete window.SpeechRecognition
})

describe('VoiceInput disabled control', () => {
  it('keeps the mic visible but refuses to start recognition while disabled', () => {
    render(<VoiceInput value="note" onChange={() => {}} disabled />)

    const button = screen.getByRole('button', { name: 'Start voice input' })
    expect(button).toBeDisabled()
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'false')
  })
})
