import defaultTheme from 'tailwindcss/defaultTheme.js'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        sm: '2rem',
        md: '2.5rem',
        lg: '4rem',
      },
    },
    extend: {
      fontFamily: {
        sans: [...defaultTheme.fontFamily.sans],
        display: [...defaultTheme.fontFamily.sans],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
    },
  },
  plugins: [typography],
}
