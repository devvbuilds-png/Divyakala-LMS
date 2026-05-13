/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F5ECD2",
        surface: "#FFFFFF",
        "surface-warm": "#FBF6E9",
        ink: {
          DEFAULT: "#2A1F18",
          muted: "#6B5D4A",
          soft: "#9A8B72",
        },
        chrome: {
          DEFAULT: "#2A1F18",
          text: "#F5ECD2",
          muted: "#9A8B72",
        },
        primary: {
          DEFAULT: "#C9952A",
          hover: "#B07F1F",
          soft: "#F4DFA0",
        },
        accent: {
          DEFAULT: "#D87E5D",
          soft: "#F4D6C5",
        },
        border: {
          DEFAULT: "#E5D7B3",
          soft: "#EDE3CA",
        },
        success: "#5C8A4F",
        error: "#B5482D",
      },
      fontFamily: {
        display: ['"Poppins"', "sans-serif"],
        body: ['"Poppins"', "sans-serif"],
        sans: ['"Poppins"', "sans-serif"],
      },
      boxShadow: {
        sm: "0 1px 2px rgba(42, 31, 24, 0.06)",
        md: "0 4px 12px rgba(42, 31, 24, 0.08)",
        lg: "0 12px 32px rgba(42, 31, 24, 0.10)",
        xl: "0 24px 64px rgba(42, 31, 24, 0.14)",
      },
      borderRadius: {
        "2xl": "16px",
      },
    },
  },
  plugins: [],
};
