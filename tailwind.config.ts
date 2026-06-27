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
        // ألوان جديدة - Elegant & Warm
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
          900: "#1a2942" // Navy Dark
        },
        accent: {
          50: "#fdfbf7",
          100: "#f5f1ea",
          200: "#e8dfd3",
          300: "#d4c5b0",
          400: "#c9a876", // Warm Gold
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
          400: "#8b9d83", // Sage Green
          500: "#6f8267",
          600: "#586853",
          700: "#424e3f",
          800: "#2c352a",
          900: "#161b15"
        },
        cream: {
          50: "#faf8f5",
          100: "#f5f1ea",
          200: "#e8dfd3",
          300: "#d4c5b0"
        },
        charcoal: {
          50: "#f5f5f5",
          100: "#e0e0e0",
          500: "#666666",
          800: "#2c2c2c",
          900: "#1a1a1a"
        }
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(26, 41, 66, 0.08)",
        elegant: "0 8px 30px -4px rgba(26, 41, 66, 0.12)",
        gold: "0 4px 20px -2px rgba(201, 168, 118, 0.25)"
      },
      backgroundImage: {
        "gradient-cream": "linear-gradient(135deg, #faf8f5 0%, #e8dfd3 100%)",
        "gradient-navy": "linear-gradient(135deg, #1a2942 0%, #2c3e5a 100%)",
        "gradient-gold": "linear-gradient(135deg, #c9a876 0%, #b08f5d 100%)",
        "gradient-sage": "linear-gradient(135deg, #8b9d83 0%, #6f8267 100%)"
      }
    }
  },
  plugins: []
};

export default config;