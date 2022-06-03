import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // outDir: './', this is client root
    outDir: '../server/public',
    emptyOutDir: true // empty folder before each build
  },
  server: {
    // https://vitejs.dev/config/#server-proxy
    proxy: {
      '/api': { target: 'http://localhost:8080' },
      // logout does not have a route in react router
      // appending it incase user want too logout from the api
      // throught browser URL path
      '/logout': { target: 'http://localhost:8080' }
    }
  }
})
