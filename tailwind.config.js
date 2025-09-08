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
        hero: ['"Jacquard 12"', 'ui-serif', 'Georgia', 'serif'],
        medieval: ['"MedievalSharp"', 'cursive'],
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}