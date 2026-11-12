import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import VoiceOutput from './VoiceOutput'

const speak = vi.fn()
const cancel = vi.fn()

beforeEach(() => {
  window.speechSynthesis = { speak, cancel, pause: vi.fn(), resume: vi.fn() }
  globalThis.SpeechSynthesisUtterance = class {
    constructor(text) {
      this.text = text
    }
  }
})

afterEach(() => {
  cleanup()
  delete window.speechSynthesis
  delete globalThis.SpeechSynthesisUtterance
  speak.mockReset()
  cancel.mockReset()
})

describe('VoiceOutput markdown-only text', () => {
  it('does not speak when markdown syntax strips to an empty string', () => {
    render(<VoiceOutput text="***" />)

    fireEvent.click(screen.getByRole('button', { name: 'Read response aloud' }))
    expect(speak).not.toHaveBeenCalled()
    expect(cancel).not.toHaveBeenCalled()
  })
})
