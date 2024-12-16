/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./screens/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    // "./src/App.{js,jsx,ts,tsx}", // App component
    // "./src/screens/**/*.{js,jsx,ts,tsx}", // All files within screens directory
    "./src/screens/*.{js,jsx,ts,tsx}",  // All direct files in screens directory (optional)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
