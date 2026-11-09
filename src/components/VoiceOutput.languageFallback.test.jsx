import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import VoiceOutput from './VoiceOutput'

let utterances = []

class FakeUtterance {
  constructor(text) {
    this.text = text
    this.lang = ''
    utterances.push(this)
  }
}

beforeEach(() => {
  utterances = []
  window.SpeechSynthesisUtterance = FakeUtterance
  window.speechSynthesis = {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
  }
})

afterEach(() => {
  cleanup()
  delete window.speechSynthesis
  delete window.SpeechSynthesisUtterance
  vi.restoreAllMocks()
})

describe('VoiceOutput language fallback', () => {
  it('uses the navigator language when no language prop is supplied', () => {
    render(<VoiceOutput text="Hello" />)

    fireEvent.click(screen.getByRole('button', { name: 'Read response aloud' }))

    expect(utterances[0].lang).toBe(navigator.language || 'en-US')
  })
})
