const tailwindcss = require("tailwindcss");
module.exports = {
  plugins: [tailwindcss("./tailwind.js"), require("autoprefixer")],
  variants: {
    borderColor: ["responsive", "hover", "focus", "focus-within"],
  },
};
