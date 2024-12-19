import { fuiPreset } from "@svelte-fui/tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [fuiPreset],
  content: [
    "./src/**/*.{html,js,svelte, stories.svelte, ts}",
    "./node_modules/@svelte-fui/core/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
