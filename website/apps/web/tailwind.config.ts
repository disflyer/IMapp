/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',  /* IE and Edge */
          'scrollbar-width': 'none',  /* Firefox */
        },
        '.no-scrollbar::-webkit-scrollbar': {
          'display': 'none'  /* Chrome, Safari, and Opera */
        },
      }, ['responsive']);
    }
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
      },
      animation: {
        'text-gradient': 'text-gradient 4s linear 0s infinite normal forwards running',
      },
      screens: {
        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      },
    }
  },
  darkMode: "class",
}
export default config;