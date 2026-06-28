import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-cairo)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"]
      },
      colors: {
        cream: {
          50: "#faf8f5",
          100: "#f5f1ea",
          200: "#e8dfd3",
          300: "#d4c5b0"
        },
        brand: {
          50: "#f8f6f3",
          100: "#ebe5dc",
          200: "#d4c5b0",
          300: "#bca48a",
          400: "#a78566",
          500: "#8b6f4e",
          600: "#6f5a3e",
          700: "#544432",
          800: "#3a2e25",
          900: "#1a2942"
        },
        accent: {
          50: "#fdfbf7",
          100: "#f5f1ea",
          200: "#e8dfd3",
          300: "#d4c5b0",
          400: "#c9a876",
          500: "#b08f5d",
          600: "#8e7449",
          700: "#6b5836",
          800: "#473b24",
          900: "#241d12"
        },
        sage: {
          50: "#f5f7f4",
          100: "#e1e8df",
          200: "#c3d1c0",
          300: "#a4b9a1",
          400: "#8b9d83",
          500: "#6f8267",
          600: "#586853",
          700: "#424e3f"
        },
        charcoal: {
          50: "#f5f5f5",
          100: "#e0e0e0",
          200: "#bdbdbd",
          300: "#9e9e9e",
          400: "#757575",
          500: "#666666",
          600: "#525252",
          700: "#404040",
          800: "#2c2c2c",
          900: "#1a1a1a"
        }
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(26, 41, 66, 0.08)",
        elegant: "0 8px 30px -4px rgba(26, 41, 66, 0.12)",
        gold: "0 4px 20px -2px rgba(201, 168, 118, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;