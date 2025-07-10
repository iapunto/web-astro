import globals from 'globals';
import astro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    // Global ignores
    ignores: [
      'node_modules/',
      'dist/',
      'src/components/sections/home/zoho-form.html',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx,astro}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  // Astro
  ...astro.configs['flat/recommended'],

  // TypeScript
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },
];
