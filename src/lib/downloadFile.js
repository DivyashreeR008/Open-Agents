const REVOKE_DELAY_MS = 1000

/**
 * Trigger a browser download for in-memory content.
 *
 * The object URL is released after a short delay rather than in the same task
 * as the click. Some browsers have not started reading the blob when click()
 * returns, and revoking immediately cancels the download or yields an empty
 * file. A one-second delay is long enough for navigation to start and short
 * enough that URLs do not accumulate.
 *
 * @param {BlobPart | Blob} content
 * @param {string} mimeType
 * @param {string} filename
 * @returns {Blob}
 */
export function downloadBlob(content, mimeType, filename) {
  const type = /charset=/i.test(mimeType) ? mimeType : `${mimeType};charset=utf-8`
  const blob = content instanceof Blob ? content : new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  link.rel = 'noopener'
  link.hidden = true
  document.body.appendChild(link)
  link.click()
  link.remove()

  window.setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS)
  return blob
}

export { REVOKE_DELAY_MS }
