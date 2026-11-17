import { afterEach, describe, expect, it } from 'vitest'
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

function installSpeech() {
  const synthesis = {
    speak(utterance) {
      utterance.onstart?.()
    },
    cancel() {},
    pause() {},
    resume() {},
  }
  window.speechSynthesis = synthesis
  window.SpeechSynthesisUtterance = FakeUtterance
  return synthesis
}

afterEach(() => {
  cleanup()
  delete window.speechSynthesis
  delete window.SpeechSynthesisUtterance
})

describe('VoiceOutput accessible controls', () => {
  it('explains why playback is disabled and hides the button icon', () => {
    delete window.speechSynthesis
    render(<VoiceOutput text="Hello world" />)

    const button = screen.getByRole('button', { name: 'Read response aloud' })
    const hint = screen.getByText('Text-to-speech is not supported in this browser.')

    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-describedby', hint.id)
    expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('treats playback icons and the visible paused label as decorative', () => {
    installSpeech()
    render(<VoiceOutput text="Hello world" />)

    fireEvent.click(screen.getByRole('button', { name: 'Read response aloud' }))
    fireEvent.click(screen.getByRole('button', { name: 'Pause reading' }))

    expect(screen.getByRole('status')).toHaveTextContent('Reading paused')
    expect(screen.getByText('paused')).toHaveAttribute('aria-hidden', 'true')
    expect(
      screen.getByRole('button', { name: 'Resume reading' }).querySelector('svg')
    ).toHaveAttribute('aria-hidden', 'true')
  })
})
