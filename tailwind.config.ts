import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E4B85',
          dark: '#1A325C',
        },
        secondary: {
          DEFAULT: '#64748b',
          dark: '#475569',
        },
        background: {
          DEFAULT: '#ffffff',
          light: '#f8fafc',
          dark: '#f1f5f9',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-roboto-mono)'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
  daisyui: {
    themes: ["light"],
  },
} satisfies Config;

export default config;
