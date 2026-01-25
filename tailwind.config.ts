import type { Config } from 'tailwindcss'

export default {
    important: true,
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            animation: {
                'fade-in': 'fade-in 0.5s ease-out',
                'slide-in-up': 'slide-in-up 0.5s ease-out',
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'slide-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
} satisfies Config
