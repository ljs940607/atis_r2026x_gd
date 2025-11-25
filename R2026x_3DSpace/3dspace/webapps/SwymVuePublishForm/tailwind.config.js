const BREAKPOINTS = require('./src/vendors/swym/config/breakpoints.json')

/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  important: ['.pfc_pfc-main', '.modal-manager_component'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: BREAKPOINTS,
    extend: {
      gridTemplateColumns: {
        'nav-left': '83px minmax(0, 1fr)',
        '2-columns': 'minmax(min-content, calc(0.125 * 100vw + 240px)) minmax(0, calc(100vw - (0.125 * 100vw + 240px) * 1))',
        '3-columns': 'minmax(min-content, max-content) minmax(0, calc(100vw - (0.125 * 100vw + 240px) * 2)) calc(0.125 * 100vw + 240px)',
      },
      width: {
        960: '960px',
      },
      fontSize: {
        '3xs': ['0.5rem', { lineHeight: '1' }],
        '2xs': ['0.625rem', { lineHeight: '1' }],
        'xs': ['0.75rem', { lineHeight: '1' }],
        '2sm': ['0.8125rem', { lineHeight: '1' }],
        'sm': ['0.875rem', { lineHeight: '1' }],
        'md': ['0.9375rem', { lineHeight: '1' }],
        'base': ['1rem', { lineHeight: '1' }],
        'lg': ['1.125rem', { lineHeight: '1' }],
        'xl': ['1.25rem', { lineHeight: '1' }],
        '2xl': ['1.375rem', { lineHeight: '1' }],
        '3xl': ['1.5rem', { lineHeight: '1' }],
        '4xl': ['1.625rem', { lineHeight: '1' }],
        '5xl': ['1.75rem', { lineHeight: '1' }],
        '6xl': ['1.875rem', { lineHeight: '1' }],
        '7xl': ['2.25rem', { lineHeight: '1' }],
        '7.5xl': ['2.625rem', { lineHeight: '1' }],
        '8xl': ['3rem', { lineHeight: '1' }],
        '9xl': ['3.75rem', { lineHeight: '1' }],
        'large': ['1.5em', { lineHeight: '1' }],
        'small': ['0.75em', { lineHeight: '1' }],
        'medium': ['1.2em', { lineHeight: '1' }],

      },
      lineHeight: {
        '3xs': '0.5rem',
        '2xs': '0.625rem',
        'xs': '0.75rem',
        '2sm': '0.8125rem',
        'sm': '0.875rem',
        'md': '0.9375rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.375rem',
        '3xl': '1.5rem',
        '4xl': '1.625rem',
        '5xl': '1.75rem',
        '6xl': '1.875rem',
        '7xl': '2.25rem',
        '7.5xl': '2.625rem',
        '8xl': '3rem',
        '9xl': '3.75rem',
      },
      fontFamily: {
        '3ds': ['"3ds"', 'sans-serif'],
      },
      colors: {
        /* content type colors ----------------------- */
        'color-message': 'var(--color-blue-4)',
        'color-post': 'var(--color-grey-7)',
        'color-media': 'var(--color-violet-dv-1)',
        'color-wedo': 'var(--color-blue-4)',
        'color-conference': '#de0860',
        'color-idea': 'var(--color-cyan-1)',
        'color-question': '#e7b401',
        'color-wiki': 'var(--color-turquoise-dv-0)',
        'color-survey': 'var(--color-orange-1)',

        'wedo-open': 'var(--color-blue-dv-4)',
        'wedo-inprogress': 'var(--color-cyan-1)',
        'wedo-done': 'var(--color-green-1)',

        /** CKEditor markers colors - update them in rich-description too, thank you Outlook */
        'marker-yellow': '#ffff00',
        'marker-pink': '#f8afc7',
        'marker-blue': '#c3deff',
        'marker-green': '#a3f1be',

        /* UIKIT colors ----------------------- */
        'grey-0': '#f9f9f9', /* background grey */
        'grey-1': '#f4f5f6', /* section grey */
        'grey-2': '#f1f1f1', /* footer grey */
        'grey-3': '#e2e4e3', /* outline grey */
        'grey-4': '#d1d4d4', /* outline dark grey */
        'grey-5': '#b4b6ba', /* icon grey */ // no more for icons.
        'grey-6': '#77797c', /* copy grey */
        'grey-7': '#3d3d3d', /* dark grey */
        'grey-8': '#191919', /* copy black */

        'blue-0': '#d5e8f2', /* light steel */
        'blue-0-1': '#92c7e8', /* blue rdv badge */
        'blue-1': '#78befa', /* light blue */
        'blue-2': '#42a2da', /* medium blue */
        'blue-3': '#368ec4', /* link, dark blue */
        'blue-4': '#005686', /* 3ds corporate steel blue */
        'blue-5': '#003c5a', /* dark steel */

        'green-0': '#edf6eb', /* light green */
        'green-1': '#57b847', /* medium green */
        'green-2': '#477738', /* dark green */

        'red-0': '#fff0ee', /* light red */
        'red-1': '#ea4f37', /* medium red */
        'red-2': '#844138', /* dark red */

        'orange-0': '#fff3e9', /* light orange */
        'orange-1': '#e87b00', /* medium orange */
        'orange-2': '#8f4c00', /* dark orange */

        'cyan-0': '#f2f5f7', /* light cyan */
        'cyan-1': '#00b8de', /* medium cyan */
        'cyan-2': '#0087a3', /* dark cyan */

        /* complex status colors --------- */

        // these should be used with parcimony,
        // when ui is rich and existing color palette has reached its limits.

        'green-0-1': '#d3f4cb', /* medium light green */
        'green-0-2': '#a2e88e', /* dark light green */

        'yellow-0': '#fcf2c8', /* light yellow */
        'yellow-0-1': '#fff792', /* medium light yellow */
        'yellow-0-2': '#ffe164', /* dark light yellow */
        'yellow-1': '#ffce00', /* medium yellow */
        'yellow-2': '#ce9509', /* dark yellow */

        'red-0-1': '#ffd2cf', /* medium light red */
        'red-0-2': '#ff8a8a', /* dark light red */

        'burgundy-0': '#ba7d7d', /* light burgundy */
        'burgundy-0-1': '#b55050', /* medium light burgundy */
        'burgundy-0-2': '#d80e0e', /* dark light burgundy */
        'burgundy-1': '#990707', /* medium burgundy */
        'burgundy-2': '#3f0202', /* dark burgundy */

        'orange-0-1': '#fcd5b9', /* medium light orange */
        'orange-0-2': '#ffaa71', /* dark light orange */

        'cyan-0-1': '#d1e7f2', /* medium light cyan */
        'cyan-0-2': '#007da3',
        /* dark medium cyan */

        /* data visualization colors ------------------ */
        'yellow-dv-0': '#fee000',
        'blue-dv-0': '#009ddb',
        'orange-dv-0': '#ff8a2e',
        'violet-dv-0': '#9b2c98',
        'turquoise-dv-0': '#00aa86',
        'pink-dv-0': '#f564a3',
        'blue-dv-1': '#8ddee4',
        'red-dv-0': '#cc092f',
        'gray-dv-0': '#e2d5cc',
        'green-dv-0': '#6fbc4b',
        'violet-dv-1': '#70036b',
        'blue-dv-2': '#002596',
        'khaki-dv-0': '#c6c68b',
        'gray-dv-1': '#7f7f7f',
        'blue-dv-3': '#4ea8b7',
        'green-dv-1': '#007a4c',
        'gray-dv-2': '#adadad',
        'turquoise-dv-1': '#127277',
        'brown-dv-0': '#6d2815',
        'black-dv-0': '#000000',
        'blue-dv-4': '#4d62ba',
      },
      animation: {
        'slide-bottom-to-top': 'slide-bottom-to-top 0.5s ease forwards',
        'spin-reverse': 'spin 1s linear infinite reverse',
      },
      keyframes: {
        'slide-bottom-to-top': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
      },
      spacing: {
        '1': '0.25em',
        '1x': '0.4em',
        '2x': '0.6em',

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
