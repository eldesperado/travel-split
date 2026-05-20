/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          app:   '#f6f4ee',
          panel: '#fffdf8',
          row:   '#fbf8ef',
        },
        forest: {
          DEFAULT: '#244732',
          soft:    '#3f6f56',
          pill:    '#e1eadf',
        },
        ink: {
          primary: '#172018',
          muted:   '#465145',
          subtle:  '#667064',
        },
        stone:    '#e8e2d2',
        positive: '#1e6b43',
        negative: '#a33d2d',
        'border-default': '#d8d3c3',
        'border-row':     '#e2ddcf',
        'border-input':   '#c9c4b6',
        'border-dashed':  '#cac1ac',
        'ios-gray':       '#8E8E93',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body:    ['DM Sans', 'ui-sans-serif', 'sans-serif'],
        mono:    ['DM Mono', 'SF Mono', 'monospace'],
      },
      borderRadius: {
        '2.5xl': '20px',
        '4xl':   '28px',
        '5xl':   '36px',
      },
      boxShadow: {
        panel: '0 1px 3px rgb(23 32 24 / .05), 0 6px 20px rgb(23 32 24 / .07)',
      },
    },
  },
  plugins: [],
};
