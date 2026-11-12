import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import CustomSelect from './CustomSelect'

const options = ['First', 'Second']

describe('CustomSelect escape while open', () => {
  it('closes the trigger menu, keeps focus, and supports ArrowUp navigation', () => {
    render(<CustomSelect value="First" onChange={vi.fn()} options={options} label="Choice" />)

    const trigger = screen.getByRole('button', { name: 'Choice' })
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    fireEvent.keyDown(trigger, { key: 'ArrowUp' })
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    fireEvent.keyDown(trigger, { key: 'Escape' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(document.activeElement).toBe(trigger)
  })

  it('closes an open option menu with Escape from an option', () => {
    render(<CustomSelect value="First" onChange={vi.fn()} options={options} label="Choice" />)

    const trigger = screen.getByRole('button', { name: 'Choice' })
    fireEvent.click(trigger)
    const option = screen.getByRole('option', { name: 'Second' })
    option.focus()
    fireEvent.keyDown(option, { key: 'Escape' })

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(document.activeElement).toBe(trigger)
  })
})
