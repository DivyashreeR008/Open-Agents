import { useEffect, useId, useRef, useState } from 'react'
import { Info, ExternalLink } from 'lucide-react'

export default function ApiKeyInfo({ provider, url }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const buttonRef = useRef(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative inline-block ml-2">
      <button
        ref={buttonRef}
        type="button"
        aria-label={`${provider} API key help`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key !== 'Escape') return
          setOpen(false)
        }}
        className="cursor-pointer border-0 bg-transparent p-0 text-gray-400 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500"
      >
        <Info size={16} aria-hidden="true" />
      </button>
      <div
        id={panelId}
        role="dialog"
        aria-label={`${provider} API key help`}
        hidden={!open}
        className="absolute z-50 bg-black text-white text-xs p-3 w-56 top-6 left-0 shadow-panel"
      >
        <p className="mb-2">Get your {provider} API key</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-zinc-400 underline"
        >
          Open {provider} dashboard
          <ExternalLink size={10} aria-hidden="true" />
          <span className="sr-only">(opens in new tab)</span>
        </a>
      </div>
    </div>
  )
}
