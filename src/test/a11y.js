import { axe } from 'jest-axe'

/**
 * Run deterministic axe checks supported by jsdom. Color contrast depends on
 * computed layout and is intentionally left to browser-based/manual testing.
 */
export async function expectNoA11yViolations(container) {
  const results = await axe(container, {
    rules: {
      'color-contrast': { enabled: false },
    },
  })

  if (results.violations.length > 0) {
    const details = results.violations
      .map((violation) => {
        const nodes = violation.nodes
          .map((node) => `  ${node.target.join(' ')}: ${node.failureSummary}`)
          .join('\n')
        return `${violation.id} (${violation.impact}): ${violation.help}\n${nodes}`
      })
      .join('\n\n')
    throw new Error(`Accessibility violations:\n${details}`)
  }
}
