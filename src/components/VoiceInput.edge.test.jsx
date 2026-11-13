import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import VoiceInput from './VoiceInput'

const originalSpeechRecognition = window.SpeechRecognition
const originalWebkitSpeechRecognition = window.webkitSpeechRecognition

beforeEach(() => {
  delete window.SpeechRecognition
  delete window.webkitSpeechRecognition
})

afterEach(() => {
  if (originalSpeechRecognition) window.SpeechRecognition = originalSpeechRecognition
  if (originalWebkitSpeechRecognition)
    window.webkitSpeechRecognition = originalWebkitSpeechRecognition
})

describe('VoiceInput unsupported browser behavior', () => {
  it('keeps a disabled mic visible and explains that voice input is unavailable', () => {
    render(<VoiceInput value="" onChange={() => {}} />)

    expect(
      screen.getByRole('button', { name: 'Voice input is not supported in this browser' })
    ).toBeDisabled()
    expect(screen.getByRole('status')).toHaveTextContent(
      'Voice input is not supported in this browser. You can still type your input.'
    )
  })
})
