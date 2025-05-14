/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                Almarai: ["Almarai", "sans-serif"],
                Reem: ["Reem Kufi", "sans-serif"],
                Poppins: ["Poppins", "sans-serif"],
            },
            colors: {
                Red: "#c40000",
                blackText: "#414141",
                mainColor: "#c40000",
            },
        },
        screens: {
            mobile: "425px",
            tablet: "768px",
            laptop: "1024px",
            desktop: "1280px",
        },
    },
    plugins: [],
};
