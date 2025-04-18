/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3b82f6', // Azul moderno
          dark: '#60a5fa',
        },
        background: {
          light: '#f9fafb', // Fondo claro más suave
          dark: '#1f2937',
        },
        text: {
          light: '#111827', // Texto oscuro más elegante
          dark: '#e5e7eb',
        },
        accent: '#10b981', // Verde para detalles
      },
      boxShadow: {
        'soft': '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
}