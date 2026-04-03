/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    // Disable Tailwind's base reset (preflight) to prevent conflicts
    // with the existing custom CSS design system
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
