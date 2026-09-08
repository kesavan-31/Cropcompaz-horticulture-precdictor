/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#1B4D3E",
          sidebar: "#163B2F",
          lime: "#B4F042",
          limeHover: "#A1E02F",
          cream: "#FAF8F5",
          card: "#FFFFFF",
          textDark: "#0F291E",
          subtleText: "#64748B",
          border: "#E2E8F0",
          tagBg: "#EBFBEE",
          tagText: "#15803D"
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem'
      }
    },
  },
  plugins: [],
}
