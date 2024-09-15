/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

export default {
    darkMode: 'class',
    purge: {
        content: ['./src/**/*.astro', './src/**/*.tsx'],
        options: {
            safelist: [
                { pattern: /(col-start|col-end)-./, variants: ['', 'sm', 'md', 'lg'] },
                { pattern: /left-\d{1,2}/, variants: ['', 'sm', 'md', 'lg'] }
            ]
        }
    },
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue}'],
    theme: {
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            white: {
                50: 'rgba(255,255,255,0.05)',
                100: 'rgba(255,255,255,0.1)',
                200: 'rgba(255,255,255,0.2)',
                300: 'rgba(255,255,255,0.3)',
                400: 'rgba(255,255,255,0.4)',
                500: 'rgba(255,255,255,0.5)',
                600: 'rgba(255,255,255,0.6)',
                700: 'rgba(255,255,255,0.7)',
                800: 'rgba(255,255,255,0.8)',
                900: 'rgba(255,255,255,0.9)',
                950: 'rgba(255,255,255,0.95)',
                DEFAULT: 'rgba(255,255,255,1)'
            },
            black: {
                30: 'rgba(0,0,0,0.03)',
                50: 'rgba(0,0,0,0.05)',
                100: 'rgba(0,0,0,0.1)',
                200: 'rgba(0,0,0,0.2)',
                300: 'rgba(0,0,0,0.3)',
                400: 'rgba(0,0,0,0.4)',
                500: 'rgba(0,0,0,0.5)',
                600: 'rgba(0,0,0,0.6)',
                700: 'rgba(0,0,0,0.7)',
                800: 'rgba(0,0,0,0.8)',
                900: 'rgba(0,0,0,0.9)',
                950: 'rgba(0,0,0,0.95)',
                DEFAULT: 'rgba(0,0,0,1)'
            },
            neutral: colors.slate,
            grey: colors.zinc,
            red: {
                light: '#ffc1bb',
                DEFAULT: '#FF8477',
                dark: '#7F423B'
            },
            green: {
                light: '#b4e7ce',
                DEFAULT: '#6AD09D',
                dark: '#35684E'
            },
            blue: {
                light: '#b3cdfb',
                DEFAULT: '#689BF7',
                dark: '#344D7B'
            },
            yellow: {
                light: '#ffe37f',
                DEFAULT: '#FFC700',
                dark: '#7F6300'
            },
            lilac: {
                light: '#e2dcff',
                DEFAULT: '#C6B9FF',
                dark: '#635C7F'
            }
        },
        fontFamily: {
            sans: ['apercu', ...defaultTheme.fontFamily.sans],
            mono: ['Fira Mono', ...defaultTheme.fontFamily.mono]
        },
        fontSize: {
            '3xl': ['5rem', '1.05'],
            '2xl': ['3.5rem', '1.2'],
            xl: ['2.5rem', '1.3'],
            lg: ['1.875rem', '1.5'],
            md: ['1.5rem', '1.5'],
            base: ['1.125rem', '1.5'],
            sm: ['1rem', '1.5'],
            xs: ['0.875rem', '1.5'],
            '2xs': ['0.8rem', '1.5']
        },
        extend: {
            screens: {
                xs: '480px',
                'lg-with-padding': '1088px'
            }
        }
    },
    plugins: [require('@whiterussianstudio/tailwind-easing')]
};
