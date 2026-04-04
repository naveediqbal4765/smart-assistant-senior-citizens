// ============================================================
// tailwind.config.js - Tailwind CSS Configuration
// Green theme matching UserInterface1.png & UserInterface2.png
// ============================================================

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        // ---- Primary Green Palette (from UI screenshots) ----
        green: {
          bg: "#d4edda",        // Outer page background (light mint)
          card: "#b8dfc4",      // Card/form background (medium mint)
          cardLight: "#c8e6c9", // Slightly lighter card variant
          dark: "#2d6a4f",      // Dark green for text/borders
          medium: "#52b788",    // Medium green for accents
          light: "#e8f5e9",     // Very light green for hover states
          navbar: "#1b4332",    // Dark green navbar
          tab: "#2d6a4f",       // Active tab background
        },
        // ---- Accent ----
        accent: {
          DEFAULT: "#e63946",   // Red heart color (from logo)
          hover: "#c1121f",
        },
        // ---- Neutral ----
        text: {
          dark: "#1a1a1a",      // Primary text
          medium: "#4a4a4a",    // Secondary text
          light: "#6b7280",     // Placeholder text
          green: "#2d6a4f",     // Green text (Lorem Ipsum label)
        },
        // ---- Input fields ----
        input: {
          bg: "#ffffff",        // White input background
          border: "#a8d5b5",    // Light green border
          focus: "#52b788",     // Focus border color
        },
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "Arial", "sans-serif"],
      },
      fontSize: {
        // Larger sizes for senior accessibility
        "xs-senior": ["0.875rem", { lineHeight: "1.4" }],   // 14px
        "sm-senior": ["1rem", { lineHeight: "1.5" }],        // 16px
        "base-senior": ["1.125rem", { lineHeight: "1.6" }],  // 18px
        "lg-senior": ["1.25rem", { lineHeight: "1.6" }],     // 20px
        "xl-senior": ["1.5rem", { lineHeight: "1.4" }],      // 24px
        "2xl-senior": ["1.875rem", { lineHeight: "1.3" }],   // 30px
        "3xl-senior": ["2.25rem", { lineHeight: "1.2" }],    // 36px
      },
      borderRadius: {
        card: "20px",    // Card border radius (from UI)
        input: "8px",    // Input field border radius
        btn: "10px",     // Button border radius
        full: "9999px",  // Fully rounded
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.10)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.15)",
        input: "inset 0 1px 3px rgba(0,0,0,0.06)",
      },
      minHeight: {
        touch: "48px",    // Minimum touch target for seniors
        "touch-lg": "56px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.35s ease-out",
        "shake": "shake 0.4s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(24px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px)" },
          "40%": { transform: "translateX(6px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
      },
    },
  },
  plugins: [],
};
