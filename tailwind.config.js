/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,ts}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // Purple Primary Brand Color
                primary: {
                    50: "#faf5ff",
                    100: "#f3e8ff",
                    200: "#e9d5ff",
                    300: "#d8b4fe",
                    400: "#c084fc",
                    500: "#a855f7", // Main brand purple
                    600: "#9333ea",
                    700: "#7e22ce",
                    800: "#6b21a8",
                    900: "#581c87",
                    950: "#3b0764",
                },
                // Light Mode Colors
                light: {
                    bg: {
                        primary: "#ffffff",
                        secondary: "#f8fafc",
                        tertiary: "#f1f5f9",
                    },
                    surface: {
                        primary: "#ffffff",
                        secondary: "#f8fafc",
                        elevated: "#ffffff",
                    },
                    border: {
                        primary: "#e2e8f0",
                        secondary: "#cbd5e1",
                        accent: "#c084fc",
                    },
                    text: {
                        primary: "#0f172a",
                        secondary: "#475569",
                        tertiary: "#64748b",
                        inverse: "#ffffff",
                    },
                },
                // Dark Mode Colors (Pure Black Based)
                dark: {
                    bg: {
                        primary: "#000000",
                        secondary: "#000000",
                        tertiary: "#0a0a0a",
                    },
                    surface: {
                        primary: "#000000",
                        secondary: "#000000",
                        elevated: "#0a0a0a",
                    },
                    border: {
                        primary: "#1a1a1a",
                        secondary: "#0f0f0f",
                        accent: "#9333ea",
                    },
                    text: {
                        primary: "#ffffff",
                        secondary: "#e5e5e5",
                        tertiary: "#d4d4d4",
                        inverse: "#000000",
                    },
                },
            },
            boxShadow: {
                // Light Mode Shadows (Soft, Airy)
                "soft-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 3px 0 rgba(0, 0, 0, 0.06)",
                "soft-md": "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
                "soft-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
                "soft-xl": "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
                "soft-2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
                "purple-glow": "0 0 20px rgba(168, 85, 247, 0.3)",
                "purple-glow-lg": "0 0 40px rgba(168, 85, 247, 0.4)",
                // Dark Mode Shadows (Futuristic, High Contrast - Pure Black)
                "dark-sm": "0 1px 2px 0 rgba(0, 0, 0, 1), 0 0 0 1px rgba(168, 85, 247, 0.15)",
                "dark-md": "0 4px 6px -1px rgba(0, 0, 0, 1), 0 0 0 1px rgba(168, 85, 247, 0.2)",
                "dark-lg": "0 10px 15px -3px rgba(0, 0, 0, 1), 0 0 0 1px rgba(168, 85, 247, 0.25)",
                "dark-xl": "0 20px 25px -5px rgba(0, 0, 0, 1), 0 0 0 1px rgba(168, 85, 247, 0.3)",
                "dark-glow": "0 0 20px rgba(168, 85, 247, 0.6), 0 0 40px rgba(168, 85, 247, 0.3), inset 0 0 0 1px rgba(168, 85, 247, 0.2)",
                "dark-glow-lg": "0 0 40px rgba(168, 85, 247, 0.7), 0 0 80px rgba(168, 85, 247, 0.4), inset 0 0 0 1px rgba(168, 85, 247, 0.3)",
            },
            borderRadius: {
                xs: "0.25rem",
                sm: "0.375rem",
                DEFAULT: "0.5rem",
                md: "0.625rem",
                lg: "0.75rem",
                xl: "1rem",
                "2xl": "1.25rem",
                "3xl": "1.5rem",
            },
            transitionTimingFunction: {
                smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
                "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            },
            transitionDuration: {
                fast: "150ms",
                normal: "200ms",
                slow: "300ms",
            },
            spacing: {
                18: "4.5rem",
                88: "22rem",
            },
            fontFamily: {
                sans: ["BalooThambi2", "sans-serif"],
            },
            backdropBlur: {
                xs: "2px",
            },
        },
    },
    plugins: [],
};
