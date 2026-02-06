import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'carbon': '#1A1A1A',
        'carbon-light': '#242424',
        'off-white': '#F5F5F5',
        'forest-green': '#2D4033',
        'forest-green-light': '#3A5A40',
        'arcteryx-blue': '#004A7C',
        'arcteryx-cyan': '#00B2A9',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
