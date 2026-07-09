import type { Config } from "tailwindcss";
import { appColors, lightColors, darkColors } from "./src/core/theme/colors";

const config: Config = {
  darkMode: "selector",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ...appColors,
        background: appColors.grey50,
        foreground: appColors.grey900,
        light: lightColors,
        dark: darkColors,
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "var(--font-roboto)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        roboto: ["var(--font-roboto)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;