/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        terminal: {
          canvas: "#07080c",
          surface: "#0e1016",
          raised: "#14161f",
          border: "rgba(255, 255, 255, 0.07)",
          muted: "#8b92a8",
        },
      },
      boxShadow: {
        card: "0 0 0 1px rgba(255,255,255,0.06), 0 16px 48px -12px rgba(0,0,0,0.55)",
        "card-glow":
          "0 0 0 1px rgba(34,211,238,0.12), 0 20px 50px -15px rgba(0,0,0,0.6)",
      },
      keyframes: {
        "ticker-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "ticker-scroll": "ticker-scroll 42s linear infinite",
      },
    },
  },
  plugins: [],
}