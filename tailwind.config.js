/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',                // ✅ au lieu de 'media' (par défaut implicite)
  content: [
    "./index.html", 
    "./src/**/*.{js,jsx}", 
    "./content/**/*.md"
  ],
  theme: {
    extend: {
      fontFamily: {
        hero: ['"Cinzel Decorative"', 'ui-serif', 'Georgia', 'serif'],
        medieval: ['"MedievalSharp"', 'cursive'],
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}