import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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

describe('VoiceInput final transcript separator', () => {
  it('inserts a space between typed text and a finalized transcript', () => {
    const onChange = vi.fn()
    render(<VoiceInput value="hello" onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Start voice input' }))
    act(() =>
      instances[0].onresult({
        resultIndex: 0,
        results: [Object.assign([{ transcript: 'world' }], { isFinal: true })],
      })
    )

    expect(onChange).toHaveBeenCalledWith('hello world')
  })
})
