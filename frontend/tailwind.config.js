// ============================================================
// tailwind.config.js - Tailwind CSS Configuration
// Custom theme for senior-friendly high-contrast UI
// ============================================================

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan all React component files for class names
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],

  theme: {
    extend: {
      // ---- Custom Color Palette (Senior-Friendly High Contrast) ----
      colors: {
        primary: {
          DEFAULT: "#1a1a2e",  // Deep navy - main brand color
          light: "#16213e",    // Slightly lighter navy
          dark: "#0f0f1a",     // Darker navy for hover states
        },
        accent: {
          DEFAULT: "#e94560",  // Vibrant red-pink for CTAs and alerts
          light: "#ff6b6b",    // Lighter red for hover
          dark: "#c73652",     // Darker red for active states
        },
        success: "#22c55e",    // Green for success states
        warning: "#f59e0b",    // Amber for warnings
        danger: "#ef4444",     // Red for errors/danger
        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },

      // ---- Custom Font Sizes (Larger for seniors) ----
      fontSize: {
        "senior-sm": ["1rem", { lineHeight: "1.5rem" }],      // 16px - minimum readable
        "senior-base": ["1.125rem", { lineHeight: "1.75rem" }], // 18px - body text
        "senior-lg": ["1.25rem", { lineHeight: "1.875rem" }],  // 20px - important text
        "senior-xl": ["1.5rem", { lineHeight: "2rem" }],       // 24px - headings
        "senior-2xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px - large headings
      },

      // ---- Custom Spacing for larger touch targets ----
      spacing: {
        "touch": "48px",   // Minimum touch target size for seniors (48x48px)
        "touch-lg": "56px", // Large touch target
      },

      // ---- Border Radius ----
      borderRadius: {
        "senior": "12px",  // Rounded corners for friendly UI
      },

      // ---- Box Shadow ----
      boxShadow: {
        "senior": "0 4px 20px rgba(0, 0, 0, 0.15)", // Soft shadow for cards
        "senior-lg": "0 8px 40px rgba(0, 0, 0, 0.2)", // Larger shadow for modals
      },

      // ---- Animation ----
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite", // Slow pulse for SOS
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },

  plugins: [],
};
