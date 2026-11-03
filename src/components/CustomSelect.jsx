import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

// custom select component with consistent app-wide styling
export default function CustomSelect({
  value,
  onChange,
  options,
  disabled,
  className,
  triggerClassName,
  dropdownClassName,
  placeholder = 'Select...',
  accentColor = 'accent',
  label,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const optionRefs = useRef([])

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find((opt) =>
    typeof opt === 'object' ? opt.value === value : opt === value
  )

  const selectedLabel = selectedOption
    ? typeof selectedOption === 'object'
      ? selectedOption.label
      : selectedOption
    : placeholder

  const selectedIcon = selectedOption && typeof selectedOption === 'object' && selectedOption.icon

  const handleSelect = (val) => {
    onChange(val)
    setIsOpen(false)
    triggerRef.current.focus()
  }

  // Keyboard navigation within the open dropdown
  const handleTriggerKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        setHighlightedIndex(0)
      } else {
        setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1))
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (isOpen) setHighlightedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      triggerRef.current?.focus()
    }
  }

  const handleOptionKeyDown = (e, val) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSelect(val)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      triggerRef.current?.focus()
    }
  }

  // Move focus to highlighted option when index changes while open
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0) {
      optionRefs.current[highlightedIndex]?.focus()
    }
  }, [isOpen, highlightedIndex])

  // accent styling rules based on component context
  const isZincAccent = accentColor === 'zinc' || accentColor === 'yellow'
  const accentRing = isZincAccent
    ? 'focus:ring-zinc-400/30 focus:border-zinc-400/50'
    : 'focus:ring-zinc-500/40 focus:border-zinc-500'

  const accentItem = isZincAccent
    ? 'bg-zinc-400/10 text-zinc-300 font-semibold'
    : 'bg-black text-white dark:bg-white dark:text-black font-semibold'

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className || ''}`}>
      {/* Dropdown trigger */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label || `${selectedLabel}, ${placeholder}`}
        className={`w-full flex items-center justify-between gap-2 h-8 px-3 border text-sm transition-all duration-200
          dark:bg-surface-input dark:border-border dark:text-text-primary
          bg-white border-gray-200 text-gray-900
          hover:border-zinc-400 dark:hover:border-zinc-400
          focus:outline-none focus:ring-2 ${accentRing}
          disabled:opacity-50 disabled:cursor-not-allowed text-left ${triggerClassName || ''}`}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedIcon}
          <span className="truncate">{selectedLabel}</span>
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`text-gray-400 dark:text-text-muted transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown options menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label={label || placeholder}
          className={`absolute left-0 right-0 mt-1.5 z-50 border shadow-pop max-h-60 overflow-y-auto p-1.5 space-y-0.5
            dark:bg-surface-card dark:border-border bg-white border-gray-200 animate-fade-in ${dropdownClassName || ''}`}
        >
          {options.map((opt, idx) => {
            const val = typeof opt === 'object' ? opt.value : opt
            const optLabel = typeof opt === 'object' ? opt.label : opt
            const icon = typeof opt === 'object' && opt.icon
            const isSelected = val === value

            return (
              <button
                key={val}
                ref={(el) => (optionRefs.current[idx] = el)}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(val)}
                onKeyDown={(e) => handleOptionKeyDown(e, val)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors duration-150 text-left
                  text-gray-700 dark:text-text-secondary
                  focus:outline-none focus:ring-2 focus:ring-zinc-500/40
                  ${
                    isSelected
                      ? accentItem
                      : 'dark:hover:bg-surface-hover dark:hover:text-text-primary hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                {icon}
                <span className="truncate">{optLabel}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
