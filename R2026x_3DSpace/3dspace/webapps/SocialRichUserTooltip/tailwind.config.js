const { BREAKPOINTS } = require('@ds/swymkit/utils')

/**
 * @type {import('tailwindcss').Config}
 * @see https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/config.full.js
 */
module.exports = {
  important: '.srut_popover',
  corePlugins: {
    preflight: false,
  },
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: BREAKPOINTS,
    spacing: {
      0: '0px',
      0.5: '0.125em',
      1: '0.25em',
      1.5: '0.375em',
      2: '0.5em',
      2.5: '0.625em',
      3: '0.75em',
      3.5: '0.875em',
      4: '1em',
      6: '1.5em',
    },
    gap: ({ theme }) => theme('spacing'),
    fontSize: {
      'xs': ['0.75em', { lineHeight: '1' }],
      'sm': ['0.8125em', { lineHeight: '1' }],
      'base': ['1em', { lineHeight: '1' }],
      'xl': ['1.25em', { lineHeight: '1' }],
      '3xl': ['1.5em', { lineHeight: '1' }],
    },
    maxHeight: {
      big: '84px',
    },
    borderRadius: {
      none: '0px',
      md: '0.375em',
      full: '9999px',
    },
    extend: {
      fontFamily: {
        '3ds': ['"3ds"', 'sans-serif'],
      },
      colors: {
        /* UIKIT colors ----------------------- */
        'grey-1': '#f4f5f6', /* section grey */
        'grey-8': '#191919', /* copy black */

        'blue-4': '#005686', /* 3ds corporate steel blue */

        'blue-5': '#003c5a', /* dark steel */

        'red-1': '#ea4f37', /* medium red */

        'orange-1': '#e87b00', /* medium orange */
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      function extractColorVars(colorObj, colorGroup = '') {
        return Object.keys(colorObj)
          .reduce((vars, colorKey) => {
            const value = colorObj[colorKey]

            const newVars
            = typeof value === 'string'
              ? { [`--color${colorGroup}-${colorKey}`]: value }
              : extractColorVars(value, `-${colorKey}`)
            return { ...vars, ...newVars }
          }, {})
      }
      addBase({
        ':root': extractColorVars(theme('colors')),
      })
    },
  ],
  safelist: [
    'bg-red-1',
  ],
}
