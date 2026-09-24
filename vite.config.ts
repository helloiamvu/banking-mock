import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// host: true exposes the dev server on your LAN so a phone on the same Wi-Fi can open it
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
})
