import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import VoiceInput from './VoiceInput'

let instances = []

class FakeSpeechRecognition {
  constructor() {
    instances.push(this)
  }
  start() {}
  stop() {}
}

beforeEach(() => {
  instances = []
  window.SpeechRecognition = FakeSpeechRecognition
})

afterEach(() => {
  delete window.SpeechRecognition
})

describe('VoiceInput visible failure guidance', () => {
  it('shows guidance when microphone permission is blocked', () => {
    render(<VoiceInput value="" onChange={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: 'Start voice input' }))
    act(() => instances[0].onerror({ error: 'not-allowed' }))

    const guidance = screen.getByText(/Microphone access is blocked/)
    expect(guidance).toBeVisible()
    expect(guidance).toHaveTextContent('Allow microphone access in your browser settings')
    expect(screen.getByRole('status')).toHaveTextContent('Microphone access is blocked')
    expect(screen.getByRole('button', { name: 'Start voice input' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  it('explains a missing microphone', () => {
    render(<VoiceInput value="" onChange={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: 'Start voice input' }))
    act(() => instances[0].onerror({ error: 'audio-capture' }))

    expect(screen.getByText(/No microphone was found/)).toBeVisible()
  })
})
