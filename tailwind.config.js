module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      colors: { neutral: { 850: '#1f1f1f' } },
      fontFamily: { sans: ['Inter', 'sans-serif'], mono: ['JetBrains Mono', 'monospace'] },
      animation: { marquee: 'marquee 25s linear infinite' },
      keyframes: { marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } } },
    },
  },
};
