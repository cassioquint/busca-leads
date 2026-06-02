import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Define que o caractere '@' aponta direto para a sua pasta 'src'
      '@': path.resolve(__dirname, './src'),
    },
  },
})
