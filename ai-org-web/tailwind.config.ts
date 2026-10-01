import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 黑底色阶（Ink）
        ink: {
          950: '#080808',
          900: '#0a0a0a',
          800: '#101010',
          700: '#181818',
          600: '#222222',
          500: '#2a2a2a',
          400: '#3a3a3a',
          300: '#4a4a4a',
          200: '#6a6a6a',
          100: '#9a9a9a',
          50: '#d4d4d4'
        },
        // 米金色调（Gold accent）
        gold: {
          950: '#3d2f0a',
          900: '#5c4612',
          800: '#7a5d1a',
          700: '#a17a25',
          600: '#c9a030',
          500: '#d4af37',  // 主色 - 米金
          400: '#dcc05a',
          300: '#e5d084',
          200: '#eddfae',
          100: '#f5edd5',
          50: '#fbf7e8'
        },
        // 辅助色（极少使用）
        accent: {
          ember: '#d97a3a',
          jade: '#3a9a7a',
          ink: '#1a1a1a'
        }
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
        display: ['"PingFang SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace']
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.25rem, 5vw, 4rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.75rem, 3.5vw, 2.75rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }]
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem'
      },
      maxWidth: {
        'reading': '720px',
        'wide': '1320px'
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-down': 'fadeDown 0.8s ease-out forwards',
        'fade-right': 'fadeRight 0.8s ease-out forwards',
        'fade-left': 'fadeLeft 0.8s ease-out forwards',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeRight: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        fadeLeft: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' }
        }
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #f5edd5 50%, #d4af37 100%)',
        'gold-fade': 'linear-gradient(180deg, rgba(212,175,55,0.0) 0%, rgba(212,175,55,0.08) 100%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
        'grid-pattern': "linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px)"
      },
      backgroundSize: {
        'grid-lg': '64px 64px'
      },
      boxShadow: {
        'gold-glow': '0 0 40px -10px rgba(212, 175, 55, 0.3)',
        'gold-glow-lg': '0 0 80px -20px rgba(212, 175, 55, 0.4)',
        'card': '0 4px 32px -8px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 48px -8px rgba(212, 175, 55, 0.15)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
} satisfies Config
