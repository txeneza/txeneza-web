import type { Config } from "tailwindcss";
import { appColors, lightColors, darkColors } from "./src/core/theme/colors";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ...appColors,
        light: lightColors,
        dark: darkColors,
      },
    },
  },
  plugins: [],
};

export default config;