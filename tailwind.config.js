import { fontFamily } from "tailwindcss/defaultTheme";
import { fuiPreset } from "@svelte-fui/tailwindcss";

/** @type {import('tailwindcss').Config} */
const config = {
  presets: [fuiPreset],
  darkMode: ["class"],
  content: [
    "./src/**/*.{html,js,svelte, stories.svelte, ts}",
    "./src/*.{html,js,svelte, stories.svelte, ts}",
    "./node_modules/@svelte-fui/core/**/*.{html,js,svelte,ts}",
  ],
  safelist: ["dark"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      height: {
        stretch: ["-webkit-fill-available", "-moz-available"],
      },
      width: {
        stretch: ["-webkit-fill-available", "-moz-available"],
      },
      colors: {
        moddingpink: {
          signaturePink: "#ff69b4",
          hover: "color-mix(in srgb, #ff69b4, white 10%)",
        },
        beatmods: {
          pink: "#ec008c",
          purple: "#662d91",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: [...fontFamily.sans],
        nunito: ["Nunito", "serif"],
      },
    },
  },
};

export default config;
