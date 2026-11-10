// Tema chiaro: la scala "neutral" è invertita (950 = fondo chiaro, 50 = quasi nero)
// e "white" è l'inchiostro scuro. Per il testo bianco sopra le immagini si usa text-[#fff].
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      colors: {
        white: '#111111',
        neutral: {
          50: '#121211', 100: '#1c1c1a', 200: '#2a2a27', 300: '#3d3d39', 400: '#55554f',
          500: '#6e6e69', 600: '#8c8c87', 700: '#bdbdb8', 800: '#dadad6', 850: '#e4e4e0',
          900: '#ecece9', 950: '#f5f5f3',
        },
      },
      fontFamily: { sans: ['Geist', 'Inter', 'sans-serif'], mono: ['Geist', 'Inter', 'sans-serif'] },
      animation: { marquee: 'marquee 25s linear infinite' },
      keyframes: { marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } } },
    },
  },
};
