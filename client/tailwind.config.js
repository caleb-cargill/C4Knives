module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0C10', // Deep charcoal black
        primary: '#556B2F', // Tactical green
        secondary: '#1F2833', // Gunmetal grey
        highlight: '#556B2F', // Tactical green
        olive: '#556B2F', // Tactical green
        danger: '#C3073F', // Aggressive red
        text: '#C5C6C7', // Light grey
        muted: '#6B6E70', // Subtext
        complement: '#802F3A', // Deep Crimson
      },
    },
  },
  plugins: [],
} 