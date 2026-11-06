import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import VoiceInput from './VoiceInput'

// Records every instance so tests can drive the browser-side events
// (result, error, end) the way the Web Speech API would.
let instances = []

class FakeSpeechRecognition {
  constructor() {
    instances.push(this)
  }
  start() {}
  stop() {}
}

const current = () => instances[instances.length - 1]

const finalResult = (transcript) => ({
  resultIndex: 0,
  results: [Object.assign([{ transcript }], { isFinal: true })],
})

describe('VoiceInput listening state', () => {
  beforeEach(() => {
    instances = []
    window.SpeechRecognition = FakeSpeechRecognition
  })

  afterEach(() => {
    delete window.SpeechRecognition
  })

  it('exposes pressed state and announces when listening starts', () => {
    render(<VoiceInput value="" onChange={() => {}} />)

    const button = screen.getByRole('button', { name: 'Start voice input' })
    expect(button).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(button)

    expect(screen.getByRole('button', { name: 'Stop voice input' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('status')).toHaveTextContent('Listening started')
  })

  it('returns to unpressed and announces when stopped', () => {
    render(<VoiceInput value="" onChange={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: 'Start voice input' }))
    fireEvent.click(screen.getByRole('button', { name: 'Stop voice input' }))
    act(() => current().onend())

    const button = screen.getByRole('button', { name: 'Start voice input' })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('status')).toHaveTextContent('Listening stopped')
  })

  it('keeps the failure announcement when error is followed by end', () => {
    render(<VoiceInput value="" onChange={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: 'Start voice input' }))
    act(() => current().onerror({ error: 'network' }))
    act(() => current().onend())

    expect(screen.getByRole('status')).toHaveTextContent('Voice input failed')
    expect(screen.getByRole('status')).not.toHaveTextContent('Listening stopped')
    expect(screen.getByRole('button', { name: 'Start voice input' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  it('announces finalized speech but not interim revisions', () => {
    render(<VoiceInput value="" onChange={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: 'Start voice input' }))
    act(() =>
      current().onresult({
        resultIndex: 0,
        results: [Object.assign([{ transcript: 'hel' }], { isFinal: false })],
      })
    )
    expect(screen.getByRole('status')).toHaveTextContent('Listening started')

    act(() => current().onresult(finalResult('hello world')))
    expect(screen.getByRole('status')).toHaveTextContent('hello world')
  })
})
