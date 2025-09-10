/** @type {import('tailwindcss').Config} */
const path = require('path')
function loadTokenExtend(){
  try {
    const p = path.join(__dirname, 'public', 'snippets', 'tailwind.tokens.config.js')
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const mod = require(p)
    return (mod && mod.theme && mod.theme.extend) ? mod.theme.extend : {}
  } catch (_) { return {} }
}
const tokenExtend = loadTokenExtend()

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // include all token extensions first
      ...(tokenExtend || {}),
      // then merge/override specific sections to keep project styles
      colors: {
        ...(tokenExtend.colors || {}),
        brand: {
          orange: '#FF6B35',
          dark: '#0F0F0F',
          gray: '#1A1A1A',
        },
      },
      fontFamily: {
        ...(tokenExtend.fontFamily || {}),
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        ...(tokenExtend.animation || {}),
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        ...(tokenExtend.keyframes || {}),
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

