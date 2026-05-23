/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{app,components,libs,pages,hooks}/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F172A',
          soft: '#F1F5F9',
          light: '#475569',
          dark: '#020617',
        },
        accent: {
          DEFAULT: '#1E293B',
          muted: '#CBD5E1',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#FAFAFA',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        handwriting: ['Pacifico', 'cursive'],
      },
    },
  },
  plugins: [],
}

