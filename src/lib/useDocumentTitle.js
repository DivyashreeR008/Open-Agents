import { useEffect } from 'react'

export const SITE_NAME = 'Open Agents'
export const DEFAULT_TITLE = `${SITE_NAME} \u2014 AI Agents, Ready to Use`

export function formatDocumentTitle(pageTitle) {
  if (typeof pageTitle !== 'string' || !pageTitle.trim()) return DEFAULT_TITLE
  return `${pageTitle} \u2014 ${SITE_NAME}`
}

export function useDocumentTitle(pageTitle) {
  useEffect(() => {
    document.title = formatDocumentTitle(pageTitle)
  }, [pageTitle])
}
