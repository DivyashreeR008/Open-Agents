import { render } from '@testing-library/react'
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
  it('renders nothing when neither SpeechRecognition implementation exists', () => {
    const { container } = render(<VoiceInput value="" onChange={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })
})
