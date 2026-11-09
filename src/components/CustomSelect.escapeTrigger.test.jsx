import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import CustomSelect from './CustomSelect'

const options = ['First', 'Second']

describe('CustomSelect escape on the trigger', () => {
  it('leaves a closed menu closed and keeps focus on the trigger', () => {
    render(<CustomSelect value="First" onChange={vi.fn()} options={options} label="Choice" />)

    const trigger = screen.getByRole('button', { name: 'Choice' })
    trigger.focus()
    fireEvent.keyDown(trigger, { key: 'Escape' })

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(document.activeElement).toBe(trigger)
  })
})
