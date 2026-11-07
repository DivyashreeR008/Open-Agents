import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

const ROOT_DIR = process.cwd()
const PUBLIC_DIR = path.join(ROOT_DIR, 'public')
const MANIFEST_PATH = path.join(PUBLIC_DIR, 'site.webmanifest')
const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html')

describe('PWA Web App Manifest and HTML Installability', () => {
  it('site.webmanifest exists and contains valid JSON', () => {
    expect(fs.existsSync(MANIFEST_PATH)).toBe(true)
    const content = fs.readFileSync(MANIFEST_PATH, 'utf8')
    expect(() => JSON.parse(content)).not.toThrow()
  })

  it('site.webmanifest includes all required fields for Lighthouse installability', () => {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))

    expect(manifest.name).toBe('Open Agents')
    expect(manifest.short_name).toBe('OpenAgents')
    expect(manifest.start_url).toBe('/')
    expect(manifest.display).toBe('standalone')
    expect(manifest.theme_color).toBe('#000000')
    expect(manifest.background_color).toBe('#000000')
    expect(typeof manifest.description).toBe('string')
    expect(manifest.description.length).toBeGreaterThan(10)
  })

  it('site.webmanifest defines icons that exist in public/ including 192x192 and 512x512', () => {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
    expect(Array.isArray(manifest.icons)).toBe(true)
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2)

    const sizes = manifest.icons.map((icon) => icon.sizes)
    expect(sizes).toContain('192x192')
    expect(sizes).toContain('512x512')

    // Maskable icons support
    const hasMaskable = manifest.icons.some(
      (icon) => icon.purpose && icon.purpose.includes('maskable')
    )
    expect(hasMaskable).toBe(true)

    // Check that every icon file actually exists in public/
    for (const icon of manifest.icons) {
      const iconPath = path.join(PUBLIC_DIR, icon.src.replace(/^\//, ''))
      expect(fs.existsSync(iconPath)).toBe(true)
    }
  })

  it('index.html links to the manifest and defines theme colors for dark and light mode', () => {
    const html = fs.readFileSync(INDEX_HTML_PATH, 'utf8')

    expect(html).toMatch(/<link\s+[^>]*rel=["']manifest["'][^>]*href=["']\/site\.webmanifest["']/)
    expect(html).toMatch(/<meta\s+[^>]*name=["']viewport["']/)

    // Light and dark theme colors
    expect(html).toMatch(/<meta\s+[^>]*name=["']theme-color["'][^>]*media=["']\(prefers-color-scheme:\s*dark\)["']/)
    expect(html).toMatch(/<meta\s+[^>]*name=["']theme-color["'][^>]*media=["']\(prefers-color-scheme:\s*light\)["']/)
  })
})
