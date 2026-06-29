import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
// export default {
//   theme: {
//     extend: {
//       keyframes: {
//         shimmer: {
//           "0%": { backgroundPosition: "-200% 0" },
//           "100%": { backgroundPosition: "200% 0" },
//         },
//       },
//       animation: {
//         shimmer: "shimmer 1.8s linear infinite",
//       },
//     },
//   },
// };