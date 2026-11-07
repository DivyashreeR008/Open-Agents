import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import VoiceOutput from './VoiceOutput'

let utterances = []

class FakeUtterance {
  constructor(text) {
    this.text = text
    this.onstart = null
    this.onend = null
    this.onerror = null
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
  vi.restoreAllMocks()
})

describe('VoiceOutput text changes after playback', () => {
  it('does not cancel finished speech when text changes and can read the new text', () => {
    const { rerender } = render(<VoiceOutput text="First answer" />)

    fireEvent.click(screen.getByRole('button', { name: 'Read response aloud' }))
    act(() => utterances[0].onstart())
    act(() => utterances[0].onend())
    expect(screen.getByRole('status')).toHaveTextContent('Finished reading')

    const cancelCalls = window.speechSynthesis.cancel.mock.calls.length

    rerender(<VoiceOutput text="Second answer" />)
    expect(window.speechSynthesis.cancel).toHaveBeenCalledTimes(cancelCalls)

    fireEvent.click(screen.getByRole('button', { name: 'Read response aloud' }))

    expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(2)
    expect(utterances[1].text).toBe('Second answer')
  })
})
