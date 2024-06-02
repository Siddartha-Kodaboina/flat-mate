/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '400px',
      },
      backgroundImage: {
        'bg-cb': 'linear-gradient(96deg, #53b2fe, #065af3)',
      },

    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

