import { Config } from 'tailwindcss/types'
import { dark, light } from './src/styles'

const config: Config = {
  content: [
    'src/**/*.{js,ts,jsx,tsx,mdx}',
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          ...light,
        },
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          ...dark,
        },
      },
    ],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}

export default config
