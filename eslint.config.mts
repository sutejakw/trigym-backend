import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js, prettier: require('eslint-plugin-prettier') },
    extends: ['js/recommended', 'plugin:prettier/recommended'],
    rules: {
      'prettier/prettier': 'warn',
    },
  },
  tseslint.configs.recommended,
])
