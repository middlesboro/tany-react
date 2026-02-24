/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tany-green': '#218e53',
        'tany-red': '#d9534f',
        'tany-yellow': '#F7B900',
        'tany-grey': '#f6f6f6',
        'tany-dark-grey': '#333333',
        'ps-sidebar': '#252932',
        'ps-content-bg': '#F1F1F1',
        'ps-primary': '#25B9D7',
        'ps-primary-hover': '#1E94AB',
        'ps-text': '#363A41',
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1280px', // Limit max width to match reference roughly
        },
      },
    },
  },
  plugins: [],
}
