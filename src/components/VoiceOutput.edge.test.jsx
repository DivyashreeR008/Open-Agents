import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import VoiceOutput from './VoiceOutput'

let speak
let cancel

beforeEach(() => {
  speak = vi.fn()
  cancel = vi.fn()
  window.speechSynthesis = { speak, cancel, pause: vi.fn(), resume: vi.fn() }
  window.SpeechSynthesisUtterance = class {
    constructor(text) {
      this.text = text
    }
  }
})

afterEach(() => {
  cleanup()
  delete window.speechSynthesis
  delete window.SpeechSynthesisUtterance
  vi.restoreAllMocks()
})

describe('VoiceOutput whitespace handling', () => {
  it('does not speak when the text is only whitespace', () => {
    render(<VoiceOutput text={'   \n\t'} />)
    const button = screen.getByRole('button', { name: 'Read response aloud' })

    expect(button).not.toBeDisabled()
    fireEvent.click(button)

    expect(speak).not.toHaveBeenCalled()
    expect(screen.queryByRole('button', { name: 'Stop reading' })).not.toBeInTheDocument()
  })
})
