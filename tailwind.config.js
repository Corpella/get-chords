module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  content: [
    'components/**/*.vue',
    'layouts/**/*.vue',
    'pages/**/*.vue',
    'plugins/**/*.js',
    'main.ts',
    // TypeScript
    'plugins/**/*.ts',
    'vite.config.ts'
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
