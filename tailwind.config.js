/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',                // ✅ au lieu de 'media' (par défaut implicite)
  content: ["./index.html", "./src/**/*.{js,jsx}", "./content/**/*.md"],
  theme: { extend: {} },
  plugins: [require('@tailwindcss/typography')],
}
