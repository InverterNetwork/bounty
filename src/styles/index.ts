export const { initialTheme, light, dark } = {
  initialTheme: 'dark' as 'light' | 'dark',
  light: {
    primary: '#86EFAC',
    secondary: '#ECFDF5',
    accent: '#4ADE80',
    neutral: '#A7C3B8',
    'base-100': 'white',
    'base-200': '#ECFDF5',
    'base-300': '#D1FAE5',
  },

  dark: {
    primary: '#00aeef',
    'primary-focus': '#6ad4fb',
    'primary-content': '#201047',

    secondary: '#00B99F',
    'secondary-focus': '#12c17d',
    'secondary-content': '#201047',

    accent: '#ed0b70',
    'accent-focus': '#fb74b1',
    'accent-content': '#201047',

    neutral: '#20134e',
    'neutral-focus': '#392373',
    'neutral-content': '#f9f7fd',

    'base-100': '#1B0D2A',
    'base-200': '#392373',
    'base-300': '#A5B9F6',
    'base-content': '#f9f7fd',

    info: '#4fbff3',
    success: '#71ead2',
    warning: '#f3cc30',
    error: '#e13d53',

    '--rounded-box': '1rem',
    '--rounded-btn': '.5rem',
    '--rounded-badge': '1.9rem',

    '--animation-btn': '.25s',
    '--animation-input': '.2s',

    '--btn-text-case': 'uppercase',
    '--navbar-padding': '.5rem',
    '--border-btn': '1px',
  },
}
