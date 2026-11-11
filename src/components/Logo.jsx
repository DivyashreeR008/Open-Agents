/**
 * Open Agents logo — a terminal-prompt mark (">_") inside a square black
 * tile, followed by the "Open Agents" wordmark.
 *
 * Renders as an inline SVG so it stays crisp at every size. The mark is
 * deliberately hue-free: a black tile with a white hairline and glyph, which
 * reads identically on black and white chrome. The wordmark inherits
 * currentColor so it flips with the theme. Mirrors public/favicon.svg.
 */
export default function Logo({ className = '', height = 28 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 48"
      height={height}
      className={className}
      aria-label="Open Agents"
      role="img"
    >
      {/* Prompt mark */}
      <g>
        <rect x="2" y="6" width="36" height="36" fill="#000000" />
        <rect
          x="2.75"
          y="6.75"
          width="34.5"
          height="34.5"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
        <g
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.375"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13.8 16.7 22 24 13.8 31.3" />
          <path d="M23 31.3h7.5" />
        </g>
      </g>

      {/* "Open Agents" */}
      <text
        x="46"
        y="36"
        fontFamily="'Inter Tight Variable', 'Inter Variable', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="700"
        fontSize="32"
        fill="currentColor"
        letterSpacing="-0.8"
      >
        Open Agents
      </text>
    </svg>
  )
}
