export default {
  theme: {
    extend: {
      fontFamily: { mono: ['"Geist Mono"', 'monospace'] },
      colors: {
        bg:      '#0d1117',
        bg2:     '#161b22',
        bg3:     '#010409',
        border:  '#21262d',
        border2: '#30363d',
        amber:   '#f0a832',
        amber2:  '#c47d0e',
        teal:    '#6b82a8',
        teal2:   '#4e6488',
        text:    '#e6edf3',
        body:    '#c9d1d9',
        muted:   '#8b949e',
        dim:     '#484f58',
        faint:   '#21262d',
      },
      animation: {
        blink:  'blink 1s step-end infinite',
        pulse2: 'pulse2 2s ease-in-out infinite',
      },
      keyframes: {
        blink:  { '50%': { opacity: '0' } },
        pulse2: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.3' } },
      },
    },
  },
}
