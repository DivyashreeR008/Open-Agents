import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
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

describe('CustomSelect', () => {
  it('renders the selected label and a labelled, collapsed trigger', () => {
    renderSelect()

    const trigger = screen.getByRole('button', { name: 'Provider' })
    expect(trigger).toHaveTextContent('OpenAI')
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('opens the listbox, marks the selected option, and selects another', () => {
    const { onChange } = renderSelect()
    const trigger = screen.getByRole('button', { name: 'Provider' })

    fireEvent.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('listbox', { name: 'Provider' })).toBeInTheDocument()
    const choices = screen.getAllByRole('option')
    expect(choices[0]).toHaveAttribute('aria-selected', 'true')
    expect(choices[1]).toHaveAttribute('aria-selected', 'false')

    fireEvent.click(choices[1])

    expect(onChange).toHaveBeenCalledWith('anthropic')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(document.activeElement).toBe(trigger)
  })

  it('supports primitive options and the placeholder fallback', () => {
    render(
      <CustomSelect
        value="Second"
        onChange={vi.fn()}
        options={['First', 'Second']}
        placeholder="Pick one"
      />
    )

    const trigger = screen.getByRole('button', { name: 'Second, Pick one' })
    fireEvent.click(trigger)

    expect(screen.getByRole('listbox', { name: 'Pick one' })).toBeInTheDocument()
    expect(screen.getAllByRole('option')[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('shows the placeholder when the value has no matching option', () => {
    renderSelect({ value: 'missing' })

    const trigger = screen.getByRole('button', { name: 'Provider' })
    expect(trigger).toHaveTextContent('Select...')
  })

  it('opens at the first option with arrow down and moves focus through the list', () => {
    const { onChange } = renderSelect()
    const trigger = screen.getByRole('button', { name: 'Provider' })

    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    let choices = screen.getAllByRole('option')
    expect(document.activeElement).toBe(choices[0])

    fireEvent.keyDown(choices[0], { key: 'ArrowDown' })
    choices = screen.getAllByRole('option')
    expect(document.activeElement).toBe(choices[1])

    fireEvent.keyDown(choices[1], { key: 'Enter' })
    expect(onChange).toHaveBeenCalledWith('anthropic')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(document.activeElement).toBe(trigger)
  })

  it('opens with Enter and with Space', () => {
    const { unmount } = renderSelect()
    let trigger = screen.getByRole('button', { name: 'Provider' })

    fireEvent.keyDown(trigger, { key: 'Enter' })
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(document.activeElement).toBe(screen.getAllByRole('option')[0])
    unmount()

    renderSelect()
    trigger = screen.getByRole('button', { name: 'Provider' })
    fireEvent.keyDown(trigger, { key: ' ' })
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(document.activeElement).toBe(screen.getAllByRole('option')[0])
  })

  it('selects the focused option with Space and closes with Escape', () => {
    const { onChange } = renderSelect()
    const trigger = screen.getByRole('button', { name: 'Provider' })
    fireEvent.click(trigger)

    const choices = screen.getAllByRole('option')
    fireEvent.keyDown(choices[2], { key: ' ' })
    expect(onChange).toHaveBeenCalledWith('gemini')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()

    fireEvent.click(trigger)
    const reopened = screen.getAllByRole('option')
    fireEvent.keyDown(reopened[0], { key: 'Escape' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(document.activeElement).toBe(trigger)
  })

  it('closes when the user presses outside the component', () => {
    renderSelect()
    const trigger = screen.getByRole('button', { name: 'Provider' })
    fireEvent.click(trigger)
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    fireEvent.mouseDown(document.body)

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('removes the outside listener on unmount', () => {
    const removeListener = vi.spyOn(document, 'removeEventListener')
    const { unmount } = renderSelect()
    unmount()

    expect(removeListener).toHaveBeenCalledWith('mousedown', expect.any(Function))
    removeListener.mockRestore()
  })

  it('does not open while disabled', () => {
    renderSelect({ disabled: true })
    const trigger = screen.getByRole('button', { name: 'Provider' })

    expect(trigger).toBeDisabled()
    fireEvent.click(trigger)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('uses the zinc focus treatment for zinc and yellow accents', () => {
    const { rerender } = renderSelect()
    let trigger = screen.getByRole('button', { name: 'Provider' })
    expect(trigger.className).toContain('focus:ring-zinc-500/40')

    rerender(
      <CustomSelect
        value="openai"
        onChange={vi.fn()}
        options={options}
        label="Provider"
        accentColor="zinc"
      />
    )
    trigger = screen.getByRole('button', { name: 'Provider' })
    expect(trigger.className).toContain('focus:ring-zinc-400/30')

    rerender(
      <CustomSelect
        value="openai"
        onChange={vi.fn()}
        options={options}
        label="Provider"
        accentColor="yellow"
      />
    )
    expect(screen.getByRole('button', { name: 'Provider' }).className).toContain(
      'focus:ring-zinc-400/30'
    )
  })

  it('renders a selected icon and hides the chevron from assistive technology', () => {
    const { container } = render(
      <CustomSelect
        value="icon-option"
        onChange={vi.fn()}
        options={[
          {
            value: 'icon-option',
            label: 'With icon',
            icon: <span data-testid="selected-icon" />,
          },
        ]}
        label="Icon choice"
      />
    )

    expect(screen.getByTestId('selected-icon')).toBeInTheDocument()
    expect(container.querySelector('svg.lucide-chevron-down')).toHaveAttribute(
      'aria-hidden',
      'true'
    )
  })
})
