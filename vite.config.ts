import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this repository below /kumacz/.
export default defineConfig({
  base: '/kumacz/',
  plugins: [react()],
})
