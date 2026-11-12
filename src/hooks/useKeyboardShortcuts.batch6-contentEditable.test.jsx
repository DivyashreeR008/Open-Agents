import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useKeyboardShortcuts } from './useKeyboardShortcuts'

function Harness({ shortcuts }) {
  useKeyboardShortcuts(shortcuts)
  return (
    <div contentEditable aria-label="rich text editor" data-testid="editor">
      Draft text
    </div>
  )
}

afterEach(cleanup)

describe('useKeyboardShortcuts rich text fields', () => {
  it('blocks a plain slash binding inside a contenteditable editor but still allows Control+Enter', () => {
    const slash = vi.fn()
    const run = vi.fn()
    render(<Harness shortcuts={{ '/': slash, 'Control+Enter': run }} />)

    const editor = screen.getByTestId('editor')
    fireEvent.keyDown(editor, { key: '/' })
    fireEvent.keyDown(editor, { key: 'Enter', ctrlKey: true })

    expect(slash).not.toHaveBeenCalled()
    expect(run).toHaveBeenCalledTimes(1)
  })
})
