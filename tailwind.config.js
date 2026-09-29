/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./{src,datos,negocio,presentacion}/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Avenir Next', 'Aptos', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};