import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './OutputMarkdown.css'

function OutputImage({ src, alt, title }) {
  const [approved, setApproved] = useState(false)
  const [failed, setFailed] = useState(false)
  let destination
  try {
    const url = src && new URL(src, window.location.href)
    if (url && ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password) {
      destination = url
    }
  } catch {
    // Invalid destinations remain inert, like unsupported protocols.
  }

  function load(event) {
    // An image may be nested in a Markdown link; loading must not follow it.
    event.preventDefault()
    event.stopPropagation()
    setFailed(false)
    setApproved(true)
  }

  return (
    <span className="output-image-consent">
      <span>{alt || 'Image without a description'}</span>
      {destination ? (
        <>
          <code className="output-image-address">{destination.href}</code>
          <span>Loading contacts this server and shares your network address.</span>
          {approved && !failed ? (
            <img
              src={destination.href}
              alt={alt || ''}
              title={title}
              referrerPolicy="no-referrer"
              onError={() => setFailed(true)}
            />
          ) : (
            <>
              {failed && <span role="status">Image could not be loaded.</span>}
              <button type="button" onClick={load}>
                {failed ? 'Retry image from' : 'Load image from'} {destination.host}
              </button>
            </>
          )}
        </>
      ) : (
        <span>Unsupported image address. Image remains blocked.</span>
      )}
    </span>
  )
}

export default function OutputMarkdown({ children, components, ...props }) {
  return (
    <ReactMarkdown
      {...props}
      // Remount consent on any changed output; it is never stored with saved runs.
      key={children}
      skipHtml
      remarkPlugins={[remarkGfm]}
      components={{ ...components, img: OutputImage }}
    >
      {children}
    </ReactMarkdown>
  )
}
