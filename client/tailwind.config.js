import flowbitePlugin from "flowbite/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Hata veren import yerine dosya yolunu manuel ekliyoruz:
    "node_modules/flowbite-react/dist/esm/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbitePlugin,
  ],
}