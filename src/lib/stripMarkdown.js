// Turns markdown into plain text without touching words that only look like
// markdown (snake_case names, "C#", "2 * 3 * 4", etc). Block markers are only
// removed at the start of a line and emphasis only when the markers hug the
// text and sit on a word boundary.

const OPEN = ''
const CLOSE = ''

export function stripMarkdown(text) {
  if (!text) return ''

  // Parts that must come out exactly as written (code, escaped characters)
  // are parked behind placeholders and put back at the end.
  const saved = []
  const park = (value) => {
    saved.push(value)
    return `${OPEN}${saved.length - 1}${CLOSE}`
  }

  let out = String(text).replace(/\r\n?/g, '\n')

  out = out
    // fenced code blocks, keep the code, drop the fences
    .replace(
      /^[ \t]{0,3}(`{3,}|~{3,})[^\n]*\n([\s\S]*?)(?:^[ \t]{0,3}\1[`~]*[ \t]*$|(?![\s\S]))/gm,
      (_, _fence, code) => park(code.replace(/\n$/, '')),
    )
    .replace(/`([^`\n]+)`/g, (_, code) => park(code))
    .replace(/\\([\\`*_{}[\]()#+\-.!~>|])/g, (_, ch) => park(ch))

  out = out
    // headings
    .replace(/^[ \t]{0,3}#{1,6}[ \t]+(.*?)(?:[ \t]+#+)?[ \t]*$/gm, '$1')
    // horizontal rules
    .replace(/^[ \t]{0,3}([-*_])(?:[ \t]*\1){2,}[ \t]*$/gm, '')
    // blockquotes
    .replace(/^(?:[ \t]{0,3}>[ \t]?)+/gm, '')
    // task list, bullet and numbered list markers
    .replace(/^([ \t]*)[-*+][ \t]+(?:\[[ xX]\][ \t]+)?/gm, '$1')
    .replace(/^([ \t]*)\d+[.)][ \t]+/gm, '$1')
    // images and links keep their label
    .replace(/!\[([^\]]*)\]\([^)\s]*(?:\s+"[^"]*")?\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)\s]*(?:\s+"[^"]*")?\)/g, '$1')
    // emphasis: markers must touch the text on the inside
    .replace(/~~(?=\S)([^\n]*?\S)~~/g, '$1')
    .replace(/\*\*(?=\S)([^\n]*?\S)\*\*/g, '$1')
    .replace(/\*(?=\S)([^\n*]*?\S)\*/g, '$1')
    // underscores also need a non word character on the outside, so
    // max_retry_count and my_module_name.py are left alone
    .replace(/(^|[^\w])__(?=\S)([^\n]*?\S)__(?!\w)/g, '$1$2')
    .replace(/(^|[^\w])_(?=\S)([^\n_]*?\S)_(?!\w)/g, '$1$2')

  out = out.replace(new RegExp(`${OPEN}(\\d+)${CLOSE}`, 'g'), (_, i) => saved[Number(i)])

  return out.replace(/\n{3,}/g, '\n\n').trim()
}
