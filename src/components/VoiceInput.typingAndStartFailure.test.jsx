import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import VoiceInput from './VoiceInput'

let instances = []
let startThrows = false

class FakeSpeechRecognition {
  constructor() {
    instances.push(this)
  }

  start() {
    if (startThrows) throw new Error('microphone busy')
  }

  stop() {}
}

beforeEach(() => {
  instances = []
  startThrows = false
  window.SpeechRecognition = FakeSpeechRecognition
})

afterEach(() => {
  delete window.SpeechRecognition
})

describe('VoiceInput manual typing and start failures', () => {
  it('appends interim speech to text the user typed while recording', () => {
    const onChange = vi.fn()
    const { rerender } = render(<VoiceInput value="" onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Start voice input' }))
    rerender(<VoiceInput value="typed note" onChange={onChange} />)

    act(() =>
      instances[0].onresult({
        resultIndex: 0,
        results: [Object.assign([{ transcript: 'spoken note' }], { isFinal: false })],
      })
    )

    expect(onChange).toHaveBeenCalledWith('typed note spoken note')
  })

  it('announces a failed start without leaving the microphone pressed', () => {
    startThrows = true
    render(<VoiceInput value="" onChange={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: 'Start voice input' }))

    expect(screen.getByRole('status')).toHaveTextContent('Voice input failed')
    expect(screen.getByRole('button', { name: 'Start voice input' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })
})
