/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      // Colores personalizados (reemplaza `colors.css`)
      colors: {
        primary: {
          DEFAULT: '#E51F52',
          600: '#c71a48', // A slightly darker shade for 600
          700: '#a8153e', // Even darker for hover states
        },
        secondary: {
          DEFAULT: '#c71a48',
          600: '#a8153e', // A slightly darker shade for 600
          700: '#8a1133', // Even darker for hover states
        },
        'gray-light': '#F9FAFB', // Fondo claro
        'gray-dark': '#1F2937', // Texto oscuro
      },
      // Tipografía fluida
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
      },
      // Espaciado personalizado
      spacing: {
        128: '32rem',
        144: '36rem',
      },
      // Responsive breakpoints
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      // Sombras personalizadas
      boxShadow: {
        'custom-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'custom-lg':
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [
    require('flowbite/plugin'), // Plugin oficial de Flowbite
    require('@tailwindcss/typography'), // Para estilos de texto avanzados)
  ],
};
