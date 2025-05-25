/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        "custom-green": "#2ECC71",
        "custom-green-hover": "#1abc9c",
        "custom-green-dark": "#27ae60",
        "custom-green-light": "#a1e3ba",
        "custom-bg": "#f0f9f4",
        "custom-sidebar": "#0e3326",
        "custom-header": "#104632",
      },
      boxShadow: {
        'task': '0 4px 6px rgba(46, 204, 113, 0.1), 0 1px 3px rgba(46, 204, 113, 0.08)',
        'task-hover': '0 10px 15px rgba(46, 204, 113, 0.15), 0 4px 6px rgba(46, 204, 113, 0.1)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};
