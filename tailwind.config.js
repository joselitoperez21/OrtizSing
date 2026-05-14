/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#060816',
        panel: 'rgba(15, 23, 42, 0.55)',
        glow: '#22d3ee',
      },
      boxShadow: {
        glass: '0 10px 40px rgba(8, 16, 42, 0.45)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
