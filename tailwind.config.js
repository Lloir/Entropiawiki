module.exports = {
  purge: [
    './css/**/*.css',
    './h/**/*.html',
    './s/**/*.js',
    '.index.html',
  ],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [
    require("daisyui"),
    require("tw-elements/dist/plugin"),
  ],
  daisyui: {
    themes: ["synthwave"],
    darkMode: "class",
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
  content: [
    "./src//*.{html,js}",
    "./node_modules/tw-elements/dist/js//*.js",
  ],
};