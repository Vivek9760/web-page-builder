import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      __APP_ENV__: JSON.stringify(env.ENVIRONMENT),
    },
    server: {
      port: env.SERVER_PORT,
      strictPort: true,
      open: true,
      proxy: {
        '/api': env.SERVER_PROXY
      }
    }
  }
})
