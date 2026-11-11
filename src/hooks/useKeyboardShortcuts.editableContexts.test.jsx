import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useKeyboardShortcuts } from './useKeyboardShortcuts'

function Harness({ shortcuts }) {
  useKeyboardShortcuts(shortcuts)
  return (
    <div>
      <input aria-label="field" />
      <textarea aria-label="prompt" />
      <select aria-label="provider">
        <option value="openai">OpenAI</option>
      </select>
      <div aria-label="rich editor" contentEditable suppressContentEditableWarning>
        <strong>Bold text</strong>
      </div>
      <div aria-label="plain region">Plain text</div>
    </div>
  )
}

afterEach(cleanup)

describe('useKeyboardShortcuts editable contexts', () => {
  it('does not open single-key shortcuts from a select', () => {
    const help = vi.fn()
    render(<Harness shortcuts={{ '?': help }} />)

    fireEvent.keyDown(screen.getByLabelText('provider'), { key: '?' })

    expect(help).not.toHaveBeenCalled()
  })

  it('does not fire from a contenteditable region or its nested markup', () => {
    const slash = vi.fn()
    render(<Harness shortcuts={{ '/': slash }} />)

    const editor = screen.getByLabelText('rich editor')
    fireEvent.keyDown(editor, { key: '/' })
    fireEvent.keyDown(editor.querySelector('strong'), { key: '/' })

    expect(slash).not.toHaveBeenCalled()
  })

  it('still fires from a regular element outside an editor', () => {
    const slash = vi.fn()
    render(<Harness shortcuts={{ '/': slash }} />)

    fireEvent.keyDown(screen.getByLabelText('plain region'), { key: '/' })

    expect(slash).toHaveBeenCalledTimes(1)
  })

  it('ignores repeated keydown events for single keys and combinations', () => {
    const slash = vi.fn()
    const run = vi.fn()
    render(<Harness shortcuts={{ '/': slash, 'Control+Enter': run }} />)

    fireEvent.keyDown(document.body, { key: '/', repeat: true })
    fireEvent.keyDown(document.body, { key: 'Enter', ctrlKey: true, repeat: true })

    expect(slash).not.toHaveBeenCalled()
    expect(run).not.toHaveBeenCalled()
  })

  it('ignores keys produced during IME composition', () => {
    const help = vi.fn()
    render(<Harness shortcuts={{ '?': help }} />)

    fireEvent.keyDown(document.body, { key: '?', isComposing: true })

    expect(help).not.toHaveBeenCalled()
  })

  it('keeps command shortcuts available from a textarea', () => {
    const run = vi.fn()
    render(<Harness shortcuts={{ 'Control+Enter': run }} />)

    fireEvent.keyDown(screen.getByLabelText('prompt'), { key: 'Enter', ctrlKey: true })

    expect(run).toHaveBeenCalledTimes(1)
  })
})
