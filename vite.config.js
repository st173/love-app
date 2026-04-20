import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), cloudflare()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      '.serveousercontent.com',
      '.loca.lt',
      '.ngrok.io',
      '.vercel.app'
    ]
  }
})