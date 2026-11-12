/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Strict monochrome. There is no brand hue — emphasis is expressed
        // with luminance, weight and scale, the way a printed index works.
        surface: {
          DEFAULT: '#000000',
          card: '#0A0A0A',
          input: '#111111',
          hover: '#161616',
        },
        // `accent` is white. Anything on a solid accent background must use
        // black text; tints (bg-accent/10) are light overlays on dark.
        accent: {
          DEFAULT: '#FFFFFF',
          hover: '#D4D4D4',
          muted: 'rgba(255, 255, 255, 0.08)',
        },
        // Kept as a second neutral so existing markup still resolves.
        ember: {
          DEFAULT: '#A3A3A3',
          muted: 'rgba(163, 163, 163, 0.10)',
        },
        border: {
          DEFAULT: '#1F1F1F',
          light: '#2E2E2E',
        },
        text: {
          primary: '#FAFAFA',
          secondary: '#A1A1A1',
          muted: '#737373',
        },
        // Semantic states are luminance-only; callsites pair them with icons
        // and explicit labels so meaning never depends on hue.
        success: '#A3A3A3',
        error: '#FAFAFA',
        warning: '#D4D4D4',
      },
      fontFamily: {
        display: ['Inter Tight Variable', 'Inter Variable', 'system-ui', 'sans-serif'],
        sans: ['Inter Variable', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono Variable', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        // Square everything. Structure comes from rules, not from radii.
        none: '0px',
        DEFAULT: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
      },
      boxShadow: {
        // No glow. Elevation is a hairline plus a luminance step.
        panel: '0 1px 0 0 rgba(255, 255, 255, 0.04) inset',
        pop: '0 24px 48px -24px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.06)',
      },
    },
  },
  plugins: [],
}
