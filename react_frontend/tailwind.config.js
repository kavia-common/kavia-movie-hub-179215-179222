/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8B5CF6",   // Royal Purple primary
        secondary: "#6B7280", // Slate/Gray for accents
        success: "#10B981",
        error: "#EF4444",
        background: "#F3E8FF",
        surface: "#FFFFFF",
        text: "#374151"
      },
      gradientColorStops: {
        'royal-start': '#E9D5FF', // purple-200
        'royal-end': '#D8B4FE'    // purple-300
      }
    },
  },
  plugins: [],
};
