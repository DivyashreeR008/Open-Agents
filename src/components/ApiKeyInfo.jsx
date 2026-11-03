import { Info, ExternalLink } from 'lucide-react'

export default function ApiKeyInfo({ provider, url }) {
  return (
    <div className="relative group inline-block ml-2">
      <Info size={16} className="cursor-pointer text-gray-400 hover:text-white" />
      <div className="absolute z-50 hidden group-hover:block bg-black text-white text-xs p-3 w-56 top-6 left-0 shadow-panel">
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
