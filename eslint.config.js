// eslint.config.js — Flat config ESLint v9
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  // Ignorer les sorties/tiers
  { ignores: ['dist/**', 'node_modules/**', 'public/**'] },

  // Règles JS de base
  js.configs.recommended,

  // Règles pour nos sources React
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    // ⛔️ ICI on fournit un OBJET, pas un tableau de strings
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      // React
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-vars': 'error',

      // Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // JS (optionnel)
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
    settings: { react: { version: 'detect' } },
  },

  // (Optionnel) Si tu veux neutraliser les règles en conflit avec Prettier,
  // dé-commente ces 2 lignes après avoir `npm i -D eslint-config-prettier` :
  // import prettier from 'eslint-config-prettier'
  // prettier,
]
