/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        sap: {
          blue: '#0083cb',
          gold: '#f0ab00',
          dark: '#354a5f',
          light: '#f2f2f2'
        }
      }
    },
  },
  plugins: [],
}
