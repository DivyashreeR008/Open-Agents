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

describe('VoiceInput cleared field during recording', () => {
  it('drops the old baseline when the user clears the field mid-recording', () => {
    const onChange = vi.fn()
    const { rerender } = render(<VoiceInput value="typed note" onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Start voice input' }))
    rerender(<VoiceInput value="" onChange={onChange} />)

    act(() =>
      instances[0].onresult({
        resultIndex: 0,
        results: [Object.assign([{ transcript: 'spoken note' }], { isFinal: false })],
      })
    )

    expect(onChange).toHaveBeenCalledWith('spoken note')
  })
})
