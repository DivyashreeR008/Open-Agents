import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import CustomSelect from './CustomSelect'

describe('CustomSelect option arrow navigation', () => {
  it('moves the highlight down and back up while focus is inside the list', () => {
    render(
      <CustomSelect
        value="One"
        onChange={vi.fn()}
        options={['One', 'Two', 'Three']}
        label="Choice"
      />
    )

    const trigger = screen.getByRole('button', { name: 'Choice' })
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveFocus()

    fireEvent.keyDown(options[0], { key: 'ArrowDown' })
    expect(options[1]).toHaveFocus()

    fireEvent.keyDown(options[1], { key: 'ArrowUp' })
    expect(options[0]).toHaveFocus()
  })
})
