import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import VoiceOutput from './VoiceOutput'

class FakeUtterance {
  constructor(text) {
    this.text = text
    this.onstart = null
    this.onend = null
    this.onerror = null
  }
}

let synthesis

function installSpeech() {
  synthesis = {
    utterance: null,
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    speak(utterance) {
      this.utterance = utterance
      utterance.onstart?.()
    },
  }
  window.speechSynthesis = synthesis
  window.SpeechSynthesisUtterance = FakeUtterance
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  delete window.speechSynthesis
  delete window.SpeechSynthesisUtterance
})

describe('VoiceOutput unmount cleanup', () => {
  it('cancels playback and ignores a late end event without updating state', () => {
    installSpeech()
    const errors = []
    vi.spyOn(console, 'error').mockImplementation((...args) => {
      errors.push(args.join(' '))
    })

    const { unmount } = render(<VoiceOutput text="Hello world" />)
    fireEvent.click(screen.getByRole('button', { name: 'Read response aloud' }))

    expect(synthesis.utterance).not.toBeNull()
    const cancelsBeforeUnmount = synthesis.cancel.mock.calls.length

    unmount()
    expect(synthesis.cancel).toHaveBeenCalledTimes(cancelsBeforeUnmount + 1)

    synthesis.utterance.onend?.()
    expect(errors.filter((message) => /unmounted|state update/i.test(message))).toEqual([])
  })
})
