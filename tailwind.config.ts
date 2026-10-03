import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0a0a0c",
          900: "#0a0a0c",
          800: "#101013",
          700: "#16161a",
          600: "#1e1e23",
          500: "#2a2a30",
        },
        bone: {
          DEFAULT: "#f2f0ec",
          dim: "#9a9a9f",
          faint: "#63636a",
        },
        ignition: {
          DEFAULT: "#ff6a1a",
          dim: "#c9531a",
          soft: "#ff8a4d",
        },
        signal: {
          go: "#3ecf6a",
          stop: "#ff4545",
          wait: "#e8b53b",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
