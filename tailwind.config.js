/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["BalooThambi2", "sans-serif"],
            },
            colors: {
                primary: "#330c2b",
                secondary: "#b4d49c",
                tertiary: "#f4fcc4",
            },
        },
    },
    plugins: [],
};
