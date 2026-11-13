import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import CustomSelect from './CustomSelect'

const options = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'gemini', label: 'Gemini' },
]

function renderSelect(overrides = {}) {
  const onChange = vi.fn()
  const view = render(
    <CustomSelect
      value="openai"
      onChange={onChange}
      options={options}
      label="Provider"
      {...overrides}
    />
  )
  return { ...view, onChange }
}

afterEach(cleanup)

describe('CustomSelect keyboard and pointer edges', () => {
  it('opens on the selected option and wraps the highlight at both ends', () => {
    renderSelect()
    const trigger = screen.getByRole('button', { name: 'Provider' })

    fireEvent.keyDown(trigger, { key: 'ArrowUp' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()

    fireEvent.click(trigger)
    let choices = screen.getAllByRole('option')
    expect(document.activeElement).toBe(choices[0])

    fireEvent.keyDown(choices[0], { key: 'ArrowUp' })
    choices = screen.getAllByRole('option')
    expect(document.activeElement).toBe(choices[2])

    fireEvent.keyDown(choices[2], { key: 'ArrowDown' })
    expect(document.activeElement).toBe(screen.getAllByRole('option')[0])
  })

  it('toggles shut on a second trigger click and closes with Escape on the trigger', () => {
    renderSelect()
    const trigger = screen.getByRole('button', { name: 'Provider' })

    fireEvent.click(trigger)
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    fireEvent.click(trigger)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()

    fireEvent.click(trigger)
    fireEvent.keyDown(trigger, { key: 'Escape' })

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(document.activeElement).toBe(trigger)
  })

  it('stays open when the pointer goes down inside the dropdown', () => {
    renderSelect()
    fireEvent.click(screen.getByRole('button', { name: 'Provider' }))

    fireEvent.mouseDown(screen.getByRole('listbox'))

    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('applies the selected-option accent for both accent modes', () => {
    const { rerender } = renderSelect()
    fireEvent.click(screen.getByRole('button', { name: 'Provider' }))

    expect(screen.getAllByRole('option')[0].className).toContain('bg-black')
    expect(screen.getAllByRole('option')[1].className).not.toContain('bg-black')

    rerender(
      <CustomSelect
        value="openai"
        onChange={vi.fn()}
        options={options}
        label="Provider"
        accentColor="zinc"
      />
    )

    expect(screen.getAllByRole('option')[0].className).toContain('bg-zinc-400/10')
  })
})
