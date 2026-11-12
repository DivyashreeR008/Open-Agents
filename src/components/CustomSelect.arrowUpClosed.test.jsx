import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import CustomSelect from './CustomSelect'

const options = ['First', 'Second', 'Third']

describe('CustomSelect arrow up while closed', () => {
  it('keeps the menu closed when arrow up is pressed on the trigger', () => {
    render(<CustomSelect value="First" onChange={vi.fn()} options={options} label="Choice" />)

    const trigger = screen.getByRole('button', { name: 'Choice' })
    fireEvent.keyDown(trigger, { key: 'ArrowUp' })

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })
})
