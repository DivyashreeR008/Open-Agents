import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import config from '../../tailwind.config.js'

const colors = config.theme.extend.colors
const channels = (hex) => {
  const value = hex.replace('#', '')
  return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16) / 255)
}
const luminance = (hex) =>
  channels(hex)
    .map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4))
    .reduce((total, channel, index) => total + channel * [0.2126, 0.7152, 0.0722][index], 0)
const contrast = (foreground, background) => {
  const light = Math.max(luminance(foreground), luminance(background))
  const dark = Math.min(luminance(foreground), luminance(background))
  return (light + 0.05) / (dark + 0.05)
}

describe('design token contrast', () => {
  it('keeps muted metadata readable on every dark surface', () => {
    for (const background of Object.values(colors.surface)) {
      expect(contrast(colors.text.muted, background)).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('keeps secondary and primary text above normal-text thresholds', () => {
    for (const background of Object.values(colors.surface)) {
      expect(contrast(colors.text.secondary, background)).toBeGreaterThanOrEqual(4.5)
      expect(contrast(colors.text.primary, background)).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('keeps placeholder ink readable in both themes', () => {
    const css = readFileSync('src/index.css', 'utf8')
    const tokens = [...css.matchAll(/--text-placeholder:\s*(#[0-9a-f]{6})/gi)].map(
      (match) => match[1]
    )
    expect(tokens).toHaveLength(2)
    expect(contrast(tokens[0], '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
    expect(contrast(tokens[1], colors.surface.input)).toBeGreaterThanOrEqual(4.5)
  })
})
